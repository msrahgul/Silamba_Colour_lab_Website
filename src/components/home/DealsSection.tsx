import { motion } from "framer-motion";
import { Tag, Copy, ArrowRight, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export const DealsSection = () => {
    const { data: offers = [] } = useQuery({
        queryKey: ["offers"],
        queryFn: api.getOffers,
    });

    const activeOffers = offers.filter(o => o.isActive);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast({
            title: "Code Copied!",
            description: `${code} copied to clipboard.`,
        });
    };

    if (activeOffers.length === 0) return null;

    return (
        <section className="py-12 bg-primary/5">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                        <Tag className="w-5 h-5" />
                    </div>
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                        Special Offers & Deals
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeOffers.map((offer, index) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="relative group bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row h-full sm:h-48"
                        >
                            {/* Image Side */}
                            <div className="w-full sm:w-2/5 relative overflow-hidden h-40 sm:h-auto">
                                <img
                                    src={offer.image}
                                    alt={offer.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                    {offer.discount}
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="p-5 flex flex-col justify-between w-full sm:w-3/5">
                                <div>
                                    <h3 className="font-bold text-lg leading-tight mb-1">{offer.title}</h3>
                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                                        {offer.description}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {offer.code ? (
                                        <div
                                            onClick={() => copyCode(offer.code!)}
                                            className="flex items-center justify-between bg-secondary/50 border border-dashed border-primary/30 rounded px-3 py-1.5 cursor-pointer hover:bg-secondary transition-colors"
                                        >
                                            <span className="font-mono font-bold text-primary text-sm">{offer.code}</span>
                                            <Copy className="w-3 h-3 text-muted-foreground" />
                                        </div>
                                    ) : (
                                        <div className="text-xs text-muted-foreground italic">No code required</div>
                                    )}

                                    <a
                                        href={offer.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block"
                                    >
                                        <Button size="sm" className="w-full gap-2">
                                            Shop Now <ExternalLink className="w-3 h-3" />
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
