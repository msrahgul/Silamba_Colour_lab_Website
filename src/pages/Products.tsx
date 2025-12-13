import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";

const Products = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-grow pt-20">
                <div className="container mx-auto px-4 lg:px-8 py-8">
                    <CategoriesGrid />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Products;
