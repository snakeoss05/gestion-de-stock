"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Package, Search, Plus, Minus, Save } from "lucide-react"

const ADJUSTMENT_REASONS = [
  "Inventaire - Écart de comptage",
  "Casse/Détérioration",
  "Vol/Perte",
  "Erreur de saisie",
  "Retour client",
  "Échantillon/Démonstration",
  "Correction manuelle",
  "Autre",
]

export default function StockAdjustment({ stockData, onStockUpdate }) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [adjustmentType, setAdjustmentType] = useState("manual") // manual, inventory
  const [newQuantity, setNewQuantity] = useState("")
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("")
  const [reason, setReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [reference, setReference] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrage des produits
  const filteredProducts = stockData.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code_barre.includes(searchTerm),
  )

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    setNewQuantity(product.currentStock.toString())
    setAdjustmentQuantity("")
  }

  const calculateAdjustment = () => {
    if (!selectedProduct || !newQuantity) return 0
    return Number.parseInt(newQuantity) - selectedProduct.currentStock
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!selectedProduct) return

    let quantity
    const finalReason = reason === "Autre" ? customReason : reason

    if (adjustmentType === "manual") {
      quantity = calculateAdjustment()
    } else {
      quantity = Number.parseInt(adjustmentQuantity) || 0
    }

    if (quantity === 0) return

    onStockUpdate({
      productId: selectedProduct.id,
      productName: selectedProduct.productName,
      type: "ajustement",
      quantity: quantity,
      reason: finalReason,
      reference: reference || `ADJ-${Date.now()}`,
      previousStock: selectedProduct.currentStock,
      newStock: selectedProduct.currentStock + quantity,
    })

    // Reset form
    setSelectedProduct(null)
    setNewQuantity("")
    setAdjustmentQuantity("")
    setReason("")
    setCustomReason("")
    setReference("")
    setSearchTerm("")
  }

  return (
    <div className="space-y-6">
      {/* Sélection du produit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Sélection du Produit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un produit à ajuster..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {searchTerm && (
            <div className="max-h-48 overflow-y-auto border rounded-lg">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleProductSelect(product)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{product.productName}</div>
                      <div className="text-sm text-gray-500">{product.brandName}</div>
                      <div className="text-xs text-gray-400 font-mono">{product.code_barre}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">Stock: {product.currentStock}</div>
                      <div className="text-sm text-gray-500">{product.location}</div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="p-4 text-center text-gray-500">Aucun produit trouvé</div>
              )}
            </div>
          )}

          {selectedProduct && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-blue-800">{selectedProduct.productName}</h4>
                    <p className="text-sm text-blue-600">{selectedProduct.brandName}</p>
                    <p className="text-xs text-blue-500 font-mono">{selectedProduct.code_barre}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-800">Stock Actuel: {selectedProduct.currentStock}</div>
                    <div className="text-sm text-blue-600">{selectedProduct.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Formulaire d'ajustement */}
      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Ajustement de Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type d'ajustement */}
              <div className="space-y-2">
                <Label>Type d'Ajustement</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={adjustmentType === "manual" ? "default" : "outline"}
                    onClick={() => setAdjustmentType("manual")}
                  >
                    Nouveau Stock Total
                  </Button>
                  <Button
                    type="button"
                    variant={adjustmentType === "quantity" ? "default" : "outline"}
                    onClick={() => setAdjustmentType("quantity")}
                  >
                    Quantité d'Ajustement
                  </Button>
                </div>
              </div>

              {/* Saisie selon le type */}
              {adjustmentType === "manual" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newQuantity">Nouveau Stock Total</Label>
                    <Input
                      id="newQuantity"
                      type="number"
                      min="0"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock Actuel</Label>
                    <Input value={selectedProduct.currentStock} readOnly className="bg-gray-100" />
                  </div>
                  <div className="space-y-2">
                    <Label>Différence</Label>
                    <div className="flex items-center h-10 px-3 py-2 border rounded-md bg-gray-50">
                      {calculateAdjustment() > 0 ? (
                        <span className="text-green-600 font-semibold">
                          <Plus className="h-4 w-4 inline mr-1" />
                          {calculateAdjustment()}
                        </span>
                      ) : calculateAdjustment() < 0 ? (
                        <span className="text-red-600 font-semibold">
                          <Minus className="h-4 w-4 inline mr-1" />
                          {Math.abs(calculateAdjustment())}
                        </span>
                      ) : (
                        <span className="text-gray-500">0</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adjustmentQuantity">Quantité d'Ajustement</Label>
                    <Input
                      id="adjustmentQuantity"
                      type="number"
                      placeholder="Positif pour ajouter, négatif pour retirer"
                      value={adjustmentQuantity}
                      onChange={(e) => setAdjustmentQuantity(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Utilisez un nombre positif pour ajouter du stock, négatif pour en retirer
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Nouveau Stock Calculé</Label>
                    <div className="flex items-center h-10 px-3 py-2 border rounded-md bg-gray-50">
                      <span className="font-semibold">
                        {selectedProduct.currentStock + (Number.parseInt(adjustmentQuantity) || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Raison et référence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Raison de l'Ajustement *</Label>
                  <Select value={reason} onValueChange={setReason} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une raison" />
                    </SelectTrigger>
                    <SelectContent>
                      {ADJUSTMENT_REASONS.map((reasonOption) => (
                        <SelectItem key={reasonOption} value={reasonOption}>
                          {reasonOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Référence</Label>
                  <Input
                    id="reference"
                    placeholder="Référence du document (optionnel)"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>
              </div>

              {/* Raison personnalisée */}
              {reason === "Autre" && (
                <div className="space-y-2">
                  <Label htmlFor="customReason">Raison Personnalisée *</Label>
                  <Textarea
                    id="customReason"
                    placeholder="Décrivez la raison de l'ajustement..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedProduct(null)
                    setSearchTerm("")
                  }}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !reason ||
                    (reason === "Autre" && !customReason) ||
                    (adjustmentType === "manual" && calculateAdjustment() === 0) ||
                    (adjustmentType === "quantity" && !adjustmentQuantity)
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer l'Ajustement
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
