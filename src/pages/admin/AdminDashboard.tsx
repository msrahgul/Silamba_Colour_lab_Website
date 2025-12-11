import { Image, Grid3X3, Layers, Gift, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { defaultBanner } from "@/data/mockData";

const AdminDashboard = () => {
  const { data: banner = defaultBanner } = useQuery({ queryKey: ["banner"], queryFn: api.getBanner });
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: api.getCategories });
  const { data: subCategories = [] } = useQuery({ queryKey: ["subcategories"], queryFn: api.getSubCategories });
  const { data: occasions = [] } = useQuery({ queryKey: ["occasions"], queryFn: api.getOccasions });

  const stats = [
    {
      title: "Active Banner",
      value: banner.isActive ? "1" : "0",
      icon: Image,
      link: "/admin/banners",
      color: "bg-blue-500",
    },
    {
      title: "Categories",
      value: categories.length.toString(),
      icon: Grid3X3,
      link: "/admin/categories",
      color: "bg-green-500",
    },
    {
      title: "Sub-Categories",
      value: subCategories.length.toString(),
      icon: Layers,
      link: "/admin/subcategories",
      color: "bg-orange-500",
    },
    {
      title: "Occasions",
      value: occasions.length.toString(),
      icon: Gift,
      link: "/admin/occasions",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Welcome to Admin Dashboard
        </h2>
        <p className="text-muted-foreground">
          Manage your website content, update banners, categories, and more.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-card rounded-xl p-6 shadow-card hover-lift"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <Eye className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-display font-bold text-foreground mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/banners"
            className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            <Image className="w-5 h-5 text-primary" />
            <span className="font-medium">Update Offer Banner</span>
          </Link>
          <Link
            to="/admin/categories"
            className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            <Grid3X3 className="w-5 h-5 text-primary" />
            <span className="font-medium">Manage Categories</span>
          </Link>
          <Link
            to="/admin/subcategories"
            className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            <Layers className="w-5 h-5 text-primary" />
            <span className="font-medium">Manage Products</span>
          </Link>
          <Link
            to="/admin/occasions"
            className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-medium">Update Occasions</span>
          </Link>
        </div>
      </div>

      {/* Recent Updates Placeholder */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          How to Use
        </h3>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm shrink-0">
              1
            </span>
            <span>Use the <strong>Banners</strong> section to update the pop-up offer that appears to visitors.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm shrink-0">
              2
            </span>
            <span>Add or edit <strong>Categories</strong> to organize your products into main groups.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm shrink-0">
              3
            </span>
            <span>Create <strong>Sub-Categories</strong> with external redirect URLs to your online store.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm shrink-0">
              4
            </span>
            <span>Update <strong>Occasions</strong> to highlight seasonal gift ideas.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
