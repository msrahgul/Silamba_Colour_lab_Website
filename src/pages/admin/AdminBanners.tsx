import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  STORAGE_KEYS,
  Banner,
  defaultBanner,
} from "@/data/mockData";

const AdminBanners = () => {
  const queryClient = useQueryClient();
  const [banner, setBanner] = useState<Banner>(defaultBanner);

  const { data: serverBanner, isLoading } = useQuery({
    queryKey: ["banner"],
    queryFn: api.getBanner,
  });

  const mutation = useMutation({
    mutationFn: api.updateBanner,
    onSuccess: (updatedBanner) => {
      queryClient.setQueryData(["banner"], updatedBanner);
      toast({
        title: "Banner Updated",
        description: "The offer banner has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update banner. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (serverBanner) {
      setBanner(serverBanner);
    }
  }, [serverBanner]);

  const handleSave = () => {
    mutation.mutate(banner);
  };

  const isSaving = mutation.isPending;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Offer Banner
          </h2>
          <p className="text-muted-foreground">
            Manage the pop-up banner that appears to visitors
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-card rounded-xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="active" className="text-base font-medium">
              Banner Active
            </Label>
            <div className="flex items-center gap-2">
              {banner.isActive ? (
                <Eye className="w-4 h-4 text-green-500" />
              ) : (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              )}
              <Switch
                id="active"
                checked={banner.isActive}
                onCheckedChange={(checked) =>
                  setBanner({ ...banner, isActive: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={banner.title}
              onChange={(e) => setBanner({ ...banner, title: e.target.value })}
              placeholder="Enter banner title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle / Description</Label>
            <Textarea
              id="subtitle"
              value={banner.subtitle}
              onChange={(e) =>
                setBanner({ ...banner, subtitle: e.target.value })
              }
              placeholder="Enter banner description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={banner.image}
              onChange={(e) => setBanner({ ...banner, image: e.target.value })}
              placeholder="Enter image URL"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctaText">Button Text</Label>
              <Input
                id="ctaText"
                value={banner.ctaText}
                onChange={(e) =>
                  setBanner({ ...banner, ctaText: e.target.value })
                }
                placeholder="e.g., Shop Now"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaLink">Button Link</Label>
              <Input
                id="ctaLink"
                value={banner.ctaLink}
                onChange={(e) =>
                  setBanner({ ...banner, ctaLink: e.target.value })
                }
                placeholder="e.g., #products"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">
            Preview
          </h3>
          <div className="relative rounded-lg overflow-hidden bg-muted">
            {banner.image && (
              <img
                src={banner.image}
                alt="Banner Preview"
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4 text-center">
              <h4 className="font-display text-xl font-bold text-foreground mb-1">
                {banner.title || "Banner Title"}
              </h4>
              <p className="text-muted-foreground text-sm mb-3">
                {banner.subtitle || "Banner description goes here"}
              </p>
              <Button size="sm">{banner.ctaText || "Shop Now"}</Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            This banner appears once per session when visitors load the homepage
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminBanners;
