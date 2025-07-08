import StockManager from "../../components/stock/stock-manager";

export default function StockPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Gestion des Stocks
            </h1>
            <p className="text-gray-600">
              Surveillez vos stocks, alertes et mouvements en temps réel
            </p>
          </div>
          <StockManager />
        </div>
      </div>
    </div>
  );
}
