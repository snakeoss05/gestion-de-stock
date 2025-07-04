import InvoiceManager from "../../components/invoice-manager"

export default function InvoicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Factures</h1>
            <p className="text-gray-600">Créez, gérez et suivez toutes vos factures de vente et d'achat</p>
          </div>
          <InvoiceManager />
        </div>
      </div>
    </div>
  )
}
