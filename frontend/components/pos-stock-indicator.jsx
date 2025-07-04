"use client"

import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package } from "lucide-react"
import { useStock } from "../contexts/stock-context"

export default function POSStockIndicator() {
  const { getStockAlerts } = useStock()
  const { lowStock, outOfStock } = getStockAlerts()

  const totalAlerts = lowStock.length + outOfStock.length

  if (totalAlerts === 0) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <Package className="h-4 w-4" />
        <span className="text-sm">Stock OK</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-orange-600">
      <AlertTriangle className="h-4 w-4" />
      <span className="text-sm">{totalAlerts} alerte(s) stock</span>
      <Badge variant="destructive" className="text-xs">
        {outOfStock.length} ruptures
      </Badge>
    </div>
  )
}
