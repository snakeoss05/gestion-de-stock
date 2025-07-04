import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { StockProvider } from "../contexts/stock-context"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StockProvider>{children}</StockProvider>
      </body>
    </html>
  )
}
