"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Receipt, Printer, Mail, Download, ShoppingCart, Check } from "lucide-react"

export default function POSReceipt({ sale, onClose, onNewSale }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPaymentMethodName = (method) => {
    switch (method) {
      case "cash":
        return "Espèces"
      case "card":
        return "Carte Bancaire"
      case "mobile":
        return "Paiement Mobile"
      default:
        return method
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEmail = () => {
    // Simulation d'envoi par email
    alert("Fonctionnalité d'envoi par email à implémenter")
  }

  const handleDownload = () => {
    // Simulation de téléchargement PDF
    alert("Fonctionnalité de téléchargement PDF à implémenter")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* En-tête de succès */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">Vente Terminée !</h1>
            <p className="text-green-600">La transaction a été effectuée avec succès</p>
          </CardContent>
        </Card>

        {/* Reçu */}
        <Card className="print:shadow-none">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg print:bg-white print:text-black">
            <CardTitle className="flex items-center gap-2 text-center justify-center">
              <Receipt className="h-5 w-5" />
              REÇU DE CAISSE
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* En-tête du magasin */}
            <div className="text-center border-b pb-4">
              <h2 className="text-xl font-bold">VOTRE MAGASIN</h2>
              <p className="text-sm text-gray-600">123 Rue du Commerce</p>
              <p className="text-sm text-gray-600">75001 Paris, France</p>
              <p className="text-sm text-gray-600">Tél: 01 23 45 67 89</p>
              <p className="text-sm text-gray-600">SIRET: 12345678901234</p>
            </div>

            {/* Informations de la vente */}
            <div className="grid grid-cols-2 gap-4 text-sm border-b pb-4">
              <div>
                <p>
                  <strong>N° de Vente:</strong> {sale.id}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(sale.date)}
                </p>
                <p>
                  <strong>Caissier:</strong> {sale.cashier}
                </p>
              </div>
              <div>
                <p>
                  <strong>Paiement:</strong> {getPaymentMethodName(sale.payment.method)}
                </p>
                {sale.payment.method === "cash" && (
                  <>
                    <p>
                      <strong>Reçu:</strong> {sale.payment.amountReceived.toFixed(2)} €
                    </p>
                    <p>
                      <strong>Rendu:</strong> {sale.payment.change.toFixed(2)} €
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Articles */}
            <div className="space-y-2">
              <h3 className="font-semibold border-b pb-2">ARTICLES</h3>
              {sale.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600">
                      {item.price.toFixed(2)} € × {item.quantity}
                      {item.priceType === "wholesale" && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Prix Gros
                        </Badge>
                      )}
                    </p>
                  </div>
                  <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} €</p>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Sous-total HT:</span>
                <span>{sale.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>TVA:</span>
                <span>{sale.tva.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>TOTAL TTC:</span>
                <span>{sale.total.toFixed(2)} €</span>
              </div>
            </div>

            {/* Pied de page */}
            <div className="text-center text-sm text-gray-600 border-t pt-4">
              <p>Merci de votre visite !</p>
              <p>À bientôt dans notre magasin</p>
              <p className="mt-2">TVA non applicable, art. 293 B du CGI</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button onClick={handleEmail} variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button onClick={handleDownload} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button onClick={onNewSale} className="bg-green-600 hover:bg-green-700">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Nouvelle Vente
          </Button>
        </div>

        {/* Bouton de fermeture */}
        <div className="text-center print:hidden">
          <Button onClick={onClose} variant="outline" className="px-8 bg-transparent">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  )
}
