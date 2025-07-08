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
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
  Eye,
  History,
  RefreshCw,
} from "lucide-react";
import StockOverview from "./stock-overview";
import StockMovements from "./stock-movements";
import StockAlerts from "./stock-alerts";
import StockAdjustment from "./stock-adjustment";
import { useToast } from "@/hooks/use-toast";
import { useStock } from "../../contexts/stock-context";

// Simulation de données de stock avec historique
const INITIAL_STOCK_DATA = [
  {
    id: 1,
    code_barre: "1234567890123",
    productName: "Casque Sans Fil",
    brandName: "TechSound",
    currentStock: 5, // Stock faible
    minStock: 10,
    maxStock: 50,
    category: "Électronique",
    location: "Rayon A-1",
    lastUpdated: "2024-01-15T10:30:00Z",
    cost: 65.0,
    value: 325.0,
  },
  {
    id: 2,
    code_barre: "2345678901234",
    productName: "Mug Café",
    brandName: "CafeCorp",
    currentStock: 100,
    minStock: 20,
    maxStock: 200,
    category: "Maison & Jardin",
    location: "Rayon B-2",
    lastUpdated: "2024-01-14T15:45:00Z",
    cost: 8.5,
    value: 850.0,
  },
  {
    id: 3,
    code_barre: "3456789012345",
    productName: "Enceinte Bluetooth",
    brandName: "SoundWave",
    currentStock: 0, // Rupture de stock
    minStock: 5,
    maxStock: 30,
    category: "Électronique",
    location: "Rayon A-2",
    lastUpdated: "2024-01-13T09:15:00Z",
    cost: 32.0,
    value: 0.0,
  },
  {
    id: 4,
    code_barre: "4567890123456",
    productName: "Carnet de Notes",
    brandName: "WriteWell",
    currentStock: 50,
    minStock: 15,
    maxStock: 100,
    category: "Fournitures Bureau",
    location: "Rayon C-1",
    lastUpdated: "2024-01-16T14:20:00Z",
    cost: 14.0,
    value: 700.0,
  },
  {
    id: 5,
    code_barre: "5678901234567",
    productName: "Bouteille d'Eau",
    brandName: "HydroLife",
    currentStock: 75,
    minStock: 25,
    maxStock: 150,
    category: "Sport & Plein Air",
    location: "Rayon D-1",
    lastUpdated: "2024-01-16T11:30:00Z",
    cost: 18.0,
    value: 1350.0,
  },
];

// Simulation de mouvements de stock
const INITIAL_MOVEMENTS = [
  {
    id: 1,
    productId: 1,
    productName: "Casque Sans Fil",
    type: "sortie",
    quantity: 3,
    reason: "Vente POS",
    reference: "VENTE-001",
    date: "2024-01-16T14:30:00Z",
    user: "Caissier 1",
    previousStock: 8,
    newStock: 5,
  },
  {
    id: 2,
    productId: 3,
    productName: "Enceinte Bluetooth",
    type: "sortie",
    quantity: 2,
    reason: "Vente Facture",
    reference: "INV-002",
    date: "2024-01-16T10:15:00Z",
    user: "Vendeur 2",
    previousStock: 2,
    newStock: 0,
  },
  {
    id: 3,
    productId: 2,
    productName: "Mug Café",
    type: "entrée",
    quantity: 50,
    reason: "Réception Fournisseur",
    reference: "BON-001",
    date: "2024-01-15T09:00:00Z",
    user: "Magasinier",
    previousStock: 50,
    newStock: 100,
  },
  {
    id: 4,
    productId: 1,
    productName: "Casque Sans Fil",
    type: "ajustement",
    quantity: -2,
    reason: "Inventaire - Casse",
    reference: "ADJ-001",
    date: "2024-01-14T16:45:00Z",
    user: "Manager",
    previousStock: 10,
    newStock: 8,
  },
  {
    id: 5,
    productId: 4,
    productName: "Carnet de Notes",
    type: "entrée",
    quantity: 25,
    reason: "Réception Fournisseur",
    reference: "BON-002",
    date: "2024-01-14T11:20:00Z",
    user: "Magasinier",
    previousStock: 25,
    newStock: 50,
  },
];

