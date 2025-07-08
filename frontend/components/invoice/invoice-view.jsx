"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Download,
  Mail,
  PrinterIcon as Print,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";

export default function InvoiceView({ invoice, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "payee":
        return "bg-green-100 text-green-800 border-green-200";
      case "en_attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "en_retard":
        return "bg-red-100 text-red-800 border-red-200";
      case "annulee":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "payee":
        return "Payée";
      case "en_attente":
        return "En Attente";
      case "en_retard":
        return "En Retard";
      case "annulee":
        return "Annulée";
      default:
        return status;
    }
  };

  const getTypeColor = (type) => {
    return type === "vente"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getTypeLabel = (type) => {
    return type === "vente" ? "Facture de Vente" : "Facture d'Achat";
  };

  const getCustomerLabel = (type) => {
    return type === "vente" ? "Client" : "Fournisseur";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("La fonctionnalité de téléchargement PDF sera implémentée ici");
  };

  const handleSendEmail = () => {
    alert("La fonctionnalité d'envoi par email sera implémentée ici");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Barre d'Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Facture {invoice.id}</h2>
          <p className="text-gray-600">
            Voir et gérer les détails de la facture
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Print className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
          <Button variant="outline" onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Envoyer par Email
          </Button>
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (
                confirm(
                  `Êtes-vous sûr de vouloir supprimer la facture ${invoice.id}?`
                )
              ) {
                onDelete();
              }
            }}>
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Affichage de la Facture */}
      <Card className="shadow-lg print:shadow-none">
        <CardContent className="p-8">
          {/* En-tête */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">FACTURE</h1>
              <p className="text-lg font-semibold text-blue-600">
                {invoice.id}
              </p>
              <div className="mt-2">
                <Badge
                  className={`${getTypeColor(
                    invoice.type || "vente"
                  )} text-sm px-3 py-1`}>
                  <div className="flex items-center gap-1">
                    {invoice.type === "achat" ? (
                      <ShoppingCart className="h-3 w-3" />
                    ) : (
                      <TrendingUp className="h-3 w-3" />
                    )}
                    {getTypeLabel(invoice.type || "vente")}
                  </div>
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <Badge
                className={`${getStatusColor(
                  invoice.status
                )} text-lg px-4 py-2`}>
                {getStatusLabel(invoice.status)}
              </Badge>
            </div>
          </div>

          {/* Informations Entreprise et Client/Fournisseur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                {invoice.type === "vente" ? "De:" : "À:"}
              </h3>
              <div className="text-gray-600">
                <p className="font-semibold">Votre Entreprise</p>
                <p>123 Rue des Affaires</p>
                <p>75001 Paris, France</p>
                <p>contact@votreentreprise.com</p>
                <p>01 23 45 67 89</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                {invoice.type === "vente" ? "Facturé à:" : "De:"}
              </h3>
              <div className="text-gray-600">
                <p className="font-semibold">{invoice.customerName}</p>
                <p>{invoice.customerEmail}</p>
                {invoice.customerAddress && (
                  <div className="whitespace-pre-line">
                    {invoice.customerAddress}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Détails de la Facture */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Date de Facture</p>
              <p className="font-semibold">{formatDate(invoice.invoiceDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date d'Échéance</p>
              <p className="font-semibold">{formatDate(invoice.dueDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Montant Total</p>
              <p className="font-semibold text-lg">
                {invoice.total.toFixed(2)} TND
              </p>
            </div>
          </div>

          {/* Tableau des Articles */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Articles
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-3 text-left">
                      Description
                    </th>
                    <th className="border border-gray-200 p-3 text-center">
                      Quantité
                    </th>
                    <th className="border border-gray-200 p-3 text-right">
                      Prix Unitaire
                    </th>
                    <th className="border border-gray-200 p-3 text-right">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-200 p-3">
                        {item.description}
                      </td>
                      <td className="border border-gray-200 p-3 text-center">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-200 p-3 text-right">
                        {item.price.toFixed(2)} TND
                      </td>
                      <td className="border border-gray-200 p-3 text-right font-semibold">
                        {item.total.toFixed(2)} TND
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totaux */}
          <div className="flex justify-end mb-8">
            <div className="w-full md:w-1/2">
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span>Sous-total HT:</span>
                  <span>{invoice.subtotal.toFixed(2)} TND </span>
                </div>
                <div className="flex justify-between py-2">
                  <span>TVA (20%):</span>
                  <span>{invoice.tax.toFixed(2)} TND </span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-gray-300 font-bold text-lg">
                  <span>Total TTC:</span>
                  <span>{invoice.total.toFixed(2)} TND </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Notes
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 whitespace-pre-line">
                  {invoice.notes}
                </p>
              </div>
            </div>
          )}

          {/* Pied de page */}
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            <p>Merci pour votre confiance!</p>
            <p>
              Pour toute question concernant cette facture, contactez-nous à
              contact@votreentreprise.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
