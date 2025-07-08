"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  FileText,
  TrendingUp,
  ShoppingCart,
  Euro,
  Calendar,
} from "lucide-react";
import InvoiceForm from "./invoice-form";
import InvoiceList from "./invoice-list";
import InvoiceView from "./invoice-view";

export default function InvoiceManager() {
  const [currentView, setCurrentView] = useState("list");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([
    {
      id: "FAC-2024-001",
      type: "vente",
      customerName: "Jean Dupont",
      customerEmail: "jean.dupont@email.com",
      customerAddress: "123 Rue de la Paix\n75001 Paris",
      invoiceDate: "2024-01-15",
      dueDate: "2024-02-15",
      items: [
        {
          id: 1,
          description: "Ordinateur portable",
          quantity: 1,
          price: 899.99,
          total: 899.99,
        },
        {
          id: 2,
          description: "Souris sans fil",
          quantity: 2,
          price: 29.99,
          total: 59.98,
        },
      ],
      subtotal: 959.97,
      tax: 191.99,
      total: 1151.96,
      status: "en_attente",
      notes: "Livraison prévue sous 5 jours ouvrés",
    },
    {
      id: "FAC-2024-002",
      type: "achat",
      customerName: "Fournisseur Tech SARL",
      customerEmail: "contact@fournisseurtech.com",
      customerAddress: "456 Avenue des Entreprises\n69000 Lyon",
      invoiceDate: "2024-01-20",
      dueDate: "2024-02-20",
      items: [
        {
          id: 1,
          description: "Écrans 24 pouces",
          quantity: 10,
          price: 199.99,
          total: 1999.9,
        },
        {
          id: 2,
          description: "Claviers mécaniques",
          quantity: 10,
          price: 89.99,
          total: 899.9,
        },
      ],
      subtotal: 2899.8,
      tax: 579.96,
      total: 3479.76,
      status: "payee",
      notes: "Commande pour renouvellement du matériel bureau",
    },
  ]);

  const handleCreateInvoice = (invoiceData) => {
    const newInvoice = {
      ...invoiceData,
      id: `FAC-2024-${String(invoices.length + 1).padStart(3, "0")}`,
    };
    setInvoices([...invoices, newInvoice]);
    setCurrentView("list");
  };

  const handleEditInvoice = (invoiceData) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === selectedInvoice.id
          ? { ...invoiceData, id: selectedInvoice.id }
          : inv
      )
    );
    setCurrentView("list");
    setSelectedInvoice(null);
  };

  const handleDeleteInvoice = (invoiceId) => {
    setInvoices(invoices.filter((inv) => inv.id !== invoiceId));
    if (currentView === "view") {
      setCurrentView("list");
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView("view");
  };

  const handleEditInvoiceFromView = (invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView("edit");
  };

  const getStats = () => {
    const totalInvoices = invoices.length;
    const salesInvoices = invoices.filter(
      (inv) => inv.type === "vente" || !inv.type
    ).length;
    const purchaseInvoices = invoices.filter(
      (inv) => inv.type === "achat"
    ).length;
    const totalRevenue = invoices
      .filter(
        (inv) => (inv.type === "vente" || !inv.type) && inv.status === "payee"
      )
      .reduce((sum, inv) => sum + inv.total, 0);
    const totalExpenses = invoices
      .filter((inv) => inv.type === "achat" && inv.status === "payee")
      .reduce((sum, inv) => sum + inv.total, 0);
    const pendingInvoices = invoices.filter(
      (inv) => inv.status === "en_attente"
    ).length;

    return {
      totalInvoices,
      salesInvoices,
      purchaseInvoices,
      totalRevenue,
      totalExpenses,
      pendingInvoices,
    };
  };

  const stats = getStats();

  if (currentView === "create") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Créer une Nouvelle Facture</h2>
            <p className="text-gray-600">
              Remplissez les détails pour créer une facture
            </p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView("list")}>
            Retour à la Liste
          </Button>
        </div>
        <InvoiceForm
          onSubmit={handleCreateInvoice}
          onCancel={() => setCurrentView("list")}
        />
      </div>
    );
  }

  if (currentView === "edit" && selectedInvoice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Modifier la Facture {selectedInvoice.id}
            </h2>
            <p className="text-gray-600">Modifiez les détails de la facture</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView("list")}>
            Retour à la Liste
          </Button>
        </div>
        <InvoiceForm
          invoice={selectedInvoice}
          onSubmit={handleEditInvoice}
          onCancel={() => setCurrentView("list")}
          isEditing={true}
        />
      </div>
    );
  }

  if (currentView === "view" && selectedInvoice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setCurrentView("list")}>
            ← Retour à la Liste
          </Button>
        </div>
        <InvoiceView
          invoice={selectedInvoice}
          onEdit={() => handleEditInvoiceFromView(selectedInvoice)}
          onDelete={() => handleDeleteInvoice(selectedInvoice.id)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête et Statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Factures</h2>
          <p className="text-gray-600">
            Gérez vos factures de vente et d'achat
          </p>
        </div>
        <Button
          onClick={() => setCurrentView("create")}
          className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Facture
        </Button>
      </div>

      {/* Cartes de Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Factures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {stats.totalInvoices}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Factures Vente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {stats.salesInvoices}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Factures Achat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {stats.purchaseInvoices}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 flex items-center gap-2">
              <Euro className="h-4 w-4" />
              Revenus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">
              {stats.totalRevenue.toFixed(0)} TND
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
              <Euro className="h-4 w-4" />
              Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {stats.totalExpenses.toFixed(0)} TND
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              En Attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {stats.pendingInvoices}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des Factures */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Liste des Factures
          </CardTitle>
          <CardDescription className="text-slate-200">
            Gérez toutes vos factures de vente et d'achat
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <InvoiceList
            invoices={invoices}
            onView={handleViewInvoice}
            onEdit={(invoice) => {
              setSelectedInvoice(invoice);
              setCurrentView("edit");
            }}
            onDelete={handleDeleteInvoice}
          />
        </CardContent>
      </Card>
    </div>
  );
}
