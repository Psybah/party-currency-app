import React, { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { useAuthenticated } from "../lib/hooks";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { Button } from "@/components/ui/button";
import { CurrencyEditor } from "@/components/CurrencyEditor";

export default function Templates() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const authenticated = useAuthenticated();

  const currencies = [
    {
      id: 1,
      denomination: "200",
      image: "/lovable-uploads/aa99ff96-d8a0-496f-b5b4-2fbbdfd720ec.png",
      title: "Celebration of Life"
    },
    {
      id: 2,
      denomination: "500",
      image: "/lovable-uploads/33b3f1c6-258f-4915-9ff1-a9557ca6a301.png",
      title: "Happy Birthday!"
    },
    {
      id: 3,
      denomination: "1000",
      image: "/lovable-uploads/00bd2752-0223-42cb-a371-bcd314faa8e9.png",
      title: "Happy Birthday!"
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!authenticated) {
    return <LoadingDisplay />;
  }

  return (
    <div className="bg-white min-h-screen">
      <DashboardSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="md:pl-64">
        <DashboardHeader toggleMobileMenu={toggleMobileMenu} />

        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-2">Currency Template</h1>
            <p className="text-gray-600 mb-6">Select a currency template to preview and personalize.</p>
            
            <div className="flex flex-col gap-6">
              {currencies.map((currency) => (
                <div
                  key={currency.id}
                  className="relative group bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={currency.image}
                      alt={`${currency.denomination} denomination`}
                      className="w-full h-auto"
                    />
                    {currency.denomination === "200" && (
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 right-4">
                          <Button
                            onClick={() => setShowEditor(true)}
                            className="bg-bluePrimary hover:bg-bluePrimary/90 text-white font-medium"
                          >
                            Customize
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {showEditor && (
        <CurrencyEditor
          currencyImage="/lovable-uploads/aa99ff96-d8a0-496f-b5b4-2fbbdfd720ec.png"
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}