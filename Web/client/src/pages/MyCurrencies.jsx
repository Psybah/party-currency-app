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
        <main className="p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold font-playfair mb-1 sm:mb-2 text-left">
                  My Currencies
                </h1>
                <p className="text-sm sm:text-base text-gray-600 text-left">
                  View and manage your customized currencies.
                </p>
              </div>
              <div className="flex-shrink-0 w-full sm:w-auto">
                <Button
                  className="bg-bluePrimary text-white hover:bg-bluePrimary/90 px-4 sm:px-6 py-2 sm:py-2.5 h-auto w-full sm:w-auto text-sm sm:text-base"
                  onClick={() => navigate("/templates")}
                >
                  <PlusCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  <span className="sm:hidden">Create Currency</span>
                  <span className="hidden sm:inline">Create Currency for Event</span>
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
