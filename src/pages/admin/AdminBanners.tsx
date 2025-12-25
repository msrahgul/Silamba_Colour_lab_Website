import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Plus, Trash2, Smartphone, Monitor, Eye, EyeOff, Loader2 } from "lucide-react";
import { uploadToImageKit } from "@/lib/imagekit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Banner } from "@/data/mockData";

const AdminBanners = () => {
  const queryClient = useQueryClient();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isUploading, setIsUploading] = useState<number | null>(null);

  const { data: serverBanners, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: api.getBanners,
  });

  // Sync server data to local state
  useEffect(() => {
    if (serverBanners) {
      setBanners(serverBanners);
    }
  }, [serverBanners]);

  const updateMutation = useMutation({
    mutationFn: async (updatedBanners: Banner[]) => {
      // Update all banners concurrently
      const promises = updatedBanners.map(b => api.updateBanner(b));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast({ title: "Saved", description: "All banners updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save banners.", variant: "destructive" });
    },
  });

  const createMutation = useMutation({
    mutationFn: api.createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast({ title: "Created", description: "New banner added." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      toast({ title: "Deleted", description: "Banner removed." });
    },
  });

  const handleAdd = () => {
    const newBanner: Omit<Banner, "id"> = {
      title: "New Banner",
      subtitle: "",
      image: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=1920&q=80",
      mobileImage: "",
      ctaText: "Shop Now",
      ctaLink: "/products",
      isActive: true,
    };
    createMutation.mutate(newBanner);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSaveAll = () => {
    updateMutation.mutate(banners);
  };

  const updateLocalBanner = (index: number, field: keyof Banner, value: any) => {
    const newBanners = [...banners];
    newBanners[index] = { ...newBanners[index], [field]: value };
    setBanners(newBanners);
  };

  const handleFileUpload = async (index: number, file: File) => {
    try {
      setIsUploading(index);
      const optimizedUrl = await uploadToImageKit(file);
      updateLocalBanner(index, "image", optimizedUrl);
      toast({ title: "Success", description: "Image uploaded and optimized!" });
    } catch (error) {
      toast({ title: "Error", description: "Upload failed", variant: "destructive" });
    } finally {
      setIsUploading(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Banners</h2>
          <p className="text-muted-foreground">Manage homepage slider images</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAdd} variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Add Banner
          </Button>
          <Button onClick={handleSaveAll} disabled={updateMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {banners.map((banner, index) => (
          <Card key={banner.id} className="relative overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">#{index + 1}</span>
                  {banner.title}
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${banner.id}`} className="text-sm">Active</Label>
                    <Switch
                      id={`active-${banner.id}`}
                      checked={banner.isActive}
                      onCheckedChange={(checked) => updateLocalBanner(index, "isActive", checked)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(banner.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title (Alt Text)</Label>
                    <Input
                      value={banner.title}
                      onChange={(e) => updateLocalBanner(index, "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link URL</Label>
                    <Input
                      value={banner.ctaLink}
                      onChange={(e) => updateLocalBanner(index, "ctaLink", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Monitor className="w-4 h-4" /> Desktop Image</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(index, file);
                      }}
                    />
                    {isUploading === index && <Loader2 className="w-4 h-4 animate-spin mt-3" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{banner.image}</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> Mobile Image</Label>
                  <Input
                    value={banner.mobileImage}
                    onChange={(e) => updateLocalBanner(index, "mobileImage", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="rounded-lg overflow-hidden border bg-muted aspect-video relative group">
                  {banner.image ? (
                    <img src={banner.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <span className="font-medium">Link: {banner.ctaLink}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No banners found. Click "Add Banner" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBanners;
