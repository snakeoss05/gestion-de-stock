import ProductManager from "../../components/product/product-manager";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Gestion des Produits
            </h1>
            <p className="text-gray-600">
              Ajoutez, modifiez et gérez tous vos produits
            </p>
          </div>
          <ProductManager />
        </div>
      </div>
    </div>
  );
}
