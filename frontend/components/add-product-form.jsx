"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Package, DollarSign, MapPin, Save, Scan } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import BarcodeScanner from "./barcode-scanner"

const categories = [
  "Electronics",
  "Clothing",
  "Food & Beverages",
  "Home & Garden",
  "Sports & Outdoors",
  "Books",
  "Toys & Games",
  "Health & Beauty",
]

const locations = [
  "Warehouse A",
  "Warehouse B",
  "Store Front",
  "Storage Room",
  "Display Area",
  "Back Office",
  "Freezer",
  "Shelf 1-A",
]

export default function AddProductForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    productName: "",
    brandName: "",
    category: "",
    description: "",
    stock: "",
    discount: "",
    tva: "",
    code_barre: "",
    prix_achat: "",
    prix_passager: "",
    prix_gros: "",
    prix_detail: "",
    image: null,
    place: "",
    gros_qty: "",
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showScanner, setShowScanner] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBarcodeScanned = (barcode) => {
    setFormData((prev) => ({ ...prev, code_barre: barcode }))
    setShowScanner(false)
    toast({
      title: "Barcode Scanned!",
      description: `Barcode ${barcode} has been added to the form.`,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Product Added Successfully!",
      description: `${formData.productName} has been added to your inventory.`,
    })

    // Reset form
    setFormData({
      productName: "",
      brandName: "",
      category: "",
      description: "",
      stock: "",
      discount: "",
      tva: "",
      code_barre: "",
      prix_achat: "",
      prix_passager: "",
      prix_gros: "",
      prix_detail: "",
      image: null,
      place: "",
      gros_qty: "",
    })
    setImagePreview(null)
    setIsSubmitting(false)
  }

  if (showScanner) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <BarcodeScanner onScan={handleBarcodeScanned} onClose={() => setShowScanner(false)} />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription className="text-blue-100">Enter the basic details about your product</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-sm font-medium text-gray-700">
                Product Name *
              </Label>
              <Input
                id="productName"
                placeholder="Enter product name"
                value={formData.productName}
                onChange={(e) => handleInputChange("productName", e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandName" className="text-sm font-medium text-gray-700">
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
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Category *
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
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
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Inventory & Location
          </CardTitle>
          <CardDescription className="text-green-100">Manage stock levels and storage location</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-sm font-medium text-gray-700">
                Stock Quantity *
              </Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gros_qty" className="text-sm font-medium text-gray-700">
                Wholesale Min. Qty
              </Label>
              <Input
                id="gros_qty"
                type="number"
                placeholder="0"
                value={formData.gros_qty}
                onChange={(e) => handleInputChange("gros_qty", e.target.value)}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code_barre" className="text-sm font-medium text-gray-700">
                Barcode
              </Label>
              <div className="flex gap-2">
                <Input
                  id="code_barre"
                  placeholder="Enter or scan barcode"
                  value={formData.code_barre}
                  onChange={(e) => handleInputChange("code_barre", e.target.value)}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
                <Button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="bg-green-600 hover:bg-green-700 px-3"
                  title="Scan Barcode"
                >
                  <Scan className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">Click the scan button to use your camera</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="place" className="text-sm font-medium text-gray-700">
              Storage Location
            </Label>
            <Select value={formData.place} onValueChange={(value) => handleInputChange("place", value)}>
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
          <CardDescription className="text-orange-100">Set different price tiers and tax information</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prix_achat" className="text-sm font-medium text-gray-700">
                Purchase Price *
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="prix_achat"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.prix_achat}
                  onChange={(e) => handleInputChange("prix_achat", e.target.value)}
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prix_detail" className="text-sm font-medium text-gray-700">
                Retail Price *
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="prix_detail"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.prix_detail}
                  onChange={(e) => handleInputChange("prix_detail", e.target.value)}
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prix_gros" className="text-sm font-medium text-gray-700">
                Wholesale Price
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="prix_gros"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.prix_gros}
                  onChange={(e) => handleInputChange("prix_gros", e.target.value)}
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prix_passager" className="text-sm font-medium text-gray-700">
                Special Price
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="prix_passager"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.prix_passager}
                  onChange={(e) => handleInputChange("prix_passager", e.target.value)}
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount" className="text-sm font-medium text-gray-700">
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
              <Label htmlFor="tva" className="text-sm font-medium text-gray-700">
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
          <CardDescription className="text-purple-100">Upload a high-quality image of your product</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
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
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                  </div>
                )}
                <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            {imagePreview && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setImagePreview(null)
                  setFormData((prev) => ({ ...prev, image: null }))
                }}
                className="w-full"
              >
                Remove Image
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Adding Product...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Add Product
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
