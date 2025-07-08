"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Package, DollarSign, MapPin, Save, Scan } from "lucide-react";
import toast from "react-hot-toast";
import UniversalBarcodeScanner from "../universal-barcode-scanner";
import axios from "axios";

const locations = ["Warehouse A", "Warehouse B"];

export default function AddProductForm({
  product = null,
  isEditing = false,
  onSave = null,
}) {
  const [formData, setFormData] = useState({
    productName: "",
    brandName: "",
    category: "",
    description: "",
    currentStock: "",
    discount: "",
    tva: "",
    code_barre: "",
    cost: "",
    prix_passager: "",
    prix_gros: "",
    prix_detail: "",
    image: null,
    location: "",
    minStock: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showScanner, setShowScanner] = useState(false);

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditing && product) {
      setFormData({
        productName: product.productName || "",
        brandName: product.brandName || "",
        category: product.category?._id || product.category || "",
        description: product.description || "",
        minStock: product.minStock?.toString() || "",
        currentStock: product.currentStock?.toString() || "",
        discount: product.discount?.toString() || "",
        tva: product.tva?.toString() || "",
        code_barre: product.code_barre || "",
        cost: product.cost?.toString() || "",
        prix_passager: product.prix_passager?.toString() || "",
        prix_gros: product.prix_gros?.toString() || "",
        prix_detail: product.prix_detail?.toString() || "",
        location: product.location || "",
        image: null, // Always reset file input on load, show preview instead
      });

      if (product.image) {
        setImagePreview(product.image);
      } else {
        setImagePreview(null);
      }
    } else if (!isEditing) {
      // Reset form when switching from editing to adding
      setFormData({
        productName: "",
        brandName: "",
        category: "",
        description: "",
        currentStock: "",
        discount: "",
        tva: "",
        code_barre: "",
        cost: "",
        prix_passager: "",
        prix_gros: "",
        prix_detail: "",
        image: null,
        location: "",
        minStock: "",
      });
      setImagePreview(null);
    }
  }, [isEditing, product]);
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
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBarcodeScanned = (barcode) => {
    setFormData((prev) => ({ ...prev, code_barre: barcode }));
    setShowScanner(false);
    toast.success("Barcode ${barcode} has been added to the form.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "image") return; // append image separately
        payload.append(key, value);
      });

      if (formData.image) {
        payload.append("image", formData.image);
      }

      let res;
      if (isEditing && product?._id) {
        // Update existing product
        res = await axios.put(
          `http://localhost:5000/api/products/${product._id}`,
          payload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // Add new product
        res = await axios.post("http://localhost:5000/api/products", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        toast.success(
          isEditing
            ? "✅ Product updated successfully!"
            : "✅ Product created successfully!"
        );

        if (isEditing) {
          // Call onSave callback with updated product data if provided
          onSave && onSave(res.data.product || res.data.data || null);
        } else {
          // Reset form after adding new product
          setFormData({
            productName: "",
            brandName: "",
            category: "",
            description: "",
            currentStock: "",
            discount: "",
            tva: "",
            code_barre: "",
            cost: "",
            prix_passager: "",
            prix_gros: "",
            prix_detail: "",
            image: null,
            location: "",
            minStock: "",
          });
          setImagePreview(null);
        }
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        toast.error("Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      toast.error(
        isEditing ? "❌ Error updating product." : "❌ Error creating product."
      );
    }
  };

  if (showScanner) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <UniversalBarcodeScanner
          title="Scanner de code-barres"
          description="Scannez un code-barres "
          showProductSearch={false}
          onScan={handleBarcodeScanned}
          onClose={() => setShowScanner(false)}
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className=" grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Basic Information */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription className="text-blue-100">
            Enter the basic details about your product
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="productName"
                className="text-sm font-medium text-gray-700">
                Product Name *
              </Label>
              <Input
                id="productName"
                placeholder="Enter product name"
                value={formData.productName}
                onChange={(e) =>
                  handleInputChange("productName", e.target.value)
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="brandName"
                className="text-sm font-medium text-gray-700">
                Brand Name
              </Label>
              <Input
                id="brandName"
                placeholder="Enter brand name"
                value={formData.brandName}
                onChange={(e) => handleInputChange("brandName", e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm font-medium text-gray-700">
              Category *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory & Location */}
      <Card className="shadow-lg h-full border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Inventory & Location
          </CardTitle>
          <CardDescription className="text-green-100">
            Manage stock levels and storage location
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="currentStock"
                className="text-sm font-medium text-gray-700">
                Stock Quantity *
              </Label>
              <Input
                id="currentStock"
                type="number"
                placeholder="0"
                value={formData.currentStock}
                onChange={(e) =>
                  handleInputChange("currentStock", e.target.value)
                }
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="minStock"
                className="text-sm font-medium text-gray-700">
                Min. Qty
              </Label>
              <Input
                id="minStock"
                type="number"
                placeholder="0"
                value={formData.minStock}
                onChange={(e) => handleInputChange("minStock", e.target.value)}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="code_barre"
                className="text-sm font-medium text-gray-700">
                Barcode
              </Label>
              <div className="flex gap-2">
                <Input
                  id="code_barre"
                  placeholder="Enter or scan barcode"
                  value={formData.code_barre}
                  onChange={(e) =>
                    handleInputChange("code_barre", e.target.value)
                  }
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
                <Button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="bg-green-600 hover:bg-green-700 px-3"
                  title="Scan Barcode">
                  <Scan className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Click the scan button to use your camera
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="place"
              className="text-sm font-medium text-gray-700">
              Storage Location
            </Label>
            <Select
              value={formData.location}
              onValueChange={(value) => handleInputChange("location", value)}>
              <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder="Select storage location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing Information
          </CardTitle>
          <CardDescription className="text-orange-100">
            Set different price tiers and tax information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="cost"
                className="text-sm font-medium text-gray-700">
                Prix d'achat *
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.cost}
                  onChange={(e) => handleInputChange("cost", e.target.value)}
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="prix_detail"
                className="text-sm font-medium text-gray-700">
                Prix detail *
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="prix_detail"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.prix_detail}
                  onChange={(e) =>
                    handleInputChange("prix_detail", e.target.value)
                  }
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="prix_gros"
                className="text-sm font-medium text-gray-700">
                Prix Gros
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="prix_gros"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.prix_gros}
                  onChange={(e) =>
                    handleInputChange("prix_gros", e.target.value)
                  }
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="prix_passager"
                className="text-sm font-medium text-gray-700">
                Prix Passager
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="prix_passager"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.prix_passager}
                  onChange={(e) =>
                    handleInputChange("prix_passager", e.target.value)
                  }
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="discount"
                className="text-sm font-medium text-gray-700">
                Discount (%)
              </Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={formData.discount}
                onChange={(e) => handleInputChange("discount", e.target.value)}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="tva"
                className="text-sm font-medium text-gray-700">
                Tax/VAT (%)
              </Label>
              <Input
                id="tva"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="0.00"
                value={formData.tva}
                onChange={(e) => handleInputChange("tva", e.target.value)}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Product Image
          </CardTitle>
          <CardDescription className="text-purple-100">
            Upload a high-quality image of your product
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                {imagePreview ? (
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG or JPEG (MAX. 5MB)
                    </p>
                  </div>
                )}
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {imagePreview && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setImagePreview(null);
                  setFormData((prev) => ({ ...prev, image: null }));
                }}
                className="w-full">
                Remove Image
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center col-span-2 pt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {isEditing ? "Updating Product..." : "Adding Product..."}
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              {isEditing ? "Update Product" : "Add Product"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
