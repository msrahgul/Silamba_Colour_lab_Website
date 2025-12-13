import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Occasion } from "@/data/mockData";

const AdminOccasions = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState<Occasion | null>(null);

  const [formData, setFormData] = useState<Partial<Occasion>>({
    name: "",
    image: "",
    description: "",
    link: "", // Added
  });

  const { data: occasions = [], isLoading } = useQuery({
    queryKey: ["occasions"],
    queryFn: api.getOccasions,
  });

  const createMutation = useMutation({
    mutationFn: api.createOccasion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["occasions"] });
      toast({ title: "Success", description: "Occasion created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: api.updateOccasion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["occasions"] });
      toast({ title: "Success", description: "Occasion updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteOccasion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["occasions"] });
      toast({ title: "Success", description: "Occasion deleted successfully" });
    },
  });

  const resetForm = () => {
    setFormData({ name: "", image: "", description: "", link: "" });
    setEditingOccasion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) return;

    const occasionData = {
      ...formData,
      id: editingOccasion ? editingOccasion.id : crypto.randomUUID(),
    } as Occasion;

    if (editingOccasion) {
      updateMutation.mutate(occasionData);
    } else {
      createMutation.mutate(occasionData);
    }
  };

  const handleEdit = (occasion: Occasion) => {
    setEditingOccasion(occasion);
    setFormData(occasion);
    setIsDialogOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Occasions</h2>
          <p className="text-muted-foreground">Manage occasions and their redirect links</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Occasion</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingOccasion ? "Edit Occasion" : "Add Occasion"}</DialogTitle>
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

              {/* NEW LINK FIELD */}
              <div className="space-y-2">
                <Label htmlFor="link">Redirect Link</Label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="link"
                    placeholder="https://photoland.in/wedding-gifts"
                    className="pl-9"
                    value={formData.link || ""}
                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">The URL to open when this occasion is clicked.</p>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit">{editingOccasion ? "Save Changes" : "Create Occasion"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {occasions.map((occasion) => (
          <div key={occasion.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
            <div className="flex items-center gap-4">
              <img src={occasion.image} alt={occasion.name} className="w-16 h-16 rounded object-cover" />
              <div>
                <h3 className="font-semibold text-lg">{occasion.name}</h3>
                <p className="text-sm text-muted-foreground max-w-md line-clamp-1">{occasion.description}</p>
                {occasion.link && (
                  <a href={occasion.link} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                    Redirects to: {occasion.link} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(occasion)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(occasion.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOccasions;
