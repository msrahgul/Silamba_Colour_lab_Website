import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100">
      
      {/* Hero Section */}
      <div className="relative h-[300px] bg-gray-900 overflow-hidden flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-white opacity-90 max-w-lg mx-auto">
            We’d love to hear from you! Whether you have questions, feedback, or
            need assistance — our team is here to help.
          </p>
        </div>
      </div>

      {/* Contact Info and Map */}
      <div className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          
          {/* Contact Info */}
          <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-xl p-12 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-3xl font-semibold text-gray-900 mb-10 tracking-tight">
              Contact Information
            </h2>
            <div className="space-y-10">
              {[
                {
                  icon: <MapPin className="text-gray-900" size={28} />,
                  title: "Our Location",
                  text: (
                    <>
                      7, Thiruvalluvar Salai,<br /> Opp Bus Stand, Dindigul-624001
                    </>
                  ),
                },
                {
                  icon: <Phone className="text-gray-900" size={28} />,
                  title: "Phone",
                  text: (
                    <a
                      href="tel:+919790497138"
                      className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    >
                      +91 97904 97138
                    </a>
                  ),
                },
                {
                  icon: <Mail className="text-gray-900" size={28} />,
                  title: "Email",
                  text: (
                    <a
                      href="mailto:silambacolourlab@gmail.com"
                      className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    >
                      silambacolourlab@gmail.com
                    </a>
                  ),
                },
                {
                  icon: <Clock className="text-gray-900" size={28} />,
                  title: "Business Hours",
                  text: "Mon - Sun: 10:00 AM - 8:00 PM",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-6 group">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 shadow-md transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Map */}
          <div className="rounded-3xl shadow-xl overflow-hidden border-4 border-white hover:scale-[1.03] transition-transform duration-300">
            <iframe
              title="Silamba Colour Lab Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.066767914414!2d77.978579!3d10.3607929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00aa5993fa51b7%3A0xe33edda48d174a9d!2sSilamba%20Colour%20Lab!5e0!3m2!1sen!2sin!4v1675060200000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "24rem" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Contact;
