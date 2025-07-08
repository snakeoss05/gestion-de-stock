"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Package, MapPin, Calendar, Euro } from "lucide-react";

export default function StockOverview({ stockData, onStockUpdate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tous");

  // Catégories uniques
  const categories = [
    "Tous",
    ...new Set(stockData.map((item) => item.category)),
  ];

  // Filtrage des données
  const filteredData = stockData.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code_barre.includes(searchTerm);
    const matchesCategory =
      categoryFilter === "Tous" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item) => {
    if (item.currentStock === 0) {
      return {
        status: "Rupture",
        color: "bg-red-100 text-red-800 border-red-200",
      };
    } else if (item.currentStock <= item.minStock) {
      return {
        status: "Stock Faible",
        color: "bg-orange-100 text-orange-800 border-orange-200",
      };
    } else if (item.currentStock >= item.maxStock * 0.8) {
      return {
        status: "Stock Élevé",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      };
    } else {
      return {
        status: "Normal",
        color: "bg-green-100 text-green-800 border-green-200",
      };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Recherche et Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={categoryFilter === category ? "default" : "outline"}
              onClick={() => setCategoryFilter(category)}
              size="sm">
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Tableau des Stocks */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4 font-semibold">Produit</th>
              <th className="text-left p-4 font-semibold">Stock Actuel</th>
              <th className="text-left p-4 font-semibold">Seuils</th>
              <th className="text-left p-4 font-semibold">Emplacement</th>
              <th className="text-left p-4 font-semibold">Valeur</th>
              <th className="text-left p-4 font-semibold">Statut</th>
              <th className="text-left p-4 font-semibold">Dernière MAJ</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => {
              const stockStatus = getStockStatus(item);
              return (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-gray-500">
                        {item.brandName}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {item.code_barre}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-lg font-bold">
                        {item.currentStock}
                      </span>
                      <span className="text-sm text-gray-500">unités</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">Min:</span>
                        <span className="font-medium">{item.minStock}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">Max:</span>
                        <span className="font-medium">{item.maxStock}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{item.location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold">
                        {item.value.toFixed(2)} TND
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Coût unitaire: {item.cost.toFixed(2)} TND
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={stockStatus.color}>
                      {stockStatus.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {formatDate(item.lastUpdated)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Aucun produit trouvé correspondant à vos critères.</p>
        </div>
      )}
    </div>
  );
}
