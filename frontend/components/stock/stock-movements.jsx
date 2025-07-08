"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, TrendingDown, RefreshCw, Calendar, User, FileText } from "lucide-react"

export default function StockMovements({ movements, stockData }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("Tous")
  const [dateFilter, setDateFilter] = useState("7") // Derniers 7 jours par défaut

  // Filtrage des mouvements
  const filteredMovements = movements.filter((movement) => {
    const matchesSearch =
      movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reason.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "Tous" || movement.type === typeFilter

    const movementDate = new Date(movement.date)
    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - Number.parseInt(dateFilter))
    const matchesDate = dateFilter === "all" || movementDate >= daysAgo

    return matchesSearch && matchesType && matchesDate
  })

  const getMovementIcon = (type) => {
    switch (type) {
      case "entrée":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "sortie":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "ajustement":
        return <RefreshCw className="h-4 w-4 text-blue-600" />
      default:
        return <RefreshCw className="h-4 w-4 text-gray-600" />
    }
  }

  const getMovementColor = (type) => {
    switch (type) {
      case "entrée":
        return "bg-green-100 text-green-800 border-green-200"
      case "sortie":
        return "bg-red-100 text-red-800 border-red-200"
      case "ajustement":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatQuantity = (type, quantity) => {
    if (type === "ajustement") {
      return quantity > 0 ? `+${quantity}` : `${quantity}`
    }
    return quantity.toString()
  }

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher dans les mouvements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={typeFilter === "Tous" ? "default" : "outline"}
            onClick={() => setTypeFilter("Tous")}
            size="sm"
          >
            Tous
          </Button>
          <Button
            variant={typeFilter === "entrée" ? "default" : "outline"}
            onClick={() => setTypeFilter("entrée")}
            size="sm"
          >
            Entrées
          </Button>
          <Button
            variant={typeFilter === "sortie" ? "default" : "outline"}
            onClick={() => setTypeFilter("sortie")}
            size="sm"
          >
            Sorties
          </Button>
          <Button
            variant={typeFilter === "ajustement" ? "default" : "outline"}
            onClick={() => setTypeFilter("ajustement")}
            size="sm"
          >
            Ajustements
          </Button>
        </div>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="1">Aujourd'hui</option>
          <option value="7">7 derniers jours</option>
          <option value="30">30 derniers jours</option>
          <option value="90">90 derniers jours</option>
          <option value="all">Tout l'historique</option>
        </select>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800">Entrées</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {filteredMovements.filter((m) => m.type === "entrée").reduce((sum, m) => sum + m.quantity, 0)}
          </p>
          <p className="text-sm text-green-600">unités ajoutées</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <span className="font-semibold text-red-800">Sorties</span>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {filteredMovements.filter((m) => m.type === "sortie").reduce((sum, m) => sum + m.quantity, 0)}
          </p>
          <p className="text-sm text-red-600">unités sorties</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Ajustements</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {filteredMovements.filter((m) => m.type === "ajustement").length}
          </p>
          <p className="text-sm text-blue-600">corrections effectuées</p>
        </div>
      </div>

      {/* Liste des mouvements */}
      <div className="space-y-3">
        {filteredMovements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun mouvement trouvé pour les critères sélectionnés.</p>
          </div>
        ) : (
          filteredMovements.map((movement) => (
            <div key={movement.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getMovementIcon(movement.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{movement.productName}</h4>
                      <Badge className={getMovementColor(movement.type)}>
                        {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{movement.reason}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(movement.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {movement.user}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {movement.reference}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    <span
                      className={
                        movement.type === "entrée"
                          ? "text-green-600"
                          : movement.type === "sortie"
                            ? "text-red-600"
                            : "text-blue-600"
                      }
                    >
                      {formatQuantity(movement.type, movement.quantity)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">unités</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {movement.previousStock} → {movement.newStock}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
