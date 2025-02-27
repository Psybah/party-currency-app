import { Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminHeader({ toggleMobileMenu }) {

  return (
    <header className="h-20 border-b flex items-center justify-between px-4 md:px-6 bg-white">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden text-bluePrimary hover:text-blueSecondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bluePrimary"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Admin</span>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatar.png" alt="Admin" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
