import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SubCategory } from "@/data/mockData";
import { api } from "@/lib/api";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const AdminSubCategories = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [formData, setFormData] = useState<Omit<SubCategory, "id">>({
    categoryId: "",
    name: "",
    image: "",
    externalUrl: "",
    price: "",
  });

  const { data: subCategories = [], isLoading: isSubLoading } = useQuery({
    queryKey: ["subcategories"],
    queryFn: api.getSubCategories,
  });

  const { data: categories = [], isLoading: isCatLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: api.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: api.createSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast({ title: "Success", description: "Sub-category added successfully" });
      setShowForm(false);
      setFormData({ categoryId: "", name: "", image: "", externalUrl: "", price: "" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add sub-category", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: api.updateSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast({ title: "Success", description: "Sub-category updated successfully" });
      setShowForm(false);
      setEditingId(null);
      setFormData({ categoryId: "", name: "", image: "", externalUrl: "", price: "" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update sub-category", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast({ title: "Success", description: "Sub-category deleted successfully" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete sub-category", variant: "destructive" });
    },
  });

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const filteredSubCategories =
    filterCategory === "all"
      ? subCategories
      : subCategories.filter((s) => s.categoryId === filterCategory);

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      categoryId: categories[0]?.id || "",
      name: "",
      image: "",
      externalUrl: "",
      price: "",
    });
    setShowForm(true);
  };

  const handleEdit = (subCategory: SubCategory) => {
    setEditingId(subCategory.id);
    setFormData({
      categoryId: subCategory.categoryId,
      name: subCategory.name,
      image: subCategory.image,
      externalUrl: subCategory.externalUrl,
      price: subCategory.price || "",
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.categoryId) {
      toast({
        title: "Error",
        description: "Name and category are required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.externalUrl.trim()) {
      toast({
        title: "Error",
        description: "External redirect URL is required",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate({
        id: `sub-${Date.now()}`,
        ...formData,
      });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId);
  };

  if (isSubLoading || isCatLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Sub-Categories
          </h2>
          <p className="text-muted-foreground">
            Manage products with external redirect URLs
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold">
                {editingId ? "Edit Sub-Category" : "Add Sub-Category"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Parent Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Wooden Frames"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="externalUrl">External Redirect URL *</Label>
                <Input
                  id="externalUrl"
                  value={formData.externalUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, externalUrl: e.target.value })
                  }
                  placeholder="https://www.photoland.in/..."
                />
                <p className="text-xs text-muted-foreground">
                  Users will be redirected to this URL when clicking this item
                </p>
              </div>

              <div className="space-y-2">
                <ImageUploadField
                  label="Product Image"
                  value={formData.image || ""}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Starting Price (optional)</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="e.g., ₹299"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sub-Category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this sub-category. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sub-Categories Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Image</th>
                <th className="text-left p-4 font-medium text-foreground">Name</th>
                <th className="text-left p-4 font-medium text-foreground">Category</th>
                <th className="text-left p-4 font-medium text-foreground">Price</th>
                <th className="text-left p-4 font-medium text-foreground">URL</th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubCategories.map((sub) => (
                <tr key={sub.id} className="border-t border-border">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                      {sub.image && (
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-foreground">{sub.name}</td>
                  <td className="p-4 text-muted-foreground">
                    {getCategoryName(sub.categoryId)}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {sub.price || "-"}
                  </td>
                  <td className="p-4">
                    <a
                      href={sub.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-sm"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(sub)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(sub.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubCategories.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No sub-categories found. Click "Add" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubCategories;
