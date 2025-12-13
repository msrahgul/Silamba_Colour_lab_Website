import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Offer } from "@/data/mockData";

const AdminOffers = () => {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

    const [formData, setFormData] = useState<Partial<Offer>>({
        title: "",
        description: "",
        discount: "",
        image: "",
        link: "",
        code: "",
        isActive: true,
    });

    const { data: offers = [], isLoading } = useQuery({
        queryKey: ["offers"],
        queryFn: api.getOffers,
    });

    const createMutation = useMutation({
        mutationFn: api.createOffer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offers"] });
            toast({ title: "Success", description: "Offer created successfully" });
            setIsDialogOpen(false);
            resetForm();
        },
    });

    const updateMutation = useMutation({
        mutationFn: api.updateOffer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offers"] });
            toast({ title: "Success", description: "Offer updated successfully" });
            setIsDialogOpen(false);
            resetForm();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: api.deleteOffer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offers"] });
            toast({ title: "Success", description: "Offer deleted successfully" });
        },
    });

    const resetForm = () => {
        setFormData({ title: "", description: "", discount: "", image: "", link: "", code: "", isActive: true });
        setEditingOffer(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.image) return;

        const offerData = {
            ...formData,
            id: editingOffer ? editingOffer.id : crypto.randomUUID(),
        } as Offer;

        if (editingOffer) {
            updateMutation.mutate(offerData);
        } else {
            createMutation.mutate(offerData);
        }
    };

    const handleEdit = (offer: Offer) => {
        setEditingOffer(offer);
        setFormData(offer);
        setIsDialogOpen(true);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-display text-2xl font-bold">Special Offers</h2>
                    <p className="text-muted-foreground">Manage homepage deals and discounts</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button><Plus className="w-4 h-4 mr-2" /> Add Offer</Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingOffer ? "Edit Offer" : "New Offer"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Summer Sale"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="discount">Discount Text</Label>
                                    <Input
                                        id="discount"
                                        value={formData.discount}
                                        onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                        placeholder="e.g. 50% OFF"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="e.g. On all wedding albums..."
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="link">Link</Label>
                                    <Input
                                        id="link"
                                        value={formData.link}
                                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="code">Coupon Code (Optional)</Label>
                                    <Input
                                        id="code"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                                        placeholder="e.g. SAVE20"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 border p-4 rounded-lg">
                                <Switch
                                    id="active"
                                    checked={formData.isActive || false}
                                    onCheckedChange={checked => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="active">Offer Active</Label>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit">{editingOffer ? "Save Changes" : "Create Offer"}</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {offers.map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded overflow-hidden">
                                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                                <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] px-1">{offer.discount}</div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    {offer.title}
                                    {offer.code && <span className="text-xs bg-secondary px-2 py-0.5 rounded border border-dashed border-primary/50 text-primary font-mono">{offer.code}</span>}
                                </h3>
                                <p className="text-sm text-muted-foreground">{offer.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(offer)}>
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(offer.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOffers;
