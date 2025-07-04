import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FileText, Truck, Users, Calculator, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Système de Gestion d'Entreprise</h1>
            <p className="text-gray-600">Gérez vos produits, factures, fournisseurs, clients, ventes et stocks</p>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link href="/products">
              <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Produits
                  </CardTitle>
                  <CardDescription className="text-blue-100">Gestion des produits</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">Ajoutez et gérez vos produits avec scanner de codes-barres.</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Aller aux Produits</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/invoices">
              <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    Factures
                  </CardTitle>
                  <CardDescription className="text-green-100">Gestion des factures</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">Créez et gérez vos factures avec scanner de produits.</p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Aller aux Factures</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/fournisseurs">
              <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-6 w-6" />
                    Fournisseurs
                  </CardTitle>
                  <CardDescription className="text-emerald-100">Gestion des fournisseurs</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">Gérez vos fournisseurs et leurs informations.</p>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Aller aux Fournisseurs</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/clients">
              <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Clients
                  </CardTitle>
                  <CardDescription className="text-rose-100">Gestion des clients</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">Gérez vos clients particuliers et professionnels.</p>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700">Aller aux Clients</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/pos">
              <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-6 w-6" />
                    Point de Vente
                  </CardTitle>
                  <CardDescription className="text-indigo-100">Caisse enregistreuse</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">Interface de caisse pour vos ventes en magasin.</p>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Ouvrir la Caisse</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/stock">
              <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    Gestion des Stocks
                  </CardTitle>
                  <CardDescription className="text-amber-100">Suivi et alertes stock</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">Surveillez vos stocks, alertes et mouvements en temps réel.</p>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">Voir les Stocks</Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
