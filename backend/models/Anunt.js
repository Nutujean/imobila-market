import mongoose from "mongoose";

const AnuntSchema = new mongoose.Schema(
  {
    titlu: { type: String, required: true },
    descriere: { type: String, required: true },
    pret: { type: Number, required: true },
    categorie: { type: String, required: true },
    tranzactie: {
      type: String,
      enum: ["Vânzare", "Cumpărare", "Închiriere"],
      default: "Vânzare",
    },
    imagini: [String],

    // 🔹 legătura cu utilizatorul care a adăugat anunțul
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // 🔹 Pachete și Premium
    pachet: {
      type: String,
      enum: ["Basic", "Gold", "Diamond"],
      default: "Basic",
    },
    premium: { type: Boolean, default: false }, // dacă e premium activ
    expiryDate: { type: Date, default: null },  // data expirării pachetului

    // 🔹 anti-abuz (ultima reactualizare)
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Anunt", AnuntSchema);
