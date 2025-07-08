"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Scan,
  CreditCard,
  Trash2,
  Plus,
  Minus,
  Search,
  Calculator,
  Clock,
} from "lucide-react";
import UniversalBarcodeScanner from "../universal-barcode-scanner";
import POSPayment from "./pos-payment";
import POSReceipt from "./pos-receipt";
import toast from "react-hot-toast";
import { useStock } from "../../contexts/stock-context";
import axios from "axios";
import POSStockIndicator from "./pos-stock-indicator";
import {
  addOrUpdateItem,
  removeItem,
  getCart,
  checkout,
} from "../../services/cartServices";
import { set } from "date-fns";
export default function POSInterface() {
  const { stockData, processPOSSale } = useStock();

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState("686ae3c8f4c604900cccb732");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categories"
        );
        setCategories(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const cartData = await getCart(userId);
        if (cartData.items.length === 0) return;
        setCart(cartData);
      } catch (error) {
        console.error("Could not load cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products?page=${page}&limit=8&category=${selectedCategory}`
        );
        setProducts(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [page, selectedCategory]);
  useEffect(() => {
    const SearchProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/search?searchterm=${searchTerm}`
        );
        setProducts(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (searchTerm.length > 0) SearchProducts();
  }, [searchTerm]);
  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Catégories uniques

  // Calculs du panier
  const refreshCart = async () => {
    const updated = await getCart(userId);
    setCart(updated);
  };
  const handleRemoveFromCart = async (productId) => {
    try {
      const updatedCart = await removeItem(userId, productId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to remove item.");
    }
  };
  const handleCheckout = async () => {
    try {
      const result = await checkout(userId, "cash", {
        name: "Passager",
        phone: "123456789",
      });
      toast.success("Checkout success:", result);
      setCart(null); // or fetchCart again
    } catch (error) {
      toast.error("Checkout failed.");
    }
  };
  // Ajouter un produit au panier
  const addToCart = async (product, quantity = 1) => {
    const existingItem = cart.items?.find(
      (item) => item.productId._id === product._id
    );

    const newQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (newQuantity > product.currentStock) {
      toast.error(
        `Stock insuffisant. Maximum disponible: ${product.currentStock}`
      );
      return;
    }

    const itemTotal = product.prix_detail * newQuantity;

    try {
      await addOrUpdateItem(
        userId,
        product._id,
        newQuantity,
        product.prix_detail,
        itemTotal
      );
      await refreshCart();
      toast.success(`Produit "${product.productName}" ajouté au panier`);
    } catch (error) {
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  // Modifier la quantité d'un article
  const updateQuantity = async (productId, newQuantity) => {
    const item = cart.items?.find((item) => item.productId._id === productId);
    if (!item) return;

    if (newQuantity === 0) {
      await removeFromCart(item._id); // keep using cart item id here
      return;
    }

    if (newQuantity > item.productId.currentStock) {
      toast.error(`Stock insuffisant. Maximum: ${item.productId.currentStock}`);
      return;
    }

    const itemTotal = item.productId.prix_detail * newQuantity;

    try {
      await addOrUpdateItem(
        userId,
        productId, // ✅ Correct product _id
        newQuantity,
        item.productId.prix_detail,
        itemTotal
      );
      await refreshCart();
      toast.success(`Quantité mise à jour pour ${item.productId.productName}`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  // Supprimer un article du panier
  const removeFromCart = async (itemId) => {
    try {
      await removeItem(userId, itemId);
      await refreshCart();
      toast.success("Produit supprimé du panier");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  // Gérer le scan de produit
  const handleScanResult = async (result) => {
    // Rechercher le produit par code-barres
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/barcode/${result}`
        );
        return res.data.data;
      } catch (error) {
        console.log(error);
      }
    };
    const product = await getProduct();
    if (product) {
      addToCart(product, 1);
      toast.success(" ajouté au panier");
    } else {
      toast.error("Produit non trouvé");
    }

    setShowScanner(false);
  };

  // Procéder au paiement
  const proceedToPayment = () => {
    if (cart.items.length === 0) {
      toast({
        title: "Panier Vide",
        description: "Ajoutez des produits avant de procéder au paiement",
        variant: "destructive",
      });
      return;
    }
    setShowPayment(true);
  };

  // Finaliser la vente
  const completeSale = (paymentData) => {
    const saleData = {
      id: `VENTE-${Date.now()}`,
      date: new Date().toISOString(),
      items: cart.items,
      subtotal: cart.totalAmount,
      tva: "19%",
      total: cartTotal,
      payment: paymentData,
      cashier: "Caissier 1",
    };

    const result = processPOSSale(saleData);

    if (!result.success) {
      toast({
        title: "Erreur de Stock",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    setCurrentSale(saleData);
    setShowPayment(false);
    setShowReceipt(true);
    clearCart();

    toast({
      title: "Vente Terminée !",
      description: `Vente ${saleData.id} enregistrée avec succès`,
    });

    if (result.lowStockAlerts && result.lowStockAlerts.length > 0) {
      setTimeout(() => {
        toast({
          title: "Alerte Stock !",
          description: `${result.lowStockAlerts.length} produit(s) sous le seuil minimum`,
          variant: "destructive",
        });
      }, 2000);
    }
  };

  if (showScanner) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <UniversalBarcodeScanner
          title="Scanner POS"
          description="Scannez un code-barres ou recherchez un produit à ajouter au panier"
          showProductSearch={true}
          onScan={handleScanResult}
          onClose={() => setShowScanner(false)}
        />
      </div>
    );
  }

  if (showPayment) {
    return (
      <POSPayment
        cart={cart}
        total={cartTotal}
        subtotal={cartHT}
        tva={cartTVA}
        onPaymentComplete={completeSale}
        onCancel={() => setShowPayment(false)}
      />
    );
  }

  if (showReceipt && currentSale) {
    return (
      <POSReceipt
        sale={currentSale}
        onClose={() => {
          setShowReceipt(false);
          setCurrentSale(null);
        }}
        onNewSale={() => {
          setShowReceipt(false);
          setCurrentSale(null);
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen max-h-screen">
      {/* Section Produits */}
      <div className="lg:col-span-2 space-y-4">
        {/* En-tête avec recherche */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Caisse Enregistreuse
              </CardTitle>
              <div className="flex items-center gap-4">
                <POSStockIndicator />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un produit ou scanner un code-barres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => setShowScanner(true)}
                className="bg-blue-600 hover:bg-blue-700">
                <Scan className="h-4 w-4 mr-2" />
                Scanner
              </Button>
            </div>

            {/* Filtres par catégorie */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("")}>
                Toutes les Catégories
              </Button>

              {categories.map((category) => (
                <Button
                  key={category._id}
                  variant={
                    selectedCategory === category._id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category._id)}>
                  {category.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grille des produits */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {products.map((product) => (
            <Card
              key={product._id}
              className={`cursor-pointer hover:shadow-lg transition-shadow ${
                product.currentStock <= 5
                  ? "border-orange-300 bg-orange-50"
                  : ""
              } ${
                product.currentStock === 0
                  ? "border-red-300 bg-red-50 opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => product.currentStock > 0 && addToCart(product)}>
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.productName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {product.productName}
                  </h3>
                  <p className="text-xs text-gray-500">{product.brandName}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-blue-600">
                      {product.prix_detail.toFixed(2)} TND
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        product.currentStock === 0
                          ? "border-red-300 text-red-600"
                          : product.currentStock <= product.minStock
                          ? "border-orange-300 text-orange-600"
                          : "border-green-300 text-green-600"
                      }`}>
                      Stock: {product.currentStock}
                    </Badge>
                  </div>
                  {product.currentStock <= product.minStock &&
                    product.currentStock > 0 && (
                      <div className="text-xs text-orange-600 font-medium">
                        ⚠️ Stock faible
                      </div>
                    )}
                  {product.currentStock === 0 && (
                    <div className="text-xs text-red-600 font-medium">
                      ❌ Rupture de stock
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Panier */}
      <div className="space-y-4">
        <Card className="h-full">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Panier
              </div>
              <Badge className="bg-white text-green-600">
                {cart.items?.length} article{cart.items?.length > 1 ? "s" : ""}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Articles du panier */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.items?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Panier vide</p>
                  <p className="text-sm">Ajoutez des produits pour commencer</p>
                </div>
              ) : (
                cart.items?.map((item) => (
                  <div
                    key={`${item._id}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {item.price.toFixed(2)} TND × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateQuantity(item.productId._id, item.quantity - 1)
                        }
                        className="h-8 w-8 p-0">
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateQuantity(item.productId._id, item.quantity + 1)
                        }
                        className="h-8 w-8 p-0"
                        disabled={item.quantity >= item.productId.currentStock}>
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCart(item._id)}
                        className="h-8 w-8 p-0">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totaux */}
            {cart.items?.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total TTC:</span>
                  <span className="text-green-600">
                    {cart.totalAmount?.toFixed(2)} TND
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-4">
              {cart.items?.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full bg-transparent">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vider le Panier
                </Button>
              )}
              <Button
                onClick={proceedToPayment}
                disabled={cart.items?.length === 0}
                className="w-full bg-green-600 hover:bg-green-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Procéder au Paiement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
