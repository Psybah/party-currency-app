import { useState, useEffect } from "react";
import { MerchantSidebar } from "@/components/merchant/MerchantSidebar";
import MerchantHeader from "@/components/merchant/MerchantHeader";
import { Eye, Trash2, Search, Plus, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PiggyBank } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AccountDetailsModal } from "@/components/merchant/AccountDetailsModal";
import { DeleteConfirmationModal } from "@/components/merchant/DeleteConfirmationModal";
import { CreateAccountModal } from "@/components/merchant/CreateAccountModal";
import { format } from "date-fns";
import { BASE_URL } from "@/config";
import { getAuth } from "@/lib/util";
import { toast } from "sonner";
import {
  getVirtualAccount,
  deleteVirtualAccount,
  fetchTransactions,
} from "@/api/merchantApi";
export default function VirtualAccount() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [account, setAccount] = useState({ account_reference: "" });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setSidebarCollapsed(event.detail.isCollapsed);
    };

    window.addEventListener("sidebarStateChange", handleSidebarStateChange);
    getVirtualAccount()
      .then((account) => {
        if (account) {
          setAccount(account);
        }
      })
      .catch((error) => {
        console.error("Error fetching virtual account:", error);
        toast.error(error.message || "Failed to fetch virtual account");
      });

    fetchTransactions();
    return () => {
      window.removeEventListener(
        "sidebarStateChange",
        handleSidebarStateChange
      );
    };
  }, []);

  const handleAccountCreated = (newAccount) => {
    setAccount((prev) => [...prev, newAccount]);
    setIsCreateModalOpen(false);
    toast.success("Account created successfully");
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy, hh:mm a");
    } catch {
      return "Invalid Date";
    }
  };

  const handleView = (account) => {
    setSelectedAccount(account);
    setIsDetailsModalOpen(true);
  };

  const handleViewNewAccount = () => {
    const latestAccount = account[account.length - 1];
    if (latestAccount) {
      setSelectedAccount(latestAccount);
      setIsDetailsModalOpen(true);
    }
  };

  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="w-[120px] h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-[100px] h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-[100px] h-4" />
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Skeleton className="rounded-full w-8 h-8" />
          <Skeleton className="rounded-full w-8 h-8" />
        </div>
      </TableCell>
    </TableRow>
  );

  const EmptyState = () => (
    <div className="py-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 p-3 rounded-full">
          <CreditCard className="w-8 h-8 text-gray-400" />
        </div>
      </div>
      <h3 className="mb-2 font-medium text-gray-900 text-lg">
        No virtual accounts
      </h3>
      <p className="mx-auto mb-6 max-w-sm text-gray-500">
        {searchQuery
          ? "No accounts match your search criteria. Try adjusting your search."
          : "You haven't created any virtual accounts yet. Create one to start accepting payments."}
      </p>
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-gold hover:bg-gold/90 text-white"
      >
        <Plus className="mr-2 w-5 h-5" />
        Create Account
      </Button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <MerchantSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <MerchantHeader
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="space-y-6 p-4 md:p-6">
          <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="font-playfair font-semibold text-2xl">
              Virtual Account
            </h1>

            {/* <div className="flex sm:flex-row flex-col gap-4 w-full md:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
                <Input
                  type="text"
                  placeholder="Search by Event ID or Account Reference"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="py-2 pr-4 pl-10 w-full md:w-[300px]"
                />
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gold hover:bg-gold/90 text-white"
              >
                <Plus className="mr-2 w-5 h-5" />
                Create Account
              </Button>
            </div> */}
          </div>

          {account.account_reference ? (
            <div className="relative bg-white shadow rounded-lg overflow-hidden">
              <Button
                className="top-4 right-4 absolute bg-red-600"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete
              </Button>
              <div className="flex justify-center items-center gap-5 m-4 overflow-x-auto">
                <PiggyBank className="mb-4 w-8 h-8 text-gray-400" />{" "}
                <span> Account Reference {account.account_reference}</span>
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>

      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleAccountCreated}
        onViewDetails={handleViewNewAccount}
      />

      <AccountDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        account={selectedAccount}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        onConfirm={() => deleteVirtualAccount(account)}
      />
    </div>
  );
}
