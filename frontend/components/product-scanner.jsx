"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, X, Package, Search } from "lucide-react"
import { useStock } from "../contexts/stock-context"

// Sample product database - in a real app, this would come from your API
// const PRODUCT_DATABASE = [
//   {
//     id: 1,
//     code_barre: "1234567890123",
//     productName: "Wireless Headphones",
//     brandName: "TechSound",
//     prix_detail: 89.99,
//     prix_gros: 65.0,
//     stock: 25,
//     category: "Electronics",
//   },
//   {
//     id: 2,
//     code_barre: "2345678901234",
//     productName: "Coffee Mug",
//     brandName: "CafeCorp",
//     prix_detail: 12.99,
//     prix_gros: 8.5,
//     stock: 100,
//     category: "Home & Garden",
//   },
//   {
//     id: 3,
//     code_barre: "3456789012345",
//     productName: "Bluetooth Speaker",
//     brandName: "SoundWave",
//     prix_detail: 45.99,
//     prix_gros: 32.0,
//     stock: 15,
//     category: "Electronics",
//   },
//   {
//     id: 4,
//     code_barre: "4567890123456",
//     productName: "Notebook Set",
//     brandName: "WriteWell",
//     prix_detail: 19.99,
//     prix_gros: 14.0,
//     stock: 50,
//     category: "Office Supplies",
//   },
//   {
//     id: 5,
//     code_barre: "5678901234567",
//     productName: "Water Bottle",
//     brandName: "HydroLife",
//     prix_detail: 24.99,
//     prix_gros: 18.0,
//     stock: 75,
//     category: "Sports & Outdoors",
//   },
// ]

