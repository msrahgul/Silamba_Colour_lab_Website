import { motion } from "framer-motion";
import { Camera, Award, Users, Clock, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const stats = [
  { icon: Camera, value: "15+", label: "Years Experience" },
  { icon: Award, value: "50K+", label: "Happy Customers" },
  { icon: Users, value: "100+", label: "Products" },
  { icon: Clock, value: "24/7", label: "Support" },
];

const services = [
  "Wedding Photography",
  "Portrait Sessions",
  "Family Photoshoots",
  "Custom Photo Albums",
  "High-Quality Printing",
  "Passport Photos",
  "Canvas Prints",
  "Personalized Gifts",
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Banner */}
        <section className="relative h-64 lg:h-80">
          <img
            src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1600&q=80"
            alt="About Silamba Colour Lab"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-primary font-medium text-sm uppercase tracking-wider mb-2 block">
                  Our Story
                </span>
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-background">
                  About Us
                </h1>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-card">
                  <img
                    src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80"
                    alt="Our Studio"
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                  />
                </div>
                
                {/* Floating Card */}
                <div className="absolute -bottom-6 -right-6 lg:bottom-8 lg:-right-8 bg-card p-6 rounded-xl shadow-card-hover max-w-[200px]">
                  <div className="text-4xl font-display font-bold text-primary mb-1">15+</div>
                  <div className="text-sm text-muted-foreground">Years of trusted service</div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Crafting Memories Since 2010
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                  <p>
                    Established in <strong className="text-foreground">Dindigul</strong>, Silamba Colour Lab & Studio has been 
                    a trusted name for professional photography, digital printing, and 
                    photo lab services for over a decade. Our commitment to quality and 
                    customer satisfaction has helped us become a leading destination for 
                    families, students, and businesses across Tamil Nadu.
                  </p>
                  <p>
                    We specialize in wedding photography, portrait sessions, family 
                    photoshoots, and custom photo albums. Our photo lab provides 
                    high-quality printing, enlargements, passport photos, and 
                    personalized gifts — all crafted with the latest technology and 
                    premium materials.
                  </p>
                  <p>
                    Whether it's capturing once-in-a-lifetime memories or delivering 
                    fast, affordable prints, we ensure every project meets the highest 
                    professional standards.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center p-6 bg-card rounded-xl shadow-card text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <stat.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="font-display text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider mb-2 block">
                What We Offer
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Our Services
              </h2>
              <p className="text-muted-foreground">
                From professional photography to premium printing, we offer a complete range 
                of services to preserve your precious memories.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex items-center gap-3 p-4 bg-card rounded-xl shadow-card"
                >
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium text-foreground">{service}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6">
                  Our Mission
                </h2>
                <p className="text-lg leading-relaxed opacity-90">
                  To deliver exceptional quality and service in every photograph we capture 
                  and every product we create. We believe that every moment deserves to be 
                  preserved beautifully, and we're committed to making that happen for 
                  every customer who walks through our doors.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
