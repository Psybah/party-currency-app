import { useAuthenticated } from "../lib/hooks";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { UserCurrencies } from "@/components/currency/UserCurrencies";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

export default function MyCurrencies() {
  const authenticated = useAuthenticated();
  const navigate = useNavigate();

  if (!authenticated) {
    return <LoadingDisplay />;
  }

  return (
    <div className="bg-white min-h-screen">
      <div>
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-semibold font-playfair mb-2 text-left">
                  My Currencies
                </h1>
                <p className="text-gray-600 text-left">
                  View and manage your customized currencies.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button
                  className="bg-bluePrimary text-white hover:bg-bluePrimary/90 px-6 py-2.5 h-auto"
                  onClick={() => navigate("/templates")}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Currency for Event
                </Button>
              </div>
            </div>
            
            <UserCurrencies />
          </div>
        </main>
      </div>
    </div>
  );
}
