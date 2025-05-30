import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  AlertCircle,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  UserCircle,
  Eye,
  ExternalLink,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import adminApi from "@/api/adminApi";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Utility functions
const formatCurrency = (amount, currencyCode = "NGN") => {
  if (!amount || amount === "0" || amount === 0) return "₦0";
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return `₦${numAmount.toLocaleString()}`;
};

const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase();
  switch (statusLower) {
    case "completed":
    case "success":
    case "successful":
      return "bg-green-100 text-green-800";
    case "pending":
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
    case "cancelled":
    case "canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Main Component
export default function TransactionManagement() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const itemsPerPage = 20;

  // State for user info dialog
  const [userInfoDialog, setUserInfoDialog] = useState({
    open: false,
    loading: false,
    user: null,
    error: null,
  });

  // Status filter options
  const statusFilterOptions = [
    { value: "all", label: "All Statuses" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "amount-high", label: "Amount (High to Low)" },
    { value: "amount-low", label: "Amount (Low to High)" },
    { value: "customer-az", label: "Customer (A-Z)" },
    { value: "customer-za", label: "Customer (Z-A)" },
  ];

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setSidebarCollapsed(event.detail.isCollapsed);
    };

    window.addEventListener("sidebarStateChange", handleSidebarStateChange);
    return () =>
      window.removeEventListener(
        "sidebarStateChange",
        handleSidebarStateChange
      );
  }, []);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getAllTransactions();
      setTransactions(response.transactions || []);
    } catch (err) {
      setError(err.message || "Failed to fetch transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter and sort transactions
  useEffect(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.customer_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.customer_email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.payment_reference
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.event_id
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.payment_description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (transaction) =>
          transaction.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case "oldest":
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        case "amount-high":
          return parseFloat(b.amount || 0) - parseFloat(a.amount || 0);
        case "amount-low":
          return parseFloat(a.amount || 0) - parseFloat(b.amount || 0);
        case "customer-az":
          return (a.customer_name || "").localeCompare(b.customer_name || "");
        case "customer-za":
          return (b.customer_name || "").localeCompare(a.customer_name || "");
        default:
          return 0;
      }
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [transactions, searchTerm, statusFilter, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Handle user info dialog
  const handleViewUserInfo = async (userEmail) => {
    setUserInfoDialog({
      open: true,
      loading: true,
      user: null,
      error: null,
    });

    try {
      const response = await adminApi.getUserByEmail(userEmail);
      setUserInfoDialog({
        open: true,
        loading: false,
        user: response.user,
        error: null,
      });
    } catch (error) {
      setUserInfoDialog({
        open: true,
        loading: false,
        user: null,
        error: error.message || "Failed to fetch user information",
      });
    }
  };

  const closeUserInfoDialog = () => {
    setUserInfoDialog({
      open: false,
      loading: false,
      user: null,
      error: null,
    });
  };

  // Handle navigation to event detail
  const handleViewEvent = (eventId) => {
    navigate(`/admin/events/${eventId}`);
  };

  // Handle transaction row click
  const handleTransactionClick = (eventId) => {
    handleViewEvent(eventId);
  };

  // Transactions Mobile Card Component
  const TransactionMobileCard = ({ transaction }) => (
    <Card
      className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-gray-50 border-l-4 border-l-blue-500"
      onClick={() => handleTransactionClick(transaction.event_id)}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {transaction.customer_name || "Unknown Customer"}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {transaction.customer_email}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-gray-900">
              {formatCurrency(transaction.amount, transaction.currency_code)}
            </p>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                getStatusColor(transaction.status)
              )}
            >
              {transaction.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Reference:</span>
            <p className="font-medium truncate">
              {transaction.payment_reference}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Currency:</span>
            <p className="font-medium">{transaction.currency_code}</p>
          </div>
        </div>

        <div className="text-sm">
          <span className="text-gray-500">Description:</span>
          <p className="font-medium text-gray-900 truncate">
            {transaction.payment_description || "No description"}
          </p>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleViewUserInfo(transaction.customer_email);
              }}
              variant="outline"
              size="sm"
              className="text-xs h-8"
            >
              <User className="w-3 h-3 mr-1" />
              User Info
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleViewEvent(transaction.event_id);
              }}
              variant="outline"
              size="sm"
              className="text-xs h-8"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View Event
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            Event ID: {transaction.event_id}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <AdminHeader toggleMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-2xl font-semibold font-playfair">
              Transaction Management
            </h1>
            <div className="text-sm text-gray-500">
              {filteredTransactions.length} of {transactions.length}{" "}
              transactions
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search by customer, email, reference, event ID, or description..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFilterOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Transactions List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">
                Loading transactions...
              </span>
            </div>
          ) : error ? (
            <Card className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Loading Transactions
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchTransactions} variant="outline">
                Try Again
              </Button>
            </Card>
          ) : filteredTransactions.length === 0 ? (
            <Card className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Transactions Found
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "No transactions match your current filters."
                  : "No transactions have been recorded yet."}
              </p>
            </Card>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-lg shadow overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left pl-6">Customer</TableHead>
                      <TableHead className="text-left">Amount</TableHead>
                      <TableHead className="text-left">Status</TableHead>
                      <TableHead className="text-left">Reference</TableHead>
                      <TableHead className="text-left">Currency</TableHead>
                      <TableHead className="text-left">Event ID</TableHead>
                      <TableHead className="text-left">Description</TableHead>
                      <TableHead className="w-[120px] text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.map((transaction, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() =>
                          handleTransactionClick(transaction.event_id)
                        }
                      >
                        <TableCell className="text-left pl-6">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {transaction.customer_name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {transaction.customer_email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-left">
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(
                              transaction.amount,
                              transaction.currency_code
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-left">
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              getStatusColor(transaction.status)
                            )}
                          >
                            {transaction.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-left">
                          <span className="font-mono text-sm">
                            {transaction.payment_reference}
                          </span>
                        </TableCell>
                        <TableCell className="text-left">
                          <span className="font-medium">
                            {transaction.currency_code}
                          </span>
                        </TableCell>
                        <TableCell className="text-left">
                          <span className="font-mono text-sm text-gray-600">
                            {transaction.event_id}
                          </span>
                        </TableCell>
                        <TableCell className="text-left">
                          <span className="text-sm text-gray-600 truncate block max-w-xs">
                            {transaction.payment_description ||
                              "No description"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewUserInfo(transaction.customer_email);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="View User Info"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewEvent(transaction.event_id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="View Event"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {currentTransactions.map((transaction, index) => (
                  <TransactionMobileCard
                    key={index}
                    transaction={transaction}
                  />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredTransactions.length)} of{" "}
                  {filteredTransactions.length} transactions
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === currentPage ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </main>
      </div>

      {/* User Info Dialog */}
      <Dialog open={userInfoDialog.open} onOpenChange={closeUserInfoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCircle className="w-5 h-5" />
              User Information
            </DialogTitle>
            <DialogDescription>
              Contact details for the customer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {userInfoDialog.loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading user data...</span>
              </div>
            ) : userInfoDialog.error ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium">Error</p>
                <p className="text-gray-600 text-sm">{userInfoDialog.error}</p>
              </div>
            ) : userInfoDialog.user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-900">
                      {userInfoDialog.user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Full Name
                    </p>
                    <p className="text-sm text-gray-900">
                      {userInfoDialog.user.first_name}{" "}
                      {userInfoDialog.user.last_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Phone Number
                    </p>
                    <p className="text-sm text-gray-900">
                      {userInfoDialog.user.phone_number || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <UserCircle className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      User Type
                    </p>
                    <p className="text-sm text-gray-900 capitalize">
                      {userInfoDialog.user.type || "Standard"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        window.open(`mailto:${userInfoDialog.user.email}`)
                      }
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Send Email
                    </Button>
                    {userInfoDialog.user.phone_number && (
                      <Button
                        onClick={() =>
                          window.open(`tel:${userInfoDialog.user.phone_number}`)
                        }
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
