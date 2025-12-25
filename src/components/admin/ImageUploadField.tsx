import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud } from "lucide-react";
import { uploadToImageKit } from "@/lib/imagekit";
import { toast } from "@/hooks/use-toast";

interface ImageUploadFieldProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
}

export const ImageUploadField = ({ label, value, onChange }: ImageUploadFieldProps) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const url = await uploadToImageKit(file);
            onChange(url);
            toast({ title: "Success", description: "Image uploaded and optimized" });
        } catch (error) {
            toast({ title: "Error", description: "Upload failed", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <Label className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4" /> {label}
            </Label>
            <div className="flex gap-2 items-center">
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
            {value && (
                <p className="text-[10px] text-muted-foreground truncate bg-muted p-1 rounded">
                    Current: {value}
                </p>
            )}
        </div>
    );
};
