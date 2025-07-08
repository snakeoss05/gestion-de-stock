"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Search } from "lucide-react"

export default function ClientList({ clients, onView, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("tous")
  const [typeFilter, setTypeFilter] = useState("tous")

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.entreprise && client.entreprise.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "tous" || client.statut === statusFilter
    const matchesType = typeFilter === "tous" || client.typeClient === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

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

  return (
    <div className="space-y-4">
      {/* Recherche et Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher des clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "tous" ? "default" : "outline"}
            onClick={() => setStatusFilter("tous")}
            size="sm"
          >
            Tous
          </Button>
          <Button
            variant={statusFilter === "actif" ? "default" : "outline"}
            onClick={() => setStatusFilter("actif")}
            size="sm"
          >
            Actifs
          </Button>
          <Button
            variant={typeFilter === "professionnel" ? "default" : "outline"}
            onClick={() => setTypeFilter("professionnel")}
            size="sm"
          >
            Pro
          </Button>
          <Button
            variant={typeFilter === "particulier" ? "default" : "outline"}
            onClick={() => setTypeFilter("particulier")}
            size="sm"
          >
            Particulier
          </Button>
        </div>
      </div>

      {/* Tableau des Clients */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4 font-semibold">ID</th>
              <th className="text-left p-4 font-semibold">Nom</th>
              <th className="text-left p-4 font-semibold">Contact</th>
              <th className="text-left p-4 font-semibold">Ville</th>
              <th className="text-left p-4 font-semibold">Type</th>
              <th className="text-left p-4 font-semibold">Statut</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono font-semibold text-rose-600">{client.id}</td>
                <td className="p-4">
                  <div>
                    <div className="font-medium">
                      {client.prenom} {client.nom}
                    </div>
                    {client.entreprise && <div className="text-sm text-gray-500">{client.entreprise}</div>}
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium">{client.email}</div>
                    <div className="text-sm text-gray-500">{client.telephone}</div>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{client.ville}</td>
                <td className="p-4">
                  <Badge className={getTypeColor(client.typeClient)}>
                    {client.typeClient.charAt(0).toUpperCase() + client.typeClient.slice(1)}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge className={getStatusColor(client.statut)}>
                    {client.statut.charAt(0).toUpperCase() + client.statut.slice(1)}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onView(client)} title="Voir les détails">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onEdit(client)} title="Modifier">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.prenom} ${client.nom} ?`)) {
                          onDelete(client.id)
                        }
                      }}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun client trouvé correspondant à vos critères.</p>
        </div>
      )}
    </div>
  )
}
