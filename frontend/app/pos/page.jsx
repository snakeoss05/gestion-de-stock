import POSInterface from "../../components/pos-interface"

export default function POSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Point de Vente (POS)</h1>
            <p className="text-gray-600">Interface de caisse pour vos ventes</p>
          </div>
          <POSInterface />
        </div>
      </div>
    </div>
  )
}
