"use client"

import { createContext, useContext, useState } from "react"
import { useToast } from "@/hooks/use-toast"

// Unified product/stock database
const INITIAL_STOCK_DATA = [
  {
    id: 1,
    code_barre: "1234567890123",
    productName: "Casque Sans Fil",
    brandName: "TechSound",
    currentStock: 25,
    minStock: 10,
    maxStock: 50,
    prix_detail: 89.99,
    prix_gros: 65.0,
    category: "Électronique",
    location: "Rayon A-1",
    lastUpdated: "2024-01-15T10:30:00Z",
    cost: 65.0,
    tva: 20,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    code_barre: "2345678901234",
    productName: "Mug Café",
    brandName: "CafeCorp",
    currentStock: 100,
    minStock: 20,
    maxStock: 200,
    prix_detail: 12.99,
    prix_gros: 8.5,
    category: "Maison & Jardin",
    location: "Rayon B-2",
    lastUpdated: "2024-01-14T15:45:00Z",
    cost: 8.5,
    tva: 20,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    code_barre: "3456789012345",
    productName: "Enceinte Bluetooth",
    brandName: "SoundWave",
    currentStock: 15,
    minStock: 5,
    maxStock: 30,
    prix_detail: 45.99,
    prix_gros: 32.0,
    category: "Électronique",
    location: "Rayon A-2",
    lastUpdated: "2024-01-13T09:15:00Z",
    cost: 32.0,
    tva: 20,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    code_barre: "4567890123456",
    productName: "Carnet de Notes",
    brandName: "WriteWell",
    currentStock: 50,
    minStock: 15,
    maxStock: 100,
    prix_detail: 19.99,
    prix_gros: 14.0,
    category: "Fournitures Bureau",
    location: "Rayon C-1",
    lastUpdated: "2024-01-16T14:20:00Z",
    cost: 14.0,
    tva: 20,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    code_barre: "5678901234567",
    productName: "Bouteille d'Eau",
    brandName: "HydroLife",
    currentStock: 75,
    minStock: 25,
    maxStock: 150,
    prix_detail: 24.99,
    prix_gros: 18.0,
    category: "Sport & Plein Air",
    location: "Rayon D-1",
    lastUpdated: "2024-01-16T11:30:00Z",
    cost: 18.0,
    tva: 20,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 6,
    code_barre: "6789012345678",
    productName: "T-Shirt Coton",
    brandName: "FashionCo",
    currentStock: 40,
    minStock: 10,
    maxStock: 80,
    prix_detail: 29.99,
    prix_gros: 20.0,
    category: "Vêtements",
    location: "Rayon E-1",
    lastUpdated: "2024-01-16T11:30:00Z",
    cost: 20.0,
    tva: 20,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 7,
    code_barre: "7890123456789",
    productName: "Chocolat Noir",
    brandName: "ChocoBrand",
    currentStock: 80,
    minStock: 20,
    maxStock: 150,
    prix_detail: 8.5,
    prix_gros: 6.0,
    category: "Alimentation",
    location: "Rayon F-1",
    lastUpdated: "2024-01-16T11:30:00Z",
    cost: 6.0,
    tva: 5.5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 8,
    code_barre: "8901234567890",
    productName: "Stylo Bille",
    brandName: "WritePro",
    currentStock: 200,
    minStock: 50,
    maxStock: 300,
    prix_detail: 3.99,
    prix_gros: 2.5,
    category: "Fournitures Bureau",
    location: "Rayon C-2",
    lastUpdated: "2024-01-16T11:30:00Z",
    cost: 2.5,
    tva: 20,
    image: "/placeholder.svg?height=100&width=100",
  },
]

const INITIAL_MOVEMENTS = [
  {
    id: 1,
    productId: 1,
    productName: "Casque Sans Fil",
    type: "sortie",
    quantity: 3,
    reason: "Vente POS",
    reference: "VENTE-001",
    date: "2024-01-16T14:30:00Z",
    user: "Caissier 1",
    previousStock: 28,
    newStock: 25,
  },
  {
    id: 2,
    productId: 2,
    productName: "Mug Café",
    type: "entrée",
    quantity: 50,
    reason: "Réception Fournisseur",
    reference: "BON-001",
    date: "2024-01-15T09:00:00Z",
    user: "Magasinier",
    previousStock: 50,
    newStock: 100,
  },
]

const StockContext = createContext()

