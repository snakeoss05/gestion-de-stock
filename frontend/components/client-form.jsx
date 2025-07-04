"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, User, Phone, Mail, MapPin, Building, CreditCard } from "lucide-react"

export default function ClientForm({ client, onSubmit, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    entreprise: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "France",
    siret: "",
    tva: "",
    typeClient: "particulier",
    conditionsPaiement: "Comptant",
    limiteCredit: "",
    remiseAccordee: "0%",
    notes: "",
    statut: "actif",
  })

  useEffect(() => {
    if (client && isEditing) {
      setFormData(client)
    }
  }, [client, isEditing])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations Personnelles */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations Personnelles
          </CardTitle>
          <CardDescription className="text-rose-100">Détails personnels du client</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                placeholder="Prénom du client"
                value={formData.prenom}
                onChange={(e) => handleInputChange("prenom", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                placeholder="Nom du client"
                value={formData.nom}
                onChange={(e) => handleInputChange("nom", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="typeClient">Type de Client</Label>
              <Select value={formData.typeClient} onValueChange={(value) => handleInputChange("typeClient", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="particulier">Particulier</SelectItem>
                  <SelectItem value="professionnel">Professionnel</SelectItem>
                </SelectContent>
              </Select>
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
          </div>

          {formData.typeClient === "professionnel" && (
            <div className="space-y-2">
              <Label htmlFor="entreprise">Nom de l'Entreprise</Label>
              <Input
                id="entreprise"
                placeholder="Nom de l'entreprise"
                value={formData.entreprise}
                onChange={(e) => handleInputChange("entreprise", e.target.value)}
              />
            </div>
          )}
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
              placeholder="Adresse complète du client"
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
              <Label htmlFor="telephone">Téléphone *</Label>
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
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="client@email.com"
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

      {/* Informations Professionnelles */}
      {formData.typeClient === "professionnel" && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informations Professionnelles
            </CardTitle>
            <CardDescription className="text-purple-100">Détails de l'entreprise</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
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
          </CardContent>
        </Card>
      )}

      {/* Conditions Commerciales */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Conditions Commerciales
          </CardTitle>
          <CardDescription className="text-orange-100">Conditions de paiement et limites</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="conditionsPaiement">Conditions de Paiement</Label>
              <Select
                value={formData.conditionsPaiement}
                onValueChange={(value) => handleInputChange("conditionsPaiement", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Comptant">Comptant</SelectItem>
                  <SelectItem value="15 jours">15 jours</SelectItem>
                  <SelectItem value="30 jours">30 jours</SelectItem>
                  <SelectItem value="45 jours">45 jours</SelectItem>
                  <SelectItem value="60 jours">60 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="limiteCredit">Limite de Crédit (€)</Label>
              <Input
                id="limiteCredit"
                type="number"
                placeholder="0"
                value={formData.limiteCredit}
                onChange={(e) => handleInputChange("limiteCredit", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remiseAccordee">Remise Accordée</Label>
              <Input
                id="remiseAccordee"
                placeholder="Ex: 5%"
                value={formData.remiseAccordee}
                onChange={(e) => handleInputChange("remiseAccordee", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes et Commentaires</Label>
            <Textarea
              id="notes"
              placeholder="Informations supplémentaires sur le client"
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
          className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-3"
        >
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? "Modifier le Client" : "Créer le Client"}
        </Button>
      </div>
    </form>
  )
}
