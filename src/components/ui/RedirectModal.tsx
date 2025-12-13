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
import { ExternalLink } from "lucide-react";

interface RedirectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    url: string;
}

export const RedirectModal = ({ isOpen, onClose, onConfirm, url }: RedirectModalProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        Visit Online Store? <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base pt-2">
                        You are being redirected to our official buying page at
                        <span className="font-semibold text-foreground"> Photoland.in </span>
                        to view more details and complete your purchase.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                    <AlertDialogCancel onClick={onClose}>Stay Here</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-primary text-primary-foreground">
                        Continue to Product
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