export function StockProvider({ children }) {
  const { toast } = useToast()
  const [stockData, setStockData] = useState(INITIAL_STOCK_DATA)
  const [movements, setMovements] = useState(INITIAL_MOVEMENTS)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Calculer la valeur du stock
  const updateStockValues = (data) => {
    return data.map((item) => ({
      ...item,
      value: item.currentStock * item.cost,
    }))
  }

  // Ajouter un mouvement de stock
  const addStockMovement = (movement) => {
    const newMovement = {
      ...movement,
      id: movements.length + 1,
      date: new Date().toISOString(),
      user: movement.user || "Système",
    }

    setMovements((prev) => [newMovement, ...prev])

    // Mettre à jour le stock du produit
    setStockData((prev) => {
      const updated = prev.map((item) => {
        if (item.id === movement.productId) {
          const newStock =
            movement.type === "entrée"
              ? item.currentStock + movement.quantity
              : item.currentStock - Math.abs(movement.quantity)

          return {
            ...item,
            currentStock: Math.max(0, newStock),
            lastUpdated: new Date().toISOString(),
          }
        }
        return item
      })
      return updateStockValues(updated)
    })

    return newMovement
  }

  // Vérifier la disponibilité du stock
  const checkStockAvailability = (productId, quantity) => {
    const product = stockData.find((p) => p.id === productId)
    if (!product) return { available: false, reason: "Produit non trouvé" }

    if (product.currentStock < quantity) {
      return {
        available: false,
        reason: `Stock insuffisant (${product.currentStock} disponible)`,
        availableStock: product.currentStock,
      }
    }

    return { available: true }
  }

  // Traiter une vente POS
  const processPOSSale = (saleData) => {
    const movements = []
    let hasStockIssues = false
    const stockIssues = []

    // Vérifier d'abord la disponibilité de tous les produits
    for (const item of saleData.items) {
      const product = stockData.find((p) => p.id === item.productId)
      if (product) {
        const availability = checkStockAvailability(item.productId, item.quantity)
        if (!availability.available) {
          hasStockIssues = true
          stockIssues.push({
            product: product.productName,
            requested: item.quantity,
            available: availability.availableStock || 0,
          })
        }
      }
    }

    if (hasStockIssues) {
      return {
        success: false,
        error: "Stock insuffisant",
        issues: stockIssues,
      }
    }

    // Traiter les mouvements de stock
    for (const item of saleData.items) {
      const movement = addStockMovement({
        productId: item.productId,
        productName: item.name,
        type: "sortie",
        quantity: item.quantity,
        reason: "Vente POS",
        reference: saleData.id,
        user: saleData.cashier || "Caissier",
        previousStock: stockData.find((p) => p.id === item.productId)?.currentStock || 0,
        newStock: (stockData.find((p) => p.id === item.productId)?.currentStock || 0) - item.quantity,
      })
      movements.push(movement)
    }

    // Vérifier les alertes de stock après la vente
    const lowStockAlerts = []
    stockData.forEach((product) => {
      const updatedProduct = stockData.find((p) => p.id === product.id)
      if (updatedProduct && updatedProduct.currentStock <= updatedProduct.minStock) {
        lowStockAlerts.push(updatedProduct)
      }
    })

    if (lowStockAlerts.length > 0) {
      toast({
        title: "Alerte Stock !",
        description: `${lowStockAlerts.length} produit(s) sous le seuil minimum`,
        variant: "destructive",
      })
    }

    return {
      success: true,
      movements,
      lowStockAlerts,
    }
  }

  // Obtenir les produits avec stock disponible
  const getAvailableProducts = () => {
    return stockData.filter((product) => product.currentStock > 0)
  }

  // Obtenir les alertes de stock
  const getStockAlerts = () => {
    const lowStock = stockData.filter((item) => item.currentStock <= item.minStock && item.currentStock > 0)
    const outOfStock = stockData.filter((item) => item.currentStock === 0)
    return { lowStock, outOfStock }
  }

  // Actualiser les données
  const refreshData = () => {
    setLastRefresh(new Date())
    toast({
      title: "Données Actualisées",
      description: "Les informations de stock ont été mises à jour",
    })
  }

  const value = {
    stockData: updateStockValues(stockData),
    movements,
    lastRefresh,
    addStockMovement,
    checkStockAvailability,
    processPOSSale,
    getAvailableProducts,
    getStockAlerts,
    refreshData,
    setStockData,
    setMovements,
  }

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>
}

export function useStock() {
  const context = useContext(StockContext)
  if (!context) {
    throw new Error("useStock must be used within a StockProvider")
  }
  return context
}
