import { useState, useEffect } from "react";
import { MerchantSidebar } from "@/components/merchant/MerchantSidebar";
import MerchantHeader from "@/components/merchant/MerchantHeader";
import { Eye, Trash2, Search, Plus, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function VirtualAccount() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [accounts, setAccounts] = useState([]);
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

    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    fetchAccounts();
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { accessToken } = getAuth();
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${BASE_URL}/merchant/transactions`, {
        headers: {
          'Authorization': `Token ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok || data.error === 'account_reference is required') {
        throw new Error('No virtual accounts found. Create one to get started.');
      }

      if (data.accounts) {
        setAccounts(data.accounts);
      } else if (Array.isArray(data)) {
        setAccounts(data);
      } else {
        setAccounts([]);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError(error.message);
      toast.error(error.message || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  // Filter accounts based on search query
  const filteredAccounts = accounts.filter(account =>
    account.event_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.account_reference?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAccount = () => {
    setIsCreateModalOpen(true);
  };

  const handleAccountCreated = (newAccount) => {
    setAccounts(prev => [...prev, newAccount]);
    setIsCreateModalOpen(false);
    toast.success('Account created successfully');
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy, hh:mm a');
    } catch {
      return 'Invalid Date';
    }
  };

  const handleView = (account) => {
    setSelectedAccount(account);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (account) => {
    try {
      const { accessToken } = getAuth();
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${BASE_URL}/merchant/delete-reserved-account?account_reference=${account.account_reference}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || data.error || 'Failed to delete account');
      }

      setAccounts(prev => prev.filter(acc => acc.account_reference !== account.account_reference));
      toast.success('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(error.message || 'Failed to delete account');
    }
  };

  const handleViewNewAccount = () => {
    const latestAccount = accounts[accounts.length - 1];
    if (latestAccount) {
      setSelectedAccount(latestAccount);
      setIsDetailsModalOpen(true);
    }
  };

  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </TableCell>
    </TableRow>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gray-100 rounded-full">
          <CreditCard className="w-8 h-8 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No virtual accounts</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-6">
        {searchQuery 
          ? "No accounts match your search criteria. Try adjusting your search."
          : "You haven't created any virtual accounts yet. Create one to start accepting payments."}
      </p>
      <Button
        onClick={handleCreateAccount}
        className="bg-gold hover:bg-gold/90 text-white"
      >
        <Plus className="w-5 h-5 mr-2" />
        Create Account
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <MerchantSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        <MerchantHeader
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold font-playfair">Virtual Account</h1>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by Event ID or Account Reference"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-[300px]"
                />
              </div>
              <Button
                onClick={handleCreateAccount}
                className="bg-gold hover:bg-gold/90 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Account
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Date created</TableHead>
                    <TableHead className="text-left">Event ID</TableHead>
                    <TableHead className="text-left">Account Reference</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </TableBody>
              </Table>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <Button
                  onClick={fetchAccounts}
                  className="mt-4 bg-bluePrimary hover:bg-bluePrimary/90 text-white"
                >
                  Retry
                </Button>
              </div>
            ) : filteredAccounts.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">Date created</TableHead>
                      <TableHead className="text-left">Event ID</TableHead>
                      <TableHead className="text-left">Account Reference</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <TableRow key={account.account_reference} className="hover:bg-gray-50">
                        <TableCell className="text-left">
                          {formatDate(account.created_at)}
                        </TableCell>
                        <TableCell className="text-left">
                          {account.event_id}
                        </TableCell>
                        <TableCell className="text-left">
                          {account.account_reference}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleView(account)}
                              className="p-2 text-gold hover:text-gold/80 transition-colors"
                              aria-label="View account"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(account)}
                              className="p-2 text-red-600 hover:text-red-700 transition-colors"
                              aria-label="Delete account"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
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
          setAccountToDelete(null);
        }}
        onConfirm={() => handleDelete(accountToDelete)}
      />
    </div>
  );
} 