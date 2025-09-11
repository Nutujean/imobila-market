import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // acceptă JSON

// 🔹 Conexiune MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectat la MongoDB"))
  .catch((err) => console.error("❌ Eroare DB:", err));

// 🔹 Schema + model Anunt
const anuntSchema = new mongoose.Schema(
  {
    titlu: String,
    descriere: String,
    pret: Number,
    imagini: [String], // acum sunt DOAR linkuri Cloudinary
    userId: String, // opțional, dacă vrei să legi anunțul de utilizator
  },
  { timestamps: true }
);

const Anunt = mongoose.model("Anunt", anuntSchema);

// 🔹 POST - Adaugă anunț
app.post("/api/anunturi", async (req, res) => {
  try {
    const { titlu, descriere, pret, imagini } = req.body;
    if (!titlu || !descriere || !pret || !imagini) {
      return res
        .status(400)
        .json({ message: "Toate câmpurile sunt obligatorii." });
    }

    const anuntNou = new Anunt({ titlu, descriere, pret, imagini });
    await anuntNou.save();

    res
      .status(201)
      .json({ message: "✅ Anunț adăugat cu succes!", anunt: anuntNou });
  } catch (err) {
    res.status(500).json({ message: "Eroare server: " + err.message });
  }
});

// 🔹 GET - Listează toate anunțurile
app.get("/api/anunturi", async (req, res) => {
  const anunturi = await Anunt.find().sort({ createdAt: -1 });
  res.json(anunturi);
});

// 🔹 Pornire server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server pornit pe portul ${PORT}`));
