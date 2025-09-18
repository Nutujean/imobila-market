import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Stripe from "stripe";

// ===== Config =====
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ===== MongoDB =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectat la MongoDB Atlas"))
  .catch((err) => console.error("❌ Eroare MongoDB:", err));

// ===== Models =====
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

const anuntSchema = new mongoose.Schema({
  titlu: String,
  descriere: String,
  pret: Number,
  categorie: String,
  tranzactie: { type: String, default: "Vânzare" }, // Vânzare / Închiriere / Cumpărare
  imagini: [String],
  userId: String,
  pachet: { type: String, default: "Gratuit" }, // Gratuit / Gold / Diamond
});
const Anunt = mongoose.model("Anunt", anuntSchema);

// ===== Cloudinary Setup =====
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "anunturi",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage });

// ===== Middleware Auth =====
function auth(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Acces interzis" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(400).json({ error: "Token invalid" });
  }
}

// ===== Auth Routes =====
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashed });
  await user.save();
  res.json({ message: "✅ Utilizator înregistrat" });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Email invalid" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Parolă greșită" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ token });
});

// ===== CRUD Anunțuri =====
app.post("/api/anunturi", auth, upload.array("imagini", 10), async (req, res) => {
  try {
    const imagini = req.files.map((f) => f.path);
    const anunt = new Anunt({
      titlu: req.body.titlu,
      descriere: req.body.descriere,
      pret: req.body.pret,
      categorie: req.body.categorie,
      tranzactie: req.body.tranzactie,
      imagini,
      userId: req.user.id,
    });
    await anunt.save();
    res.json(anunt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la crearea anunțului" });
  }
});

app.get("/api/anunturi", async (req, res) => {
  const anunturi = await Anunt.find().sort({ _id: -1 });
  res.json(anunturi);
});

app.get("/api/anunturi/:id", async (req, res) => {
  try {
    const anunt = await Anunt.findById(req.params.id);
    if (!anunt) return res.status(404).json({ error: "Anunțul nu a fost găsit" });
    res.json(anunt);
  } catch (err) {
    res.status(500).json({ error: "Eroare server" });
  }
});

app.put("/api/anunturi/:id", auth, upload.array("imagini", 10), async (req, res) => {
  try {
    const imagini = req.files.length > 0 ? req.files.map((f) => f.path) : req.body.imagini;
    const anunt = await Anunt.findByIdAndUpdate(
      req.params.id,
      {
        titlu: req.body.titlu,
        descriere: req.body.descriere,
        pret: req.body.pret,
        categorie: req.body.categorie,
        tranzactie: req.body.tranzactie,
        imagini,
      },
      { new: true }
    );
    res.json(anunt);
  } catch (err) {
    res.status(500).json({ error: "Eroare la editarea anunțului" });
  }
});

app.delete("/api/anunturi/:id", auth, async (req, res) => {
  try {
    await Anunt.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Anunț șters" });
  } catch (err) {
    res.status(500).json({ error: "Eroare la ștergerea anunțului" });
  }
});

// ===== Stripe =====
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/api/plata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { pachet } = req.body;

    let pret = 0;
    let numePachet = "Gratuit";

    if (pachet === "Gold") {
      pret = 2500; // 25 lei
      numePachet = "⭐ Pachet Gold";
    } else if (pachet === "Diamond") {
      pret = 4900; // 49 lei
      numePachet = "💎 Pachet Diamond";
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "ron",
            product_data: { name: numePachet },
            unit_amount: pret,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/succes-plata`,
      cancel_url: `${process.env.FRONTEND_URL}/eroare-plata`,
    });

    if (pachet === "Gold" || pachet === "Diamond") {
      await Anunt.findByIdAndUpdate(id, { pachet });
    }

    res.json({ url: session.url });
  } catch (err) {
    console.error("Eroare la plata Stripe:", err);
    res.status(500).json({ error: "Eroare server Stripe" });
  }
});

// ===== Start Server =====
app.listen(PORT, () =>
  console.log(`✅ Server Oltenita Imobiliare pornit pe portul ${PORT}`)
);
