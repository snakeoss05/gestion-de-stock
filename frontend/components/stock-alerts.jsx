"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Package, Plus, ShoppingCart, RefreshCw } from "lucide-react"

export default function StockAlerts({ stockData, lowStockItems, outOfStockItems, onStockUpdate }) {
  const [selectedItems, setSelectedItems] = useState([])
  const [bulkQuantity, setBulkQuantity] = useState("")

  const allAlerts = [
    ...outOfStockItems.map((item) => ({ ...item, alertType: "rupture", priority: "high" })),
    ...lowStockItems
      .filter((item) => item.currentStock > 0)
      .map((item) => ({ ...item, alertType: "faible", priority: "medium" })),
  ]

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleSelectAll = () => {
    if (selectedItems.length === allAlerts.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(allAlerts.map((item) => item.id))
    }
  }

  const handleBulkRestock = () => {
    if (!bulkQuantity || selectedItems.length === 0) return

    selectedItems.forEach((itemId) => {
      const item = stockData.find((p) => p.id === itemId)
      if (item) {
        onStockUpdate({
          productId: item.id,
          productName: item.productName,
          type: "entrée",
          quantity: Number.parseInt(bulkQuantity),
          reason: "Réapprovisionnement - Alerte Stock",
          reference: `RESTOCK-${Date.now()}`,
          previousStock: item.currentStock,
          newStock: item.currentStock + Number.parseInt(bulkQuantity),
        })
      }
    })

    setSelectedItems([])
    setBulkQuantity("")
  }

  const getAlertColor = (alertType) => {
    switch (alertType) {
      case "rupture":
        return "bg-red-100 text-red-800 border-red-200"
      case "faible":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case "rupture":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "faible":
        return <Package className="h-4 w-4 text-orange-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getSuggestedQuantity = (item) => {
    if (item.alertType === "rupture") {
      return item.minStock * 2 // Double du stock minimum pour les ruptures
    } else {
      return item.maxStock - item.currentStock // Compléter jusqu'au maximum
    }
  }

  return (
    <div className="space-y-6">
      {/* Résumé des alertes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Ruptures de Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-2">{outOfStockItems.length}</div>
            <p className="text-red-700 text-sm">Produits en rupture nécessitant un réapprovisionnement urgent</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Package className="h-5 w-5" />
              Stock Faible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {lowStockItems.filter((item) => item.currentStock > 0).length}
            </div>
            <p className="text-orange-700 text-sm">Produits sous le seuil minimum recommandé</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions en lot */}
      {allAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Actions en Lot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleSelectAll} size="sm">
                {selectedItems.length === allAlerts.length ? "Tout Désélectionner" : "Tout Sélectionner"}
              </Button>
              <span className="text-sm text-gray-600">
                {selectedItems.length} produit{selectedItems.length > 1 ? "s" : ""} sélectionné
                {selectedItems.length > 1 ? "s" : ""}
              </span>
            </div>

            {selectedItems.length > 0 && (
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  placeholder="Quantité à ajouter"
                  value={bulkQuantity}
                  onChange={(e) => setBulkQuantity(e.target.value)}
                  className="w-48"
                />
                <Button
                  onClick={handleBulkRestock}
                  disabled={!bulkQuantity}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Réapprovisionner
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Liste des alertes */}
      <div className="space-y-3">
        {allAlerts.length === 0 ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">Aucune Alerte Stock</h3>
              <p className="text-green-700">Tous vos produits ont des niveaux de stock satisfaisants !</p>
            </CardContent>
          </Card>
        ) : (
          allAlerts.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="mt-1"
                    />
                    {getAlertIcon(item.alertType)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{item.productName}</h4>
                        <Badge className={getAlertColor(item.alertType)}>
                          {item.alertType === "rupture" ? "RUPTURE" : "STOCK FAIBLE"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.brandName}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          Stock actuel: <strong>{item.currentStock}</strong>
                        </span>
                        <span>
                          Minimum: <strong>{item.minStock}</strong>
                        </span>
                        <span>
                          Emplacement: <strong>{item.location}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-sm text-gray-500">
                      Quantité suggérée: <strong>{getSuggestedQuantity(item)}</strong>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        onStockUpdate({
                          productId: item.id,
                          productName: item.productName,
                          type: "entrée",
                          quantity: getSuggestedQuantity(item),
                          reason: "Réapprovisionnement - Alerte Stock",
                          reference: `RESTOCK-${Date.now()}`,
                          previousStock: item.currentStock,
                          newStock: item.currentStock + getSuggestedQuantity(item),
                        })
                      }
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Réapprovisionner
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
