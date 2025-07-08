"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Grid3X3,
  Package,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    order: 0,
    image: null,
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data.data);
    } catch (error) {
      toast.error("Échec du chargement des catégories.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5MB.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner un fichier image valide.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Le nom de la catégorie ne peut pas être vide.");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      if (formData.description)
        formDataToSend.append("description", formData.description);
      if (formData.order) formDataToSend.append("order", formData.order);
      if (formData.image) formDataToSend.append("image", formData.image);

      const url = editingCategory
        ? `http://localhost:5000/api/categories/${editingCategory._id}`
        : "http://localhost:5000/api/categories";
      const method = editingCategory ? "put" : "post";

      const response = await axios[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success(
          editingCategory
            ? "Catégorie mise à jour avec succès."
            : "Catégorie ajoutée avec succès."
        );
        resetForm();
        fetchCategories();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error(error.response?.data?.message || "Une erreur est survenue.");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      order: 0,
      image: null,
    });
    setEditingCategory(null);
    setImagePreview(null);
    setShowForm(false);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      order: category.order || 0,
      image: null,
    });
    setImagePreview(category.image);
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    toast(
      (t) => (
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="font-medium">Confirmer la suppression</p>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Êtes-vous sûr de vouloir supprimer la catégorie "{name}" ?
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const response = await axios.delete(
                    `http://localhost:5000/api/categories/${id}`,
                    { withCredentials: true }
                  );
                  if (response.status === 200) {
                    setCategories((prev) =>
                      prev.filter((category) => category._id !== id)
                    );
                    toast.success("Catégorie supprimée avec succès.");
                  }
                } catch (error) {
                  toast.error(
                    error.response?.data?.message || "Échec de la suppression."
                  );
                }
              }}>
              Supprimer
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.dismiss(t.id)}>
              Annuler
            </Button>
          </div>
        </div>
      ),
      { duration: Number.POSITIVE_INFINITY }
    );
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: categories.length,
    withImages: categories.filter((cat) => cat.image).length,
    withDescriptions: categories.filter((cat) => cat.description).length,
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Catégories
          </h1>
          <p className="text-gray-600 mt-1">
            Organisez vos produits par catégories
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
            <Package className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {stats.total} Total
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              {stats.withImages} Avec Images
            </span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Masquer le formulaire" : "Nouvelle Catégorie"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-blue-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-blue-900">
                {editingCategory
                  ? "Modifier la Catégorie"
                  : "Nouvelle Catégorie"}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nom de la Catégorie *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Électronique, Vêtements..."
                    required
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order" className="text-sm font-medium">
                    Ordre d'Affichage
                  </Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description de la catégorie..."
                  rows={3}
                  className="focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Image de la Catégorie
                </Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formats acceptés: JPG, PNG, GIF (max 5MB)
                    </p>
                  </div>

                  {imagePreview && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Aperçu"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      {editingCategory ? (
                        <>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Modifier
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5" />
              Liste des Catégories
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              {filteredCategories.length} catégorie
              {filteredCategories.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 group-hover:border-blue-300 transition-colors">
                      <Image
                        src={
                          category.image ||
                          "/placeholder.svg?height=64&width=64"
                        }
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      {category.order > 0 && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Ordre: {category.order}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(category)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleDelete(category._id, category.name)
                        }
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "Aucune catégorie trouvée" : "Aucune catégorie"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? `Aucune catégorie ne correspond à "${searchTerm}"`
                  : "Commencez par créer votre première catégorie"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une catégorie
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManager;
