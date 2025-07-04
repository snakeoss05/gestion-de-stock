"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users } from "lucide-react"
import ClientForm from "./client-form"
import ClientList from "./client-list"
import ClientView from "./client-view"
import { useToast } from "@/hooks/use-toast"

export default function ClientManager() {
  const { toast } = useToast()
  const [currentView, setCurrentView] = useState("list") // list, create, edit, view
  const [selectedClient, setSelectedClient] = useState(null)
  const [clients, setClients] = useState([
    {
      id: "CLI-001",
      nom: "Dupont",
      prenom: "Jean",
      entreprise: "Dupont & Associés",
      email: "jean.dupont@dupont-associes.fr",
      telephone: "01 23 45 67 89",
      adresse: "25 Rue de la République\n75011 Paris, France",
      ville: "Paris",
      codePostal: "75011",
      pays: "France",
      siret: "12345678901234",
      tva: "FR12345678901",
      typeClient: "professionnel",
      conditionsPaiement: "30 jours",
      limiteCredit: "10000",
      remiseAccordee: "5%",
      notes: "Client fidèle depuis 2020",
      statut: "actif",
      dateCreation: "2024-01-10",
    },
    {
      id: "CLI-002",
      nom: "Martin",
      prenom: "Sophie",
      entreprise: "",
      email: "sophie.martin@email.com",
      telephone: "06 12 34 56 78",
      adresse: "12 Avenue des Fleurs\n69000 Lyon, France",
      ville: "Lyon",
      codePostal: "69000",
      pays: "France",
      siret: "",
      tva: "",
      typeClient: "particulier",
      conditionsPaiement: "Comptant",
      limiteCredit: "2000",
      remiseAccordee: "0%",
      notes: "Préfère les paiements par carte",
      statut: "actif",
      dateCreation: "2024-01-15",
    },
    {
      id: "CLI-003",
      nom: "Leroy",
      prenom: "Pierre",
      entreprise: "Leroy Construction",
      email: "p.leroy@leroy-construction.fr",
      telephone: "04 56 78 90 12",
      adresse: "8 Zone Industrielle\n13000 Marseille, France",
      ville: "Marseille",
      codePostal: "13000",
      pays: "France",
      siret: "98765432109876",
      tva: "FR98765432109",
      typeClient: "professionnel",
      conditionsPaiement: "45 jours",
      limiteCredit: "25000",
      remiseAccordee: "8%",
      notes: "Gros volumes, négociation possible",
      statut: "suspendu",
      dateCreation: "2024-02-01",
    },
  ])

  const handleCreateClient = (clientData) => {
    const newClient = {
      ...clientData,
      id: `CLI-${String(clients.length + 1).padStart(3, "0")}`,
      dateCreation: new Date().toISOString().split("T")[0],
    }
    setClients([...clients, newClient])
    setCurrentView("list")
    toast({
      title: "Client Créé !",
      description: `Le client ${newClient.prenom} ${newClient.nom} a été ajouté avec succès.`,
    })
  }

  const handleUpdateClient = (clientData) => {
    setClients(clients.map((cli) => (cli.id === selectedClient.id ? { ...clientData, id: selectedClient.id } : cli)))
    setCurrentView("list")
    setSelectedClient(null)
    toast({
      title: "Client Modifié !",
      description: `Les informations du client ont été mises à jour.`,
    })
  }

  const handleDeleteClient = (clientId) => {
    setClients(clients.filter((cli) => cli.id !== clientId))
    toast({
      title: "Client Supprimé !",
      description: `Le client a été supprimé de la base de données.`,
      variant: "destructive",
    })
  }

  const handleViewClient = (client) => {
    setSelectedClient(client)
    setCurrentView("view")
  }

  const handleEditClient = (client) => {
    setSelectedClient(client)
    setCurrentView("edit")
  }

  const getStatusStats = () => {
    const stats = clients.reduce(
      (acc, client) => {
        acc[client.statut] = (acc[client.statut] || 0) + 1
        acc[client.typeClient] = (acc[client.typeClient] || 0) + 1
        acc.total += 1
        return acc
      },
      { actif: 0, suspendu: 0, particulier: 0, professionnel: 0, total: 0 },
    )
    return stats
  }

  const stats = getStatusStats()

  if (currentView === "create") {
    return (
      <div>
        <div className="mb-6">
          <Button onClick={() => setCurrentView("list")} variant="outline" className="mb-4">
            ← Retour aux Clients
          </Button>
        </div>
        <ClientForm onSubmit={handleCreateClient} onCancel={() => setCurrentView("list")} />
      </div>
    )
  }

  if (currentView === "edit" && selectedClient) {
    return (
      <div>
        <div className="mb-6">
          <Button onClick={() => setCurrentView("list")} variant="outline" className="mb-4">
            ← Retour aux Clients
          </Button>
        </div>
        <ClientForm
          client={selectedClient}
          onSubmit={handleUpdateClient}
          onCancel={() => setCurrentView("list")}
          isEditing={true}
        />
      </div>
    )
  }

  if (currentView === "view" && selectedClient) {
    return (
      <div>
        <div className="mb-6">
          <Button onClick={() => setCurrentView("list")} variant="outline" className="mb-4">
            ← Retour aux Clients
          </Button>
        </div>
        <ClientView
          client={selectedClient}
          onEdit={() => setCurrentView("edit")}
          onDelete={() => {
            handleDeleteClient(selectedClient.id)
            setCurrentView("list")
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-rose-500 to-pink-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100">Total Clients</p>
                <p className="text-3xl font-bold">{clients.length}</p>
              </div>
              <Users className="h-8 w-8 text-rose-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Actifs</p>
                <p className="text-3xl font-bold">{stats.actif}</p>
              </div>
              <div className="h-8 w-8 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Professionnels</p>
                <p className="text-3xl font-bold">{stats.professionnel}</p>
              </div>
              <div className="h-8 w-8 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">🏢</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Particuliers</p>
                <p className="text-3xl font-bold">{stats.particulier}</p>
              </div>
              <div className="h-8 w-8 bg-purple-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">👤</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestion des Clients
              </CardTitle>
              <CardDescription>Gérez tous vos clients en un seul endroit</CardDescription>
            </div>
            <Button
              onClick={() => setCurrentView("create")}
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Client
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ClientList
            clients={clients}
            onView={handleViewClient}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
          />
        </CardContent>
      </Card>
    </div>
  )
}
