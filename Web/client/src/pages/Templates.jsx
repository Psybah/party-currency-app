import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { useAuthenticated } from "../lib/hooks";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { Button } from "@/components/ui/button";
import { CurrencyEditor } from "@/components/CurrencyEditor";
import CurrencyBreakdown from "@/components/CurrencyBreakdown";
import { TemplateHistory } from "@/components/currency/TemplateHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Templates() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isCustomized, setIsCustomized] = useState(false);
  const navigate = useNavigate();
  const authenticated = useAuthenticated();

  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setSidebarCollapsed(event.detail.isCollapsed);
    };

    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  const currencies = [
    {
      id: 1,
      denomination: "200",
      image: "/lovable-uploads/200-front.jpg",
      title: "Celebration of Life",
      path: "/customize-200"
    },
    {
      id: 2,
      denomination: "500",
      image: "/lovable-uploads/500-front.jpg",
      title: "Happy Birthday!",
      path: "/customize-500"
    },
    {
      id: 3,
      denomination: "1000",
      image: "/lovable-uploads/1000-front.jpg",
      title: "Happy Birthday!",
      path: "/customize-1000"
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
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
      }`}>
        <DashboardHeader toggleMobileMenu={toggleMobileMenu} />

        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold font-playfair mb-2">Currency Templates</h1>
            <p className="text-gray-600 mb-6">
              Customize and manage your currency templates.
            </p>

            <Tabs defaultValue="available" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="available">Available Templates</TabsTrigger>
                <TabsTrigger value="saved">Saved Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="space-y-6">
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
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 right-4">
                            <Button
                              onClick={() => {
                                setIsCustomized(true);
                                navigate(currency.path);
                              }}
                              className="bg-bluePrimary hover:bg-bluePrimary/90 text-white font-medium"
                            >
                              Customize
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <CurrencyBreakdown isEnabled={isCustomized} />
                </div>
              </TabsContent>

              <TabsContent value="saved">
                <div className="bg-white rounded-lg">
                  <TemplateHistory />
                </div>
              </TabsContent>
            </Tabs>
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
