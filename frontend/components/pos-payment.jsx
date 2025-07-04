"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Banknote, Smartphone, ArrowLeft, Calculator, Check } from "lucide-react"

const PAYMENT_METHODS = [
  { id: "cash", name: "Espèces", icon: Banknote, color: "bg-green-600" },
  { id: "card", name: "Carte Bancaire", icon: CreditCard, color: "bg-blue-600" },
  { id: "mobile", name: "Paiement Mobile", icon: Smartphone, color: "bg-purple-600" },
]

const QUICK_AMOUNTS = [5, 10, 20, 50, 100, 200]

export default function POSPayment({ cart, total, subtotal, tva, onPaymentComplete, onCancel }) {
  const [selectedMethod, setSelectedMethod] = useState("cash")
  const [amountReceived, setAmountReceived] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const receivedAmount = Number.parseFloat(amountReceived) || 0
  const change = receivedAmount - total

  const handleQuickAmount = (amount) => {
    setAmountReceived(amount.toString())
  }

  const handlePayment = async () => {
    if (selectedMethod === "cash" && receivedAmount < total) {
      return
    }

    setIsProcessing(true)

    // Simulation du traitement du paiement
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const paymentData = {
      method: selectedMethod,
      amountReceived: selectedMethod === "cash" ? receivedAmount : total,
      change: selectedMethod === "cash" ? change : 0,
      timestamp: new Date().toISOString(),
    }

    onPaymentComplete(paymentData)
    setIsProcessing(false)
  }

  const canProceed = () => {
    if (selectedMethod === "cash") {
      return receivedAmount >= total
    }
    return true // Pour carte et mobile, pas besoin de montant reçu
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au Panier
          </Button>
          <h1 className="text-2xl font-bold">Paiement</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Résumé de la commande */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Résumé de la Commande
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Articles */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item, index) => (
                  <div
                    key={`${item.id}-${item.priceType}-${index}`}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">
                        {item.price.toFixed(2)} € × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} €</p>
                      {item.priceType === "wholesale" && (
                        <Badge variant="secondary" className="text-xs">
                          Gros
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Sous-total HT:</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA:</span>
                  <span>{tva.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total à Payer:</span>
                  <span className="text-green-600">{total.toFixed(2)} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Méthodes de paiement */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle>Méthode de Paiement</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Sélection de la méthode */}
              <div className="grid grid-cols-1 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon
                  return (
                    <Button
                      key={method.id}
                      variant={selectedMethod === method.id ? "default" : "outline"}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`h-16 justify-start ${selectedMethod === method.id ? method.color : ""}`}
                    >
                      <Icon className="h-6 w-6 mr-3" />
                      <span className="text-lg">{method.name}</span>
                    </Button>
                  )
                })}
              </div>

              {/* Saisie pour espèces */}
              {selectedMethod === "cash" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amountReceived">Montant Reçu (€)</Label>
                    <Input
                      id="amountReceived"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      className="text-xl text-center"
                    />
                  </div>

                  {/* Montants rapides */}
                  <div className="space-y-2">
                    <Label>Montants Rapides</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {QUICK_AMOUNTS.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          onClick={() => handleQuickAmount(amount)}
                          className="h-12"
                        >
                          {amount} €
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Calcul de la monnaie */}
                  {receivedAmount > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Montant reçu:</span>
                        <span className="font-semibold">{receivedAmount.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total à payer:</span>
                        <span className="font-semibold">{total.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Monnaie à rendre:</span>
                        <span className={change >= 0 ? "text-green-600" : "text-red-600"}>{change.toFixed(2)} €</span>
                      </div>
                      {change < 0 && <p className="text-red-600 text-sm">Montant insuffisant</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Informations pour carte/mobile */}
              {(selectedMethod === "card" || selectedMethod === "mobile") && (
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-blue-800">
                    {selectedMethod === "card"
                      ? "Insérez ou présentez la carte bancaire au terminal"
                      : "Présentez le téléphone au terminal de paiement"}
                  </p>
                  <p className="text-sm text-blue-600 mt-2">Montant: {total.toFixed(2)} €</p>
                </div>
              )}

              {/* Bouton de validation */}
              <Button
                onClick={handlePayment}
                disabled={!canProceed() || isProcessing}
                className="w-full h-16 text-lg bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Confirmer le Paiement
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
