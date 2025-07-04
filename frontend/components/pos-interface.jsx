"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Scan, CreditCard, Trash2, Plus, Minus, Search, Calculator, Clock } from "lucide-react"
import ProductScanner from "./product-scanner"
import POSPayment from "./pos-payment"
import POSReceipt from "./pos-receipt"
import { useToast } from "@/hooks/use-toast"
import { useStock } from "../contexts/stock-context"
import POSStockIndicator from "./pos-stock-indicator"

// Base de données produits étendue pour le POS
/*const POS_PRODUCTS = [
  {
    id: 1,
    code_barre: "1234567890123",
    productName: "Casque Sans Fil",
    brandName: "TechSound",
    prix_detail: 89.99,
    prix_gros: 65.0,
    stock: 25,
    category: "Électronique",
    image: "/placeholder.svg?height=100&width=100",
    tva: 20,
  },
  {
    id: 2,
    code_barre: "2345678901234",
    productName: "Mug Café",
    brandName: "CafeCorp",
    prix_detail: 12.99,
    prix_gros: 8.5,
    stock: 100,
    category: "Maison & Jardin",
    image: "/placeholder.svg?height=100&width=100",
    tva: 20,
  },
  {
    id: 3,
    code_barre: "3456789012345",
    productName: "Enceinte Bluetooth",
    brandName: "SoundWave",
    prix_detail: 45.99,
    prix_gros: 32.0,
    stock: 15,
    category: "Électronique",
    image: "/placeholder.svg?height=100&width=100",
    tva: 20,
  },
  {
    id: 4,
    code_barre: "4567890123456",
    productName: "Carnet de Notes",
    brandName: "WriteWell",
    prix_detail: 19.99,
    prix_gros: 14.0,
    stock: 50,
    category: "Fournitures Bureau",
    image: "/placeholder.svg?height=100&width=100",
    tva: 20,
  },
  {
    id: 5,
    code_barre: "5678901234567",
    productName: "Bouteille d'Eau",
    brandName: "HydroLife",
    prix_detail: 24.99,
    prix_gros: 18.0,
    stock: 75,
    category: "Sport & Plein Air",
    image: "/placeholder.svg?height=100&width=100",
    tva: 20,
  },
  {
    id: 6,
    code_barre: "6789012345678",
    productName: "T-Shirt Coton",
    brandName: "FashionCo",
    prix_detail: 29.99,
    prix_gros: 20.0,
    stock: 40,
    category: "Vêtements",
    image: "/placeholder.svg?height=100&width=100",
    tva: 20,
  },
  {
    id: 7,
    code_barre: "7890123456789",
    productName: "Chocolat Noir",
    brandName: "ChocoBrand",
    prix_detail: 8.5,
    prix_gros: 6.0,
    stock: 80,
    category: "Alimentation",
    image: "/placeholder.svg?height=100&width=100",
    tva: 5.5,
  },
  {
    id: 8,
    code_barre: "8901234567890",
    productName: "Stylo Bille",
    brandName: "WritePro",
    prix_detail: 3.99,
    prix_gros: 2.5,
    stock: 200,
    category: "Fournitures Bureau",
    image: "/placeholder.svg?height=100&width=100",
    tva: 20,
  },
]*/

