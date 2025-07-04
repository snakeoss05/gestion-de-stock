"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Save, User, Calendar, DollarSign, FileText, Scan, ShoppingCart, TrendingUp } from "lucide-react"
import ProductScanner from "./product-scanner"

export default function InvoiceForm({ invoice, onSubmit, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState({
    type: "vente", // "vente" or "achat"
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    items: [{ id: 1, description: "", quantity: 1, price: 0, total: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: "",
    status: "en_attente",
  })

  const [showProductScanner, setShowProductScanner] = useState(false)

  useEffect(() => {
    if (invoice && isEditing) {
      setFormData(invoice)
    }
  }, [invoice, isEditing])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }

    if (field === "quantity" || field === "price") {
      newItems[index].total = newItems[index].quantity * newItems[index].price
    }

    setFormData((prev) => ({ ...prev, items: newItems }))
    calculateTotals(newItems)
  }

  const addItem = () => {
    const newItem = {
      id: formData.items.length + 1,
      description: "",
      quantity: 1,
      price: 0,
      total: 0,
    }
    setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }))
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, items: newItems }))
      calculateTotals(newItems)
    }
  }

  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.2 // 20% TVA
    const total = subtotal + tax

    setFormData((prev) => ({
      ...prev,
      subtotal: subtotal,
      tax: tax,
      total: total,
    }))
  }

  const handleProductSelected = (product) => {
    const newItems = [...formData.items, product]
    setFormData((prev) => ({ ...prev, items: newItems }))
    calculateTotals(newItems)
    setShowProductScanner(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const getTypeLabel = (type) => {
    return type === "vente" ? "Vente" : "Achat"
  }

  const getCustomerLabel = () => {
    return formData.type === "vente" ? "Client" : "Fournisseur"
  }

  if (showProductScanner) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <ProductScanner onProductSelect={handleProductSelected} onClose={() => setShowProductScanner(false)} />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type de Facture */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Type de Facture
          </CardTitle>
          <CardDescription className="text-indigo-100">Sélectionnez le type de facture</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={formData.type === "vente" ? "default" : "outline"}
              onClick={() => handleInputChange("type", "vente")}
              className={`h-20 flex flex-col items-center gap-2 ${
                formData.type === "vente" ? "bg-green-600 hover:bg-green-700 text-white" : "border-2 hover:bg-green-50"
              }`}
            >
              <TrendingUp className="h-6 w-6" />
              <span className="font-semibold">Facture de Vente</span>
            </Button>
            <Button
              type="button"
              variant={formData.type === "achat" ? "default" : "outline"}
              onClick={() => handleInputChange("type", "achat")}
              className={`h-20 flex flex-col items-center gap-2 ${
                formData.type === "achat" ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-2 hover:bg-blue-50"
              }`}
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="font-semibold">Facture d'Achat</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informations Client/Fournisseur */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations {getCustomerLabel()}
          </CardTitle>
          <CardDescription className="text-blue-100">
            Saisissez les détails du {getCustomerLabel().toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nom du {getCustomerLabel()} *</Label>
              <Input
                id="customerName"
                placeholder={`Nom du ${getCustomerLabel().toLowerCase()}`}
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email du {getCustomerLabel()} *</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="email@exemple.com"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerAddress">Adresse du {getCustomerLabel()}</Label>
            <Textarea
              id="customerAddress"
              placeholder={`Adresse du ${getCustomerLabel().toLowerCase()}`}
              value={formData.customerAddress}
              onChange={(e) => handleInputChange("customerAddress", e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Détails de la Facture */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Détails de la Facture
          </CardTitle>
          <CardDescription className="text-green-100">Définir les dates et le statut de la facture</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Date de Facture *</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => handleInputChange("invoiceDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'Échéance *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_attente">En Attente</SelectItem>
                  <SelectItem value="payee">Payée</SelectItem>
                  <SelectItem value="en_retard">En Retard</SelectItem>
                  <SelectItem value="annulee">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles de la Facture */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Articles de la Facture
          </CardTitle>
          <CardDescription className="text-orange-100">Ajouter des produits ou services</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {formData.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-gray-50">
              <div className="md:col-span-2 space-y-2">
                <Label>Description *</Label>
                <Input
                  placeholder="Description de l'article"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Quantité *</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Prix Unitaire *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, "price", Number.parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Total</Label>
                <div className="flex items-center gap-2">
                  <Input value={`${item.total.toFixed(2)} €`} readOnly className="bg-gray-100" />
                  {formData.items.length > 1 && (
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <Button type="button" onClick={addItem} variant="outline" className="flex-1 bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Article
            </Button>
            <Button
              type="button"
              onClick={() => setShowProductScanner(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Scan className="h-4 w-4 mr-2" />
              Scanner Produit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Totaux de la Facture */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Totaux de la Facture
          </CardTitle>
          <CardDescription className="text-purple-100">Résumé des montants</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Notes supplémentaires ou conditions"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-lg">
              <span>Sous-total:</span>
              <span>{formData.subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>TVA (20%):</span>
              <span>{formData.tax.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Total TTC:</span>
              <span>{formData.total.toFixed(2)} €</span>
            </div>
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
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
        >
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? "Modifier la Facture" : "Créer la Facture"}
        </Button>
      </div>
    </form>
  )
}
