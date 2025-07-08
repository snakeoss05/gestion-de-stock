import ClientManager from "../../components/client/client-manager";

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Gestion des Clients
            </h1>
            <p className="text-gray-600">
              Gérez vos clients et leurs informations
            </p>
          </div>
          <ClientManager />
        </div>
      </div>
    </div>
  );
}
