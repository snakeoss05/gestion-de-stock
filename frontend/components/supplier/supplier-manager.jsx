"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Truck } from "lucide-react"
import SupplierForm from "./supplier-form"
import SupplierList from "./supplier-list"
import SupplierView from "./supplier-view"
import { useToast } from "@/hooks/use-toast"

export default function SupplierManager() {
  const { toast } = useToast()
  const [currentView, setCurrentView] = useState("list") // list, create, edit, view
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [suppliers, setSuppliers] = useState([
    {
      id: "FOUR-001",
      nom: "TechDistrib SARL",
      email: "contact@techdistrib.fr",
      telephone: "01 23 45 67 89",
      adresse: "15 Rue de la Technologie\n75001 Paris, France",
      ville: "Paris",
      codePostal: "75001",
      pays: "France",
      siret: "12345678901234",
      tva: "FR12345678901",
      typeActivite: "Distributeur Électronique",
      personneContact: "Marie Dubois",
      telephoneContact: "01 23 45 67 90",
      emailContact: "marie.dubois@techdistrib.fr",
      conditionsPaiement: "30 jours fin de mois",
      remiseHabituelle: "5%",
      notes: "Fournisseur principal pour les produits électroniques",
      statut: "actif",
      dateCreation: "2024-01-15",
    },
    {
      id: "FOUR-002",
      nom: "Mobilier Pro",
      email: "info@mobilierpro.com",
      telephone: "04 56 78 90 12",
      adresse: "28 Avenue des Artisans\n69000 Lyon, France",
      ville: "Lyon",
      codePostal: "69000",
      pays: "France",
      siret: "98765432109876",
      tva: "FR98765432109",
      typeActivite: "Mobilier de Bureau",
      personneContact: "Jean Martin",
      telephoneContact: "04 56 78 90 13",
      emailContact: "jean.martin@mobilierpro.com",
      conditionsPaiement: "45 jours",
      remiseHabituelle: "8%",
      notes: "Spécialisé dans le mobilier de bureau haut de gamme",
      statut: "actif",
      dateCreation: "2024-01-20",
    },
    {
      id: "FOUR-003",
      nom: "Papeterie Centrale",
      email: "commandes@papeteriecentrale.fr",
      telephone: "02 34 56 78 90",
      adresse: "5 Place du Commerce\n44000 Nantes, France",
      ville: "Nantes",
      codePostal: "44000",
      pays: "France",
      siret: "11223344556677",
      tva: "FR11223344556",
      typeActivite: "Fournitures de Bureau",
      personneContact: "Sophie Leroy",
      telephoneContact: "02 34 56 78 91",
      emailContact: "sophie.leroy@papeteriecentrale.fr",
      conditionsPaiement: "30 jours",
      remiseHabituelle: "3%",
      notes: "Livraison rapide, bon service client",
      statut: "inactif",
      dateCreation: "2024-02-01",
    },
  ])

  const handleCreateSupplier = (supplierData) => {
    const newSupplier = {
      ...supplierData,
      id: `FOUR-${String(suppliers.length + 1).padStart(3, "0")}`,
      dateCreation: new Date().toISOString().split("T")[0],
    }
    setSuppliers([...suppliers, newSupplier])
    setCurrentView("list")
    toast({
      title: "Fournisseur Créé !",
      description: `Le fournisseur ${newSupplier.nom} a été ajouté avec succès.`,
    })
  }

  const handleUpdateSupplier = (supplierData) => {
    setSuppliers(
      suppliers.map((sup) => (sup.id === selectedSupplier.id ? { ...supplierData, id: selectedSupplier.id } : sup)),
    )
    setCurrentView("list")
    setSelectedSupplier(null)
    toast({
      title: "Fournisseur Modifié !",
      description: `Les informations du fournisseur ont été mises à jour.`,
    })
  }

  const handleDeleteSupplier = (supplierId) => {
    setSuppliers(suppliers.filter((sup) => sup.id !== supplierId))
    toast({
      title: "Fournisseur Supprimé !",
      description: `Le fournisseur a été supprimé de la base de données.`,
      variant: "destructive",
    })
  }

  const handleViewSupplier = (supplier) => {
    setSelectedSupplier(supplier)
    setCurrentView("view")
  }

  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier)
    setCurrentView("edit")
  }

  const getStatusStats = () => {
    const stats = suppliers.reduce(
      (acc, supplier) => {
        acc[supplier.statut] = (acc[supplier.statut] || 0) + 1
        acc.total += 1
        return acc
      },
      { actif: 0, inactif: 0, total: 0 },
    )
    return stats
  }

  const stats = getStatusStats()

  if (currentView === "create") {
    return (
      <div>
        <div className="mb-6">
          <Button onClick={() => setCurrentView("list")} variant="outline" className="mb-4">
            ← Retour aux Fournisseurs
          </Button>
        </div>
        <SupplierForm onSubmit={handleCreateSupplier} onCancel={() => setCurrentView("list")} />
      </div>
    )
  }

  if (currentView === "edit" && selectedSupplier) {
    return (
      <div>
        <div className="mb-6">
          <Button onClick={() => setCurrentView("list")} variant="outline" className="mb-4">
            ← Retour aux Fournisseurs
          </Button>
        </div>
        <SupplierForm
          supplier={selectedSupplier}
          onSubmit={handleUpdateSupplier}
          onCancel={() => setCurrentView("list")}
          isEditing={true}
        />
      </div>
    )
  }

  if (currentView === "view" && selectedSupplier) {
    return (
      <div>
        <div className="mb-6">
          <Button onClick={() => setCurrentView("list")} variant="outline" className="mb-4">
            ← Retour aux Fournisseurs
          </Button>
        </div>
        <SupplierView
          supplier={selectedSupplier}
          onEdit={() => setCurrentView("edit")}
          onDelete={() => {
            handleDeleteSupplier(selectedSupplier.id)
            setCurrentView("list")
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100">Total Fournisseurs</p>
                <p className="text-3xl font-bold">{suppliers.length}</p>
              </div>
              <Truck className="h-8 w-8 text-emerald-200" />
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

        <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100">Inactifs</p>
                <p className="text-3xl font-bold">{stats.inactif}</p>
              </div>
              <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">⏸</span>
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
                <Truck className="h-5 w-5" />
                Gestion des Fournisseurs
              </CardTitle>
              <CardDescription>Gérez tous vos fournisseurs en un seul endroit</CardDescription>
            </div>
            <Button
              onClick={() => setCurrentView("create")}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Fournisseur
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SupplierList
            suppliers={suppliers}
            onView={handleViewSupplier}
            onEdit={handleEditSupplier}
            onDelete={handleDeleteSupplier}
          />
        </CardContent>
      </Card>
    </div>
  )
}
