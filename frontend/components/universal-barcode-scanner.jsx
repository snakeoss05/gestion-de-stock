"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Camera, Search, Package, Scan } from "lucide-react";

export default function UniversalBarcodeScanner({
  title = "Scanner Code-barres",
  description = "Scannez un code-barres ou recherchez un produit",
  showProductSearch = false,
  onScan,
  onClose,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/products/search?searchterm=${encodeURIComponent(
            searchTerm
          )}`
        );
        const data = await res.json();
        setSearchResults(data.data || []);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const startScanning = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize Quagga scanner (in a real app, you'd import Quagga)
      // For demo purposes, we'll simulate scanning after 3 seconds
      setTimeout(() => {
        handleScanResult("1234567890123");
      }, 3000);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const handleScanResult = async (barcode) => {
    stopScanning();

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/barcode/${barcode}`
      );
      const data = await res.json();

      if (data && data.product) {
        onScan(barcode);
      } else {
        onScan(barcode);
      }
    } catch (err) {
      console.error("Scan fetch error:", err);
      onScan(barcode);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleScanResult(searchTerm.trim());
    }
  };

  const handleProductSelect = (product) => {
    onScan(product.code_barre);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              {title}
            </CardTitle>
            <p className="text-blue-100 text-sm mt-1">{description}</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Camera Scanner */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Scanner avec Caméra</h3>
            <Button
              onClick={isScanning ? stopScanning : startScanning}
              className={
                isScanning
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }>
              <Camera className="h-4 w-4 mr-2" />
              {isScanning ? "Arrêter" : "Démarrer"}
            </Button>
          </div>

          {isScanning && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 bg-black rounded-lg object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-red-500 w-64 h-32 rounded-lg"></div>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600">
                  Positionnez le code-barres dans le cadre
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Manual Entry */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Saisie Manuelle</h3>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <Input
              placeholder="Saisissez le code-barres manuellement"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!searchTerm.trim()}>
              <Search className="h-4 w-4 mr-2" />
              Valider
            </Button>
          </form>
        </div>

        {/* Product Search */}
        {showProductSearch && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recherche de Produits</h3>
            <Input
              placeholder="Rechercher par nom, marque ou catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />

            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductSelect(product)}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.productName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{product.productName}</h4>
                      <p className="text-sm text-gray-600">
                        {product.brandName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Code: {product.code_barre}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        TND {product.prix_detail?.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