export default function POSInterface() {
  const { toast } = useToast()
  const { stockData, processPOSSale, checkStockAvailability, getAvailableProducts, getStockAlerts } = useStock()

  // Remove the POS_PRODUCTS constant and use stockData instead
  const POS_PRODUCTS = getAvailableProducts()
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [showScanner, setShowScanner] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [currentSale, setCurrentSale] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Catégories uniques
  const categories = ["Tous", ...new Set(POS_PRODUCTS.map((p) => p.category))]

  // Produits filtrés
  const filteredProducts = POS_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code_barre.includes(searchTerm)
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculs du panier
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartTVA = cart.reduce((sum, item) => {
    const tvaAmount = (item.price * item.quantity * item.tva) / 100
    return sum + tvaAmount
  }, 0)
  const cartHT = cartTotal - cartTVA
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Ajouter un produit au panier
  const addToCart = (product, quantity = 1, priceType = "retail") => {
    // Vérifier la disponibilité du stock
    const availability = checkStockAvailability(product.id, quantity)
    if (!availability.available) {
      toast({
        title: "Stock Insuffisant",
        description: availability.reason,
        variant: "destructive",
      })
      return
    }

    const price = priceType === "retail" ? product.prix_detail : product.prix_gros
    const existingItem = cart.find((item) => item.id === product.id && item.priceType === priceType)

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity
      const newAvailability = checkStockAvailability(product.id, newQuantity)

      if (!newAvailability.available) {
        toast({
          title: "Stock Insuffisant",
          description: `Maximum disponible: ${availability.availableStock || product.currentStock}`,
          variant: "destructive",
        })
        return
      }

      setCart(
        cart.map((item) =>
          item.id === product.id && item.priceType === priceType ? { ...item, quantity: newQuantity } : item,
        ),
      )
    } else {
      const cartItem = {
        id: product.id,
        productId: product.id, // Add productId for stock tracking
        name: `${product.brandName} ${product.productName}`,
        price: price,
        quantity: quantity,
        stock: product.currentStock,
        tva: product.tva,
        priceType: priceType,
        barcode: product.code_barre,
      }
      setCart([...cart, cartItem])
    }

    toast({
      title: "Produit Ajouté !",
      description: `${product.productName} ajouté au panier`,
    })
  }

  // Modifier la quantité d'un article
  const updateQuantity = (itemId, priceType, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, priceType)
      return
    }

    // Vérifier la disponibilité du stock
    const availability = checkStockAvailability(itemId, newQuantity)
    if (!availability.available) {
      toast({
        title: "Stock Insuffisant",
        description: availability.reason,
        variant: "destructive",
      })
      return
    }

    setCart(
      cart.map((item) =>
        item.id === itemId && item.priceType === priceType ? { ...item, quantity: newQuantity } : item,
      ),
    )
  }

  // Supprimer un article du panier
  const removeFromCart = (itemId, priceType) => {
    setCart(cart.filter((item) => !(item.id === itemId && item.priceType === priceType)))
  }

  // Vider le panier
  const clearCart = () => {
    setCart([])
  }

  // Scanner de produit
  const handleProductScanned = (product) => {
    addToCart(product)
    setShowScanner(false)
  }

  // Procéder au paiement
  const proceedToPayment = () => {
    if (cart.length === 0) {
      toast({
        title: "Panier Vide",
        description: "Ajoutez des produits avant de procéder au paiement",
        variant: "destructive",
      })
      return
    }
    setShowPayment(true)
  }

  // Finaliser la vente
  const completeSale = (paymentData) => {
    const saleData = {
      id: `VENTE-${Date.now()}`,
      date: new Date().toISOString(),
      items: cart,
      subtotal: cartHT,
      tva: cartTVA,
      total: cartTotal,
      payment: paymentData,
      cashier: "Caissier 1", // À remplacer par l'utilisateur connecté
    }

    // Traiter la vente avec le système de stock
    const result = processPOSSale(saleData)

    if (!result.success) {
      toast({
        title: "Erreur de Stock",
        description: result.error,
        variant: "destructive",
      })
      return
    }

    setCurrentSale(saleData)
    setShowPayment(false)
    setShowReceipt(true)
    clearCart()

    toast({
      title: "Vente Terminée !",
      description: `Vente ${saleData.id} enregistrée avec succès`,
    })

    // Afficher les alertes de stock si nécessaire
    if (result.lowStockAlerts && result.lowStockAlerts.length > 0) {
      setTimeout(() => {
        toast({
          title: "Alerte Stock !",
          description: `${result.lowStockAlerts.length} produit(s) sous le seuil minimum`,
          variant: "destructive",
        })
      }, 2000)
    }
  }

  if (showScanner) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <ProductScanner
          onProductSelect={handleProductScanned}
          onClose={() => setShowScanner(false)}
          products={POS_PRODUCTS}
        />
      </div>
    )
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
    )
  }

  if (showReceipt && currentSale) {
    return (
      <POSReceipt
        sale={currentSale}
        onClose={() => {
          setShowReceipt(false)
          setCurrentSale(null)
        }}
        onNewSale={() => {
          setShowReceipt(false)
          setCurrentSale(null)
        }}
      />
    )
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
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  {currentTime.toLocaleTimeString("fr-FR")}
                </div>
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
              <Button onClick={() => setShowScanner(true)} className="bg-blue-600 hover:bg-blue-700">
                <Scan className="h-4 w-4 mr-2" />
                Scanner
              </Button>
            </div>

            {/* Filtres par catégorie */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grille des produits */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`cursor-pointer hover:shadow-lg transition-shadow ${
                product.currentStock <= product.minStock ? "border-orange-300 bg-orange-50" : ""
              } ${product.currentStock === 0 ? "border-red-300 bg-red-50 opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => product.currentStock > 0 && addToCart(product)}
            >
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.productName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm line-clamp-2">{product.productName}</h3>
                  <p className="text-xs text-gray-500">{product.brandName}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-blue-600">{product.prix_detail.toFixed(2)} €</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        product.currentStock === 0
                          ? "border-red-300 text-red-600"
                          : product.currentStock <= product.minStock
                            ? "border-orange-300 text-orange-600"
                            : "border-green-300 text-green-600"
                      }`}
                    >
                      Stock: {product.currentStock}
                    </Badge>
                  </div>
                  {product.currentStock <= product.minStock && product.currentStock > 0 && (
                    <div className="text-xs text-orange-600 font-medium">⚠️ Stock faible</div>
                  )}
                  {product.currentStock === 0 && (
                    <div className="text-xs text-red-600 font-medium">❌ Rupture de stock</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun produit trouvé</p>
          </div>
        )}
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
                {totalItems} article{totalItems > 1 ? "s" : ""}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Articles du panier */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Panier vide</p>
                  <p className="text-sm">Ajoutez des produits pour commencer</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div
                    key={`${item.id}-${item.priceType}-${index}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-500">
                        {item.price.toFixed(2)} € × {item.quantity}
                      </p>
                      {item.priceType === "wholesale" && (
                        <Badge variant="secondary" className="text-xs">
                          Prix Gros
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.priceType, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.priceType, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCart(item.id, item.priceType)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totaux */}
            {cart.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Sous-total HT:</span>
                  <span>{cartHT.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>TVA:</span>
                  <span>{cartTVA.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total TTC:</span>
                  <span className="text-green-600">{cartTotal.toFixed(2)} €</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-4">
              {cart.length > 0 && (
                <Button variant="outline" onClick={clearCart} className="w-full bg-transparent">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vider le Panier
                </Button>
              )}
              <Button
                onClick={proceedToPayment}
                disabled={cart.length === 0}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Procéder au Paiement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
