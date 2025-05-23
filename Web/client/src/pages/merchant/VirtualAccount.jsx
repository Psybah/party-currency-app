import { useState, useEffect } from "react";
import { MerchantSidebar } from "@/components/merchant/MerchantSidebar";
import MerchantHeader from "@/components/merchant/MerchantHeader";
import { Eye, Trash2, Search, Plus, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PiggyBank, Calendar, MapPin, CalendarClock, Activity } from "lucide-react";
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
import { getEventById } from "@/api/eventApi";

export default function VirtualAccount() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [accountReference, setAccountReference] = useState("");
  const [eventDetails, setEventDetails] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccountDetails = async () => {
    try {
      setLoading(true);
      const accountData = await getVirtualAccount();
      if (accountData) {
        setAccountReference(accountData.account_reference);
        // Fetch event details using account reference
        if (accountData.account_reference) {
          const eventData = await getEventById(accountData.account_reference);
          setEventDetails(eventData);
        }
      }
      return accountData.account_reference;
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setSidebarCollapsed(event.detail.isCollapsed);
    };

    window.addEventListener("sidebarStateChange", handleSidebarStateChange);
    
    fetchAccountDetails()
    .then(account_reference => {
      fetchTransactions(account_reference);
    });

    return () => {
      window.removeEventListener("sidebarStateChange", handleSidebarStateChange);
    };
  }, []);

  const handleAccountCreated = async (newAccount) => {
    await fetchAccountDetails();
    setIsCreateModalOpen(false);
    toast.success("Account created successfully");
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteVirtualAccount(accountReference);
      setAccountReference("");
      setEventDetails(null);  
      setIsDeleteModalOpen(false);
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete account");
    }
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
    if (accountReference) {
      setSelectedAccount({ account_reference: accountReference });
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
          </div>

          {loading ? (
            <div className="space-y-4">
              <TableRowSkeleton />
              <TableRowSkeleton />
            </div>
          ) : accountReference ? (
            <div className="relative bg-white shadow rounded-lg overflow-hidden p-6">
              <Button
                className="top-4 right-4 absolute bg-red-600"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete
              </Button>
              <div className="space-y-6">
                <div className="flex justify-center items-center gap-5">
                  <PiggyBank className="w-8 h-8 text-gray-400" />
                  <span className="text-lg font-medium">Account Reference: {accountReference}</span>
                </div>
                
                {eventDetails && (
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Event Name</p>
                        <p className="font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {eventDetails.event_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {eventDetails.street_address}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Event Period</p>
                        <div className="space-y-1">
                          <div>
                            <span className="text-xs text-gray-400">Start:</span>
                            <p className="font-medium flex items-center gap-2">
                              <CalendarClock className="w-4 h-4 text-gray-400" />
                              {formatDate(eventDetails.start_date)}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400">End:</span>
                            <p className="font-medium flex items-center gap-2">
                              <CalendarClock className="w-4 h-4 text-gray-400" />
                              {formatDate(eventDetails.end_date)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium flex items-center gap-2">
                          <Activity className="w-4 h-4 text-gray-400" />
                          {eventDetails.delivery_status}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
