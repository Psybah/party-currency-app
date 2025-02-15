import React, { useState } from "react";
import { MerchantSidebar } from "@/components/merchant/MerchantSidebar";
import MerchantHeader from "@/components/merchant/MerchantHeader";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const [isAccountDisabled, setIsAccountDisabled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <MerchantSidebar 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="md:pl-64 flex flex-col min-h-screen">
        <MerchantHeader 
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* Location Address */}
              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="text-lg font-medium">Location Address</h3>
                </div>
                <Button variant="ghost" size="icon" className="text-blueSecondary hover:text-bluePrimary">
                  <Pencil className="w-5 h-5" />
                </Button>
              </div>

              {/* Disable Account */}
              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="text-lg font-medium">Disable Merchant Account</h3>
                </div>
                <Switch
                  checked={isAccountDisabled}
                  onCheckedChange={setIsAccountDisabled}
                />
              </div>

              {/* Phone Number */}
              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="text-lg font-medium">Phone Number</h3>
                </div>
                <Button variant="ghost" size="icon" className="text-blueSecondary hover:text-bluePrimary">
                  <Pencil className="w-5 h-5" />
                </Button>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="text-lg font-medium">Password</h3>
                </div>
                <Button variant="ghost" size="icon" className="text-blueSecondary hover:text-bluePrimary">
                  <Pencil className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