export default function StockManager() {
  const { toast } = useToast();
  const {
    stockData,
    movements,
    lastRefresh,
    addStockMovement,
    refreshData,
    getStockAlerts,
  } = useStock();

  const [currentView, setCurrentView] = useState("overview");

  // Remove the local state and use context data
  // const [stockData, setStockData] = useState(INITIAL_STOCK_DATA)
  // const [movements, setMovements] = useState(INITIAL_MOVEMENTS)
  // const [lastRefresh, setLastRefresh] = useState(new Date())

  // Calculs des statistiques
  const totalProducts = stockData.length;
  const totalValue = stockData.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );
  const { lowStock: lowStockItems, outOfStock: outOfStockItems } =
    getStockAlerts();

  // Actualiser les données
  // const refreshData = () => {
  //   setLastRefresh(new Date())
  //   toast({
  //     title: "Données Actualisées",
  //     description: "Les informations de stock ont été mises à jour",
  //   })
  // }

  // Ajouter un mouvement de stock
  // const addStockMovement = (movement) => {
  //   const newMovement = {
  //     ...movement,
  //     id: movements.length + 1,
  //     date: new Date().toISOString(),
  //     user: "Utilisateur Actuel", // À remplacer par l'utilisateur connecté
  //   }

  //   setMovements([newMovement, ...movements])

  //   // Mettre à jour le stock du produit
  //   setStockData(
  //     stockData.map((item) => {
  //       if (item.id === movement.productId) {
  //         const newStock =
  //           movement.type === "entrée"
  //             ? item.currentStock + movement.quantity
  //             : item.currentStock - Math.abs(movement.quantity)

  //         return {
  //           ...item,
  //           currentStock: Math.max(0, newStock),
  //           lastUpdated: new Date().toISOString(),
  //           value: Math.max(0, newStock) * item.cost,
  //         }
  //       }
  //       return item
  //     }),
  //   )

  //   toast({
  //     title: "Mouvement Enregistré",
  //     description: `${movement.type === "entrée" ? "Entrée" : "Sortie"} de ${movement.quantity} unités enregistrée`,
  //   })
  // }

  const getViewTitle = () => {
    switch (currentView) {
      case "overview":
        return "Vue d'Ensemble";
      case "movements":
        return "Mouvements de Stock";
      case "alerts":
        return "Alertes Stock";
      case "adjustment":
        return "Ajustement de Stock";
      default:
        return "Gestion des Stocks";
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques Générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Produits</p>
                <p className="text-3xl font-bold">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Valeur Stock</p>
                <p className="text-3xl font-bold">
                  {totalValue.toFixed(0)} TND
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Stock Faible</p>
                <p className="text-3xl font-bold">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Ruptures</p>
                <p className="text-3xl font-bold">{outOfStockItems.length}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation et Actions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {getViewTitle()}
              </CardTitle>
              <CardDescription>
                Dernière mise à jour: {lastRefresh.toLocaleTimeString("fr-FR")}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={refreshData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Onglets de navigation */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={currentView === "overview" ? "default" : "outline"}
              onClick={() => setCurrentView("overview")}>
              <Eye className="h-4 w-4 mr-2" />
              Vue d'Ensemble
            </Button>
            <Button
              variant={currentView === "movements" ? "default" : "outline"}
              onClick={() => setCurrentView("movements")}>
              <History className="h-4 w-4 mr-2" />
              Mouvements
            </Button>
            <Button
              variant={currentView === "alerts" ? "default" : "outline"}
              onClick={() => setCurrentView("alerts")}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alertes
              {lowStockItems.length + outOfStockItems.length > 0 && (
                <Badge className="ml-2 bg-red-500">
                  {lowStockItems.length + outOfStockItems.length}
                </Badge>
              )}
            </Button>
            <Button
              variant={currentView === "adjustment" ? "default" : "outline"}
              onClick={() => setCurrentView("adjustment")}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Ajustements
            </Button>
          </div>

          {/* Contenu selon la vue sélectionnée */}
          {currentView === "overview" && (
            <StockOverview
              stockData={stockData}
              onStockUpdate={addStockMovement}
            />
          )}
          {currentView === "movements" && (
            <StockMovements movements={movements} stockData={stockData} />
          )}
          {currentView === "alerts" && (
            <StockAlerts
              stockData={stockData}
              lowStockItems={lowStockItems}
              outOfStockItems={outOfStockItems}
              onStockUpdate={addStockMovement}
            />
          )}
          {currentView === "adjustment" && (
            <StockAdjustment
              stockData={stockData}
              onStockUpdate={addStockMovement}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
