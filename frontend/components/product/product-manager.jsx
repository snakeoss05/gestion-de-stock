"use client";
import axios from "axios";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Package, Edit, BarChart3 } from "lucide-react";
import AddProductForm from "./add-product-form";
import ProductList from "./product-list";
import ProductView from "./product-view";

export default function ProductManager() {
  const [currentView, setCurrentView] = useState("list"); // list, add, view, edit
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    actifs: 0,
    faibleStock: 0,
    rupture: 0,
  });
  // Sample product data - in a real app, this would come from your API
  const [products, setProducts] = useState([]);
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
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products?page=${page}&limit=8&category=${categoryFilter}&status=${statusFilter}`
        );
        setProducts(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [page, categoryFilter, statusFilter]);
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
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/stock"
        );
        setProductStats(response.data);
      } catch (error) {
        toast.error("Failed to fetch categories.");
      }
    };

    fetchStock();
  }, []);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView("view");
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView("edit");
  };
  const handleDelete = async (ProductId) => {
    const res = await axios.delete(
      `http://localhost:5000/api/products/${ProductId}`
    );
    if (res.status === 200) {
      toast.success("Product deleted successfully");
    } else {
      toast.error("Failed to delete product");
    }
  };
  const handleDeleteProduct = (productId) => {
    handleDelete(productId);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "add":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Ajouter un Produit
              </h2>
              <Button onClick={() => setCurrentView("list")} variant="outline">
                Retour à la Liste
              </Button>
            </div>
            <AddProductForm />
          </div>
        );

      case "view":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Détails du Produit
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEditProduct(selectedProduct)}
                  className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  onClick={() => setCurrentView("list")}
                  variant="outline">
                  Retour à la Liste
                </Button>
              </div>
            </div>
            <ProductView product={selectedProduct} />
          </div>
        );

      case "edit":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Modifier le Produit
              </h2>
              <Button onClick={() => setCurrentView("list")} variant="outline">
                Retour à la Liste
              </Button>
            </div>
            <AddProductForm product={selectedProduct} isEditing={true} />
          </div>
        );

      default:
        return (
          <div>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Produits</p>
                      <p className="text-2xl font-bold">
                        {productStats.totalProducts}
                      </p>
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
                      <p className="text-2xl font-bold">
                        {productStats.actifs}
                      </p>
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
                      <p className="text-2xl font-bold">
                        {productStats.faibleStock}
                      </p>
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
                      <p className="text-2xl font-bold">
                        {productStats.rupture}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-red-200" />
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
                    <CardDescription>
                      Gérez tous vos produits depuis cette interface
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setCurrentView("add")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Toutes les catégories
                        </SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="w-full lg:w-48">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}>
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
              products={products}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        );
    }
  };

  return <div className="space-y-6">{renderCurrentView()}</div>;
}
