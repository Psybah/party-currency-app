import { useNavigate } from "react-router-dom";
import { useAuthenticated } from "../lib/hooks";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { Button } from "@/components/ui/button";

export default function Templates() {
  const navigate = useNavigate();
  const authenticated = useAuthenticated();

  const currencies = [
    {
      id: 1,
      denomination: "200",
      image: "/lovable-uploads/200-front.jpg",
      title: "Celebration of Life",
    },
    {
      id: 2,
      denomination: "500",
      image: "/lovable-uploads/500-front.jpg",
      title: "Happy Birthday!",
    },
    {
      id: 3,
      denomination: "1000",
      image: "/lovable-uploads/1000-front.jpg",
      title: "Happy Birthday!",
    },
  ];

  const handleCustomize = (denomination) => {
    navigate(`/dashboard/customize?denomination=${denomination}`);
  };

  if (!authenticated) {
    return <LoadingDisplay />;
  }

  return (
    <div className="bg-white min-h-screen">
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold font-playfair mb-2">
            Currency Templates
          </h1>
          <p className="text-gray-600 mb-6">
            Customize and manage your currency templates.
          </p>

          <div className="space-y-6">
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
                          onClick={() => handleCustomize(currency.denomination)}
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
          </div>
        </div>
      </main>
    </div>
  );
}
