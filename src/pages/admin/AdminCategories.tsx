import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // Added
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Category } from "@/data/mockData";

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    image: "",
    description: "",
    isFeatured: false, // Added
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: api.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Success", description: "Category created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: api.updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Success", description: "Category updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Success", description: "Category deleted successfully" });
    },
  });

  const resetForm = () => {
    setFormData({ name: "", image: "", description: "", isFeatured: false });
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) return;

    const categoryData = {
      ...formData,
      id: editingCategory ? editingCategory.id : crypto.randomUUID(),
    } as Category;

    if (editingCategory) {
      updateMutation.mutate(categoryData);
    } else {
      createMutation.mutate(categoryData);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData(category);
    setIsDialogOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Categories</h2>
          <p className="text-muted-foreground">Manage product categories and featured status</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2 border p-4 rounded-lg">
                <Switch
                  id="featured"
                  checked={formData.isFeatured || false}
                  onCheckedChange={checked => setFormData({ ...formData, isFeatured: checked })}
                />
                <Label htmlFor="featured">Feature on Home Page</Label>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit">{editingCategory ? "Save Changes" : "Create Category"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
            <div className="flex items-center gap-4">
              <img src={category.image} alt={category.name} className="w-12 h-12 rounded object-cover" />
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {category.name}
                  {category.isFeatured && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{category.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(category.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
