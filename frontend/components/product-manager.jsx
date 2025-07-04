"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Package, Edit, BarChart3 } from "lucide-react"
import AddProductForm from "./add-product-form"
import ProductList from "./product-list"
import ProductView from "./product-view"

export default function ProductManager() {
  const [currentView, setCurrentView] = useState("list") // list, add, view, edit
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Sample product data - in a real app, this would come from your API
  const [products] = useState([
    {
      id: 1,
      productName: "Wireless Headphones",
      brandName: "TechSound",
      category: "Electronics",
      code_barre: "1234567890123",
      prix_achat: 45.0,
      prix_detail: 89.99,
      prix_gros: 65.0,
      stock: 25,
      place: "Warehouse A",
      status: "active",
      description: "High-quality wireless headphones with noise cancellation",
      tva: 20,
      discount: 0,
      gros_qty: 10,
      image: null,
      dateAdded: "2024-01-15",
    },
    {
      id: 2,
      productName: "Coffee Mug",
      brandName: "CafeCorp",
      category: "Home & Garden",
      code_barre: "2345678901234",
      prix_achat: 5.5,
      prix_detail: 12.99,
      prix_gros: 8.5,
      stock: 100,
      place: "Store Front",
      status: "active",
      description: "Ceramic coffee mug with ergonomic handle",
      tva: 20,
      discount: 10,
      gros_qty: 20,
      image: null,
      dateAdded: "2024-01-10",
    },
    {
      id: 3,
      productName: "Bluetooth Speaker",
      brandName: "SoundWave",
      category: "Electronics",
      code_barre: "3456789012345",
      prix_achat: 25.0,
      prix_detail: 45.99,
      prix_gros: 32.0,
      stock: 5,
      place: "Warehouse B",
      status: "low_stock",
      description: "Portable Bluetooth speaker with premium sound quality",
      tva: 20,
      discount: 0,
      gros_qty: 5,
      image: null,
      dateAdded: "2024-01-08",
    },
    {
      id: 4,
      productName: "Notebook Set",
      brandName: "WriteWell",
      category: "Office Supplies",
      code_barre: "4567890123456",
      prix_achat: 8.0,
      prix_detail: 19.99,
      prix_gros: 14.0,
      stock: 0,
      place: "Storage Room",
      status: "out_of_stock",
      description: "Set of 3 premium notebooks with lined pages",
      tva: 20,
      discount: 5,
      gros_qty: 15,
      image: null,
      dateAdded: "2024-01-05",
    },
  ])

  const categories = [
    "Electronics",
    "Home & Garden",
    "Office Supplies",
    "Clothing",
    "Food & Beverages",
    "Sports & Outdoors",
    "Books",
    "Toys & Games",
    "Health & Beauty",
  ]

  const getProductStats = () => {
    const totalProducts = products.length
    const activeProducts = products.filter((p) => p.status === "active").length
    const lowStockProducts = products.filter((p) => p.stock <= 10).length
    const outOfStockProducts = products.filter((p) => p.stock === 0).length
    const totalValue = products.reduce((sum, p) => sum + p.prix_achat * p.stock, 0)

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue,
    }
  }

  const stats = getProductStats()

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code_barre.includes(searchTerm)

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.status === "active") ||
      (statusFilter === "low_stock" && product.stock <= 10) ||
      (statusFilter === "out_of_stock" && product.stock === 0)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleViewProduct = (product) => {
    setSelectedProduct(product)
    setCurrentView("view")
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setCurrentView("edit")
  }

  const handleDeleteProduct = (productId) => {
    // In a real app, this would make an API call
    console.log("Delete product:", productId)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "add":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Ajouter un Produit</h2>
              <Button onClick={() => setCurrentView("list")} variant="outline">
                Retour à la Liste
              </Button>
            </div>
            <AddProductForm />
          </div>
        )

      case "view":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Détails du Produit</h2>
              <div className="flex gap-2">
                <Button onClick={() => handleEditProduct(selectedProduct)} className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button onClick={() => setCurrentView("list")} variant="outline">
                  Retour à la Liste
                </Button>
              </div>
            </div>
            <ProductView product={selectedProduct} />
          </div>
        )

      case "edit":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Modifier le Produit</h2>
              <Button onClick={() => setCurrentView("list")} variant="outline">
                Retour à la Liste
              </Button>
            </div>
            <AddProductForm product={selectedProduct} isEditing={true} />
          </div>
        )

      default:
        return (
          <div>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Produits</p>
                      <p className="text-2xl font-bold">{stats.totalProducts}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Actifs</p>
                      <p className="text-2xl font-bold">{stats.activeProducts}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Stock Faible</p>
                      <p className="text-2xl font-bold">{stats.lowStockProducts}</p>
                    </div>
                    <Package className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Rupture</p>
                      <p className="text-2xl font-bold">{stats.outOfStockProducts}</p>
                    </div>
                    <Package className="h-8 w-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Valeur Stock</p>
                      <p className="text-2xl font-bold">€{stats.totalValue.toFixed(0)}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Liste des Produits
                    </CardTitle>
                    <CardDescription>Gérez tous vos produits depuis cette interface</CardDescription>
                  </div>
                  <Button
                    onClick={() => setCurrentView("add")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un Produit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher par nom, marque ou code-barres..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="w-full lg:w-48">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="w-full lg:w-48">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="low_stock">Stock faible</SelectItem>
                        <SelectItem value="out_of_stock">Rupture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product List */}
            <ProductList
              products={filteredProducts}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        )
    }
  }

  return <div className="space-y-6">{renderCurrentView()}</div>
}
