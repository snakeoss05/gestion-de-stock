"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  DollarSign,
  MapPin,
  BarChart3,
  Calendar,
  Tag,
} from "lucide-react";

export default function ProductView({ product }) {
  if (!product) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Produit non trouvé
          </h3>
          <p className="text-gray-500">Le produit sélectionné n'existe pas.</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = () => {
    if (product.stock === 0) {
      return <Badge variant="destructive">Rupture de Stock</Badge>;
    } else if (product.stock <= 10) {
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          Stock Faible
        </Badge>
      );
    } else {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          En Stock
        </Badge>
      );
    }
  };

  const calculateMargin = () => {
    const margin = ((product.prix_detail - product.cost) / product.cost) * 100;
    return margin.toFixed(1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Product Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informations Générales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {product.productName}
                  </h2>
                  <p className="text-lg text-gray-600">{product.brandName}</p>
                </div>
                {getStatusBadge()}
              </div>

              {/* Product Image */}
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.productName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Package className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Aucune image</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Catégorie:
                    </span>
                  </div>
                  <p className="text-gray-900 ml-6">{product.category.name}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Code-barres:
                    </span>
                  </div>
                  <p className="text-gray-900 ml-6 font-mono">
                    {product.code_barre}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Emplacement:
                    </span>
                  </div>
                  <p className="text-gray-900 ml-6">{product.location}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Date d'ajout:
                    </span>
                  </div>
                  <p className="text-gray-900 ml-6">
                    {new Date(product.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Information */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Informations Tarifaires
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Prix d'achat
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    TND {product.cost.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Prix de détail
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    TND {product.prix_detail.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Prix de gros
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    TND {product.prix_gros.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Min. {product.gros_qty} unités
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Marge bénéficiaire
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {calculateMargin()}%
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-medium text-gray-700">TVA</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {product.tva}%
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Remise</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {product.discount}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Stock Information */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {product.currentStock}
              </p>
              <p className="text-sm text-gray-600">unités en stock</p>

              <div className="mt-4 p-3 rounded-lg bg-gray-50">
                <p className="text-sm font-medium text-gray-700">
                  Valeur du stock
                </p>
                <p className="text-xl font-bold text-gray-900">
                  TND {(product.cost * product.currentStock).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistiques Rapides</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Bénéfice par unité:
                </span>
                <span className="font-semibold text-green-600">
                  TND {(product.prix_detail - product.cost).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Bénéfice total stock:
                </span>
                <span className="font-semibold text-green-600">
                  TND
                  {(
                    (product.prix_detail - product.cost) *
                    product.currentStock
                  ).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Prix avec TVA:</span>
                <span className="font-semibold">
                  TND
                  {(product.prix_detail * (1 + product.tva / 100)).toFixed(2)}
                </span>
              </div>

              {product.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Prix avec remise:
                  </span>
                  <span className="font-semibold text-orange-600">
                    TND
                    {(
                      product.prix_detail *
                      (1 - product.discount / 100)
                    ).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
