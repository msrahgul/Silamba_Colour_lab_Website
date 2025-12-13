import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Products = () => {
    const [search, setSearch] = useState("");

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: api.getCategories,
    });

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-border/40 pb-8">
                        <div>
                            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                Our Products
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-xl">
                                Explore our complete range of premium printing services and personalized gifts.
                            </p>
                        </div>

                        <div className="w-full md:w-72 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search categories..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    {isLoading ? (
                        <div className="text-center py-20">Loading...</div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">No categories found matching your search.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                            {filteredCategories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Link
                                        to={`/category/${category.id}`}
                                        className="group block h-full bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                        </div>

                                        <div className="p-5 flex flex-col h-[180px]">
                                            <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                                                {category.description}
                                            </p>

                                            <div className="flex items-center text-sm font-semibold text-primary mt-auto">
                                                <span>Browse Collection</span>
                                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Products;
