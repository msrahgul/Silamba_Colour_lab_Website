import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Occasion } from "@/data/mockData";
import { api } from "@/lib/api";

const AdminOccasions = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Occasion, "id">>({
    name: "",
    image: "",
    description: "",
  });

  const { data: occasions = [], isLoading } = useQuery({
    queryKey: ["occasions"],
    queryFn: api.getOccasions,
  });

  const createMutation = useMutation({
    mutationFn: api.createOccasion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["occasions"] });
      toast({ title: "Success", description: "Occasion added successfully" });
      setShowForm(false);
      setFormData({ name: "", image: "", description: "" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add occasion", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: api.updateOccasion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["occasions"] });
      toast({ title: "Success", description: "Occasion updated successfully" });
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: "", image: "", description: "" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update occasion", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteOccasion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["occasions"] });
      toast({ title: "Success", description: "Occasion deleted successfully" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete occasion", variant: "destructive" });
    },
  });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: "", image: "", description: "" });
    setShowForm(true);
  };

  const handleEdit = (occasion: Occasion) => {
    setEditingId(occasion.id);
    setFormData({
      name: occasion.name,
      image: occasion.image,
      description: occasion.description,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Occasion name is required",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate({
        id: `occ-${Date.now()}`,
        ...formData,
      });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Occasions
          </h2>
          <p className="text-muted-foreground">
            Manage gift ideas by occasions (shown in horizontal scroll)
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Occasion
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold">
                {editingId ? "Edit Occasion" : "Add Occasion"}
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
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Birthday"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description..."
                  rows={3}
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
            <AlertDialogTitle>Delete Occasion?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this occasion. This action cannot be
              undone.
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

      {/* Occasions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {occasions.map((occasion) => (
          <div
            key={occasion.id}
            className="bg-card rounded-xl overflow-hidden shadow-card"
          >
            <div className="h-40 bg-muted overflow-hidden">
              {occasion.image && (
                <img
                  src={occasion.image}
                  alt={occasion.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h4 className="font-display font-semibold text-foreground mb-1">
                {occasion.name}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {occasion.description || "No description"}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(occasion)}
                  className="flex-1"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteId(occasion.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {occasions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No occasions yet. Click "Add Occasion" to create one.
        </div>
      )}
    </div>
  );
};

export default AdminOccasions;
