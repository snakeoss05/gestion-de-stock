"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Search } from "lucide-react"

export default function SupplierList({ suppliers, onView, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("tous")

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.typeActivite.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "tous" || supplier.statut === statusFilter
    return matchesSearch && matchesStatus
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

  return (
    <div className="space-y-4">
      {/* Recherche et Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher des fournisseurs..."
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
            variant={statusFilter === "inactif" ? "default" : "outline"}
            onClick={() => setStatusFilter("inactif")}
            size="sm"
          >
            Inactifs
          </Button>
        </div>
      </div>

      {/* Tableau des Fournisseurs */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4 font-semibold">ID</th>
              <th className="text-left p-4 font-semibold">Nom</th>
              <th className="text-left p-4 font-semibold">Contact</th>
              <th className="text-left p-4 font-semibold">Ville</th>
              <th className="text-left p-4 font-semibold">Type d'Activité</th>
              <th className="text-left p-4 font-semibold">Statut</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono font-semibold text-emerald-600">{supplier.id}</td>
                <td className="p-4">
                  <div>
                    <div className="font-medium">{supplier.nom}</div>
                    <div className="text-sm text-gray-500">{supplier.email}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium">{supplier.personneContact || "Non défini"}</div>
                    <div className="text-sm text-gray-500">{supplier.telephone}</div>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{supplier.ville}</td>
                <td className="p-4 text-gray-600">{supplier.typeActivite || "Non spécifié"}</td>
                <td className="p-4">
                  <Badge className={getStatusColor(supplier.statut)}>
                    {supplier.statut.charAt(0).toUpperCase() + supplier.statut.slice(1)}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onView(supplier)} title="Voir les détails">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onEdit(supplier)} title="Modifier">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm(`Êtes-vous sûr de vouloir supprimer le fournisseur ${supplier.nom} ?`)) {
                          onDelete(supplier.id)
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

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun fournisseur trouvé correspondant à vos critères.</p>
        </div>
      )}
    </div>
  )
}
