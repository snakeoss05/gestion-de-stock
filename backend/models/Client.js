import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    entreprise: { type: String },
    email: { type: String },
    telephone: { type: String },
    adresse: { type: String },
    ville: { type: String },
    codePostal: { type: String },
    pays: { type: String, default: "France" },
    siret: { type: String },
    tva: { type: String },
    typeClient: {
      type: String,
      enum: ["particulier", "entreprise"],
      default: "particulier",
    },
    conditionsPaiement: {
      type: String,
      enum: ["Comptant", "30 jours", "60 jours"],
      default: "Comptant",
    },
    limiteCredit: { type: Number },
    remiseAccordee: { type: String, default: "0%" },
    notes: { type: String },
    statut: {
      type: String,
      enum: ["actif", "inactif"],
      default: "actif",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
