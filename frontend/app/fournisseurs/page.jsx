import SupplierManager from "../../components/supplier-manager"

export default function SuppliersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Fournisseurs</h1>
            <p className="text-gray-600">Gérez vos fournisseurs et leurs informations</p>
          </div>
          <SupplierManager />
        </div>
      </div>
    </div>
  )
}
