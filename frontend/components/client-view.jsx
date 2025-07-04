"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, User, MapPin, Phone, Mail, Building, CreditCard } from "lucide-react"

export default function ClientView({ client, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "actif":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactif":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "suspendu":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "professionnel":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "particulier":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Barre d'Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {client.prenom} {client.nom}
          </h2>
          <p className="text-gray-600">Détails du client {client.id}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.prenom} ${client.nom} ?`)) {
                onDelete()
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Affichage des Détails */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations Personnelles */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Prénom</p>
                <p className="font-semibold">{client.prenom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-semibold">{client.nom}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type de Client</p>
                <Badge className={getTypeColor(client.typeClient)}>
                  {client.typeClient.charAt(0).toUpperCase() + client.typeClient.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                <Badge className={getStatusColor(client.statut)}>
                  {client.statut.charAt(0).toUpperCase() + client.statut.slice(1)}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de Création</p>
              <p className="font-semibold">{formatDate(client.dateCreation)}</p>
            </div>
            {client.entreprise && (
              <div>
                <p className="text-sm text-gray-500">Entreprise</p>
                <p className="font-semibold">{client.entreprise}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coordonnées */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Coordonnées
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Adresse</p>
              <p className="font-semibold whitespace-pre-line">{client.adresse}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Ville</p>
                <p className="font-semibold">{client.ville}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Code Postal</p>
                <p className="font-semibold">{client.codePostal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pays</p>
                <p className="font-semibold">{client.pays}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-semibold">{client.telephone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{client.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations Professionnelles */}
        {client.typeClient === "professionnel" && (
          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informations Professionnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">SIRET</p>
                  <p className="font-semibold font-mono">{client.siret || "Non renseigné"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Numéro TVA</p>
                  <p className="font-semibold font-mono">{client.tva || "Non renseigné"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conditions Commerciales */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Conditions Commerciales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Conditions de Paiement</p>
                <p className="font-semibold">{client.conditionsPaiement}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Limite de Crédit</p>
                <p className="font-semibold">{client.limiteCredit ? `${client.limiteCredit} €` : "Non définie"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Remise Accordée</p>
              <p className="font-semibold">{client.remiseAccordee}</p>
            </div>
            {client.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{client.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
