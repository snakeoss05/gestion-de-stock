"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Building, Phone, Mail, MapPin, User, CreditCard } from "lucide-react"

export default function SupplierForm({ supplier, onSubmit, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "France",
    siret: "",
    tva: "",
    typeActivite: "",
    personneContact: "",
    telephoneContact: "",
    emailContact: "",
    conditionsPaiement: "",
    remiseHabituelle: "",
    notes: "",
    statut: "actif",
  })

  useEffect(() => {
    if (supplier && isEditing) {
      setFormData(supplier)
    }
  }, [supplier, isEditing])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations Générales */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informations Générales
          </CardTitle>
          <CardDescription className="text-emerald-100">Détails de base du fournisseur</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l'Entreprise *</Label>
              <Input
                id="nom"
                placeholder="Nom du fournisseur"
                value={formData.nom}
                onChange={(e) => handleInputChange("nom", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeActivite">Type d'Activité</Label>
              <Input
                id="typeActivite"
                placeholder="Ex: Distributeur, Fabricant..."
                value={formData.typeActivite}
                onChange={(e) => handleInputChange("typeActivite", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siret">SIRET</Label>
              <Input
                id="siret"
                placeholder="Numéro SIRET"
                value={formData.siret}
                onChange={(e) => handleInputChange("siret", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tva">Numéro TVA</Label>
              <Input
                id="tva"
                placeholder="Numéro de TVA intracommunautaire"
                value={formData.tva}
                onChange={(e) => handleInputChange("tva", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="statut">Statut</Label>
            <Select value={formData.statut} onValueChange={(value) => handleInputChange("statut", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
                <SelectItem value="suspendu">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Coordonnées */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Coordonnées
          </CardTitle>
          <CardDescription className="text-blue-100">Adresse et informations de contact</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse Complète *</Label>
            <Textarea
              id="adresse"
              placeholder="Adresse complète du fournisseur"
              value={formData.adresse}
              onChange={(e) => handleInputChange("adresse", e.target.value)}
              className="min-h-[80px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ville">Ville *</Label>
              <Input
                id="ville"
                placeholder="Ville"
                value={formData.ville}
                onChange={(e) => handleInputChange("ville", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codePostal">Code Postal *</Label>
              <Input
                id="codePostal"
                placeholder="Code postal"
                value={formData.codePostal}
                onChange={(e) => handleInputChange("codePostal", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pays">Pays *</Label>
              <Input
                id="pays"
                placeholder="Pays"
                value={formData.pays}
                onChange={(e) => handleInputChange("pays", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone Principal *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="telephone"
                  placeholder="01 23 45 67 89"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange("telephone", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Principal *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@fournisseur.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personne de Contact */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personne de Contact
          </CardTitle>
          <CardDescription className="text-purple-100">Contact principal chez le fournisseur</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="personneContact">Nom du Contact</Label>
              <Input
                id="personneContact"
                placeholder="Prénom Nom"
                value={formData.personneContact}
                onChange={(e) => handleInputChange("personneContact", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephoneContact">Téléphone Direct</Label>
              <Input
                id="telephoneContact"
                placeholder="01 23 45 67 89"
                value={formData.telephoneContact}
                onChange={(e) => handleInputChange("telephoneContact", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailContact">Email Direct</Label>
              <Input
                id="emailContact"
                type="email"
                placeholder="contact@fournisseur.com"
                value={formData.emailContact}
                onChange={(e) => handleInputChange("emailContact", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conditions Commerciales */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Conditions Commerciales
          </CardTitle>
          <CardDescription className="text-orange-100">Conditions de paiement et remises</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="conditionsPaiement">Conditions de Paiement</Label>
              <Input
                id="conditionsPaiement"
                placeholder="Ex: 30 jours fin de mois"
                value={formData.conditionsPaiement}
                onChange={(e) => handleInputChange("conditionsPaiement", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remiseHabituelle">Remise Habituelle</Label>
              <Input
                id="remiseHabituelle"
                placeholder="Ex: 5%"
                value={formData.remiseHabituelle}
                onChange={(e) => handleInputChange("remiseHabituelle", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes et Commentaires</Label>
            <Textarea
              id="notes"
              placeholder="Informations supplémentaires sur le fournisseur"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4 pt-6">
        <Button type="button" variant="outline" onClick={onCancel} className="px-8 py-3 bg-transparent">
          Annuler
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3"
        >
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? "Modifier le Fournisseur" : "Créer le Fournisseur"}
        </Button>
      </div>
    </form>
  )
}
