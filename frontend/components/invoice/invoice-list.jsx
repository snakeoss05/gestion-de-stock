"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";

export default function InvoiceList({ invoices, onView, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    const matchesType = typeFilter === "all" || invoice.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

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
    return type === "vente" ? "Vente" : "Achat";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  return (
    <div className="space-y-4">
      {/* Recherche et Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher des factures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres par Type */}
        <div className="flex gap-2">
          <Button
            variant={typeFilter === "all" ? "default" : "outline"}
            onClick={() => setTypeFilter("all")}
            size="sm">
            Toutes
          </Button>
          <Button
            variant={typeFilter === "vente" ? "default" : "outline"}
            onClick={() => setTypeFilter("vente")}
            size="sm"
            className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Ventes
          </Button>
          <Button
            variant={typeFilter === "achat" ? "default" : "outline"}
            onClick={() => setTypeFilter("achat")}
            size="sm"
            className="flex items-center gap-1">
            <ShoppingCart className="h-3 w-3" />
            Achats
          </Button>
        </div>

        {/* Filtres par Statut */}
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            size="sm">
            Tous
          </Button>
          <Button
            variant={statusFilter === "en_attente" ? "default" : "outline"}
            onClick={() => setStatusFilter("en_attente")}
            size="sm">
            En Attente
          </Button>
          <Button
            variant={statusFilter === "payee" ? "default" : "outline"}
            onClick={() => setStatusFilter("payee")}
            size="sm">
            Payées
          </Button>
          <Button
            variant={statusFilter === "en_retard" ? "default" : "outline"}
            onClick={() => setStatusFilter("en_retard")}
            size="sm">
            En Retard
          </Button>
        </div>
      </div>

      {/* Tableau des Factures */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4 font-semibold">N° Facture</th>
              <th className="text-left p-4 font-semibold">Type</th>
              <th className="text-left p-4 font-semibold">
                Client/Fournisseur
              </th>
              <th className="text-left p-4 font-semibold">Date</th>
              <th className="text-left p-4 font-semibold">Échéance</th>
              <th className="text-left p-4 font-semibold">Montant</th>
              <th className="text-left p-4 font-semibold">Statut</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono font-semibold text-blue-600">
                  {invoice.id}
                </td>
                <td className="p-4">
                  <Badge className={getTypeColor(invoice.type || "vente")}>
                    <div className="flex items-center gap-1">
                      {invoice.type === "achat" ? (
                        <ShoppingCart className="h-3 w-3" />
                      ) : (
                        <TrendingUp className="h-3 w-3" />
                      )}
                      {getTypeLabel(invoice.type || "vente")}
                    </div>
                  </Badge>
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium">{invoice.customerName}</div>
                    <div className="text-sm text-gray-500">
                      {invoice.customerEmail}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600">
                  {formatDate(invoice.invoiceDate)}
                </td>
                <td className="p-4 text-gray-600">
                  {formatDate(invoice.dueDate)}
                </td>
                <td className="p-4 font-semibold">
                  {invoice.total.toFixed(2)} TND
                </td>
                <td className="p-4">
                  <Badge className={getStatusColor(invoice.status)}>
                    {getStatusLabel(invoice.status)}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView(invoice)}
                      title="Voir la Facture">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(invoice)}
                      title="Modifier la Facture">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (
                          confirm(
                            `Êtes-vous sûr de vouloir supprimer la facture ${invoice.id}?`
                          )
                        ) {
                          onDelete(invoice.id);
                        }
                      }}
                      title="Supprimer la Facture">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucune facture trouvée correspondant à vos critères.</p>
        </div>
      )}
    </div>
  );
}