export default function ProductScanner({ onProductSelect, onClose }) {
  const { stockData: PRODUCT_DATABASE } = useStock()
  const scannerRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState(null)
  const [quagga, setQuagga] = useState(null)
  const [manualBarcode, setManualBarcode] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [priceType, setPriceType] = useState("retail") // retail or wholesale

  useEffect(() => {
    // Dynamically import Quagga
    const loadQuagga = async () => {
      try {
        const QuaggaModule = await import("quagga")
        setQuagga(QuaggaModule.default)
      } catch (err) {
        console.error("Failed to load Quagga:", err)
        setError("Failed to load barcode scanner. Please try again.")
      }
    }

    loadQuagga()
  }, [])

  useEffect(() => {
    if (quagga && isScanning && scannerRef.current) {
      startScanner()
    }

    return () => {
      if (quagga && quagga.initialized) {
        quagga.stop()
      }
    }
  }, [quagga, isScanning])

  const startScanner = () => {
    if (!quagga) return

    quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment",
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: 2,
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader",
          ],
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error("Quagga initialization failed:", err)
          setError("Camera access denied or not available. Please check your camera permissions.")
          return
        }

        quagga.start()

        quagga.onDetected((data) => {
          const code = data.codeResult.code
          console.log("Barcode detected:", code)
          handleBarcodeDetected(code)
          stopScanner()
        })
      },
    )
  }

  const stopScanner = () => {
    if (quagga && quagga.initialized) {
      quagga.stop()
    }
    setIsScanning(false)
  }

  const handleBarcodeDetected = (barcode) => {
    const product = PRODUCT_DATABASE.find((p) => p.code_barre === barcode)
    if (product) {
      setSelectedProduct(product)
      setManualBarcode(barcode)
    } else {
      setError(`Product with barcode ${barcode} not found in database.`)
      setManualBarcode(barcode)
    }
  }

  const handleManualBarcodeSearch = () => {
    if (!manualBarcode.trim()) return

    const product = PRODUCT_DATABASE.find((p) => p.code_barre === manualBarcode.trim())
    if (product) {
      setSelectedProduct(product)
      setError(null)
    } else {
      setError(`Product with barcode ${manualBarcode} not found in database.`)
      setSelectedProduct(null)
    }
  }

  const handleProductSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    const results = PRODUCT_DATABASE.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setSearchResults(results)
  }

  const handleAddProduct = () => {
    if (!selectedProduct) return

    const price = priceType === "retail" ? selectedProduct.prix_detail : selectedProduct.prix_gros
    const invoiceItem = {
      id: Date.now(), // Simple ID generation
      description: `${selectedProduct.brandName} ${selectedProduct.productName}`,
      quantity: quantity,
      price: price,
      total: quantity * price,
      productId: selectedProduct.id,
      barcode: selectedProduct.code_barre,
    }

    onProductSelect(invoiceItem)
    onClose()
  }

  const handleStartScan = () => {
    setError(null)
    setIsScanning(true)
  }

  const handleStopScan = () => {
    stopScanner()
  }

  if (error && !selectedProduct) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <X className="h-5 w-5" />
            Scanner Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-2">
            <Button onClick={() => setError(null)} variant="outline">
              Try Again
            </Button>
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Product Scanner
        </CardTitle>
        <CardDescription className="text-blue-100">
          Scan barcodes or search for products to add to your invoice
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Barcode Scanner</h3>

            {!isScanning ? (
              <div className="text-center">
                <div className="mb-4">
                  <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Ready to scan product barcodes</p>
                </div>
                <Button onClick={handleStartScan} className="bg-blue-600 hover:bg-blue-700 w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera Scanner
                </Button>
              </div>
            ) : (
              <div>
                <div
                  ref={scannerRef}
                  className="w-full h-64 bg-black rounded-lg overflow-hidden mb-4"
                  style={{ position: "relative" }}
                />
                <Button onClick={handleStopScan} variant="destructive" className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Stop Scanner
                </Button>
                <p className="text-sm text-gray-600 text-center mt-2">Position the barcode within the camera view</p>
              </div>
            )}

            {/* Manual Barcode Entry */}
            <div className="space-y-2">
              <Label htmlFor="manualBarcode">Or Enter Barcode Manually</Label>
              <div className="flex gap-2">
                <Input
                  id="manualBarcode"
                  placeholder="Enter barcode number"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleManualBarcodeSearch()}
                />
                <Button onClick={handleManualBarcodeSearch} variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product Search */}
            <div className="space-y-2">
              <Label htmlFor="productSearch">Search Products by Name</Label>
              <Input
                id="productSearch"
                placeholder="Search by product name, brand, or category"
                onChange={(e) => handleProductSearch(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="max-h-40 overflow-y-auto border rounded-lg">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        setSelectedProduct(product)
                        setManualBarcode(product.code_barre)
                        setSearchResults([])
                      }}
                    >
                      <div className="font-medium">
                        {product.brandName} {product.productName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.category} • Stock: {product.stock} • ${product.prix_detail}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Details</h3>

            {selectedProduct ? (
              <div className="space-y-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-lg text-green-800">
                        {selectedProduct.brandName} {selectedProduct.productName}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Barcode:</span>
                          <span className="ml-2 font-mono">{selectedProduct.code_barre}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Category:</span>
                          <span className="ml-2">{selectedProduct.category}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Stock:</span>
                          <span className="ml-2 font-semibold">{selectedProduct.stock} units</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Retail Price:</span>
                          <span className="ml-2 font-semibold">${selectedProduct.prix_detail}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Wholesale Price:</span>
                          <span className="ml-2 font-semibold">${selectedProduct.prix_gros}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quantity and Price Selection */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={selectedProduct.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priceType">Price Type</Label>
                      <select
                        id="priceType"
                        value={priceType}
                        onChange={(e) => setPriceType(e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="retail">Retail (${selectedProduct.prix_detail})</option>
                        <option value="wholesale">Wholesale (${selectedProduct.prix_gros})</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span className="text-xl font-bold text-blue-600">
                        $
                        {(
                          quantity * (priceType === "retail" ? selectedProduct.prix_detail : selectedProduct.prix_gros)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddProduct} className="flex-1 bg-green-600 hover:bg-green-700">
                    <Package className="h-4 w-4 mr-2" />
                    Add to Invoice
                  </Button>
                  <Button onClick={() => setSelectedProduct(null)} variant="outline">
                    Clear
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Scan a barcode or search for a product to see details</p>
              </div>
            )}
          </div>
        </div>

        {error && selectedProduct && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="outline">
            Close Scanner
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
