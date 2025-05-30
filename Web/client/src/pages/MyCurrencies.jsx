import { useState, useEffect } from "react";
import { useAuthenticated } from "../lib/hooks";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { UserCurrencies } from "@/components/currency/UserCurrencies";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold font-playfair mb-2">
              My Currencies
            </h1>
            <p className="text-gray-600 mb-6">
              View and manage your customized currencies.
            </p>
            <Button className="mb-6" onClick={() => navigate("/templates")}>
              Create Currency for Event
            </Button>
            <UserCurrencies />
          </div>
        </main>
      </div>
    </div>
  );
}
