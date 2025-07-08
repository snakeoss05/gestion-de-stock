"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Package, AlertTriangle } from "lucide-react";

export default function ProductList({ products, onView, onEdit, onDelete }) {
  const getStatusBadge = (product) => {
    if (product.currentStock === 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Rupture
        </Badge>
      );
    } else if (product.currentStock <= 10) {
      return (
        <Badge
          variant="secondary"
          className="bg-orange-100 text-orange-800 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Stock Faible
        </Badge>
      );
    } else {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Actif
        </Badge>
      );
    }
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "text-red-600";
    if (stock <= 10) return "text-orange-600";
    return "text-green-600";
  };

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-500">
            Aucun produit ne correspond à vos critères de recherche.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card
          key={product.productId}
          className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                    {product.productName}
                  </h3>
                  <p className="text-sm text-gray-600">{product.brandName}</p>
                </div>
                {getStatusBadge(product)}
              </div>

              {/* Product Image Placeholder */}
              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.productName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="h-12 w-12 text-gray-400" />
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Catégorie:</span>
                  <span className="text-sm font-medium">
                    {product.category.name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Code-barres:</span>
                  <span className="text-sm font-mono">
                    {product.code_barre}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <span
                    className={`text-sm font-bold ${getStockColor(
                      product.stock
                    )}`}>
                    {product.stock} unités
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Prix détail:</span>
                  <span className="text-sm font-bold text-green-600">
                    TND {product.prix_detail?.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Emplacement:</span>
                  <span className="text-sm">{product.location}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => onView(product)}
                  variant="outline"
                  size="sm"
                  className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Voir
                </Button>
                <Button
                  onClick={() => onEdit(product)}
                  variant="outline"
                  size="sm"
                  className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  onClick={() => onDelete(product._id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
