import { useState, useEffect } from "react";
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
  SlidersHorizontal,
  AlertCircle,
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
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Utility functions
const formatCurrency = (amount) => {
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
    { value: "successful", label: "Successful" },
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

  // Transactions Mobile Card Component - updated to match Dashboard.jsx structure
  const TransactionMobileCard = ({ transaction }) => (
    <Card
      className="p-3 sm:p-4 hover:shadow-md transition-all bg-white duration-200 cursor-pointer hover:bg-gray-50"
      onClick={() => handleTransactionClick(transaction.event_id)}
    >
      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0 text-left">
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate text-left">
              {transaction.customer_name || "Unknown Customer"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate text-left">
              {transaction.customer_email}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-sm sm:text-lg text-gray-900">
              {formatCurrency(transaction.amount)}
            </p>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium inline-block mt-1",
                getStatusColor(transaction.status)
              )}
            >
              {transaction.status}
            </span>
          </div>
        </div>

        <div className="space-y-1 text-xs sm:text-sm text-left">
          <div className="text-left">
            <span className="text-gray-500">Reference: </span>
            <span className="font-medium">{transaction.payment_reference}</span>
          </div>
          <div className="text-left">
            <span className="text-gray-500">Currency: </span>
            <span className="font-medium">{transaction.currency_code}</span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-left">
          <span className="text-gray-500">Description: </span>
          <span className="font-medium text-gray-900">
            {transaction.payment_description || "No description"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t gap-2">
          <div className="flex gap-1 sm:gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleViewUserInfo(transaction.customer_email);
              }}
              variant="outline"
              size="sm"
              className="text-xs h-7 sm:h-8 px-2"
            >
              <User className="w-3 h-3 mr-1" />
              User
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleViewEvent(transaction.event_id);
              }}
              variant="outline"
              size="sm"
              className="text-xs h-7 sm:h-8 px-2"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Event
            </Button>
          </div>
          <div className="text-xs text-gray-500 flex-shrink-0">
            ID: {transaction.event_id}
          </div>
        </div>
      </div>
    </Card>
  );

  TransactionMobileCard.propTypes = {
    transaction: PropTypes.object.isRequired,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold font-playfair text-gray-900">
            Transaction Management
          </h1>
          {filteredTransactions.length > 0 && (
            <div className="bg-bluePrimary/10 px-3 py-1.5 rounded-lg border border-bluePrimary/20">
              <span className="text-sm font-medium text-bluePrimary">
                {filteredTransactions.length} total transactions
              </span>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <Card className="p-3 sm:p-4 border-bluePrimary/20 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                <Input
                  type="text"
                  placeholder="Search by customer, email, reference, event ID, or description..."
                  className="pl-8 sm:pl-10 h-8 sm:h-auto text-sm sm:text-base border-gray-200 focus:border-bluePrimary focus:ring-bluePrimary/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 h-8 sm:h-auto text-sm sm:text-base">
                  <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusFilterOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-sm"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 h-8 sm:h-auto text-sm sm:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-sm"
                    >
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
          <div className="flex justify-center items-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-bluePrimary"></div>
            <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600">
              Loading transactions...
            </span>
          </div>
        ) : error ? (
          <Card className="p-6 sm:p-8 text-center border-red-200 bg-red-50">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              Error Loading Transactions
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              {error}
            </p>
            <Button
              onClick={fetchTransactions}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Try Again
            </Button>
          </Card>
        ) : filteredTransactions.length === 0 ? (
          <Card className="p-6 bg-white sm:p-8 text-center border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4 flex items-center justify-center font-bold text-2xl sm:text-3xl">
              ₦
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              No Transactions Found
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "No transactions match your current filters."
                : "No transactions have been recorded yet."}
            </p>
          </Card>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left pl-4 sm:pl-6 text-xs sm:text-sm font-medium min-w-[200px]">
                        Customer
                      </TableHead>
                      <TableHead className="text-left px-2 sm:px-4 text-xs sm:text-sm font-medium min-w-[120px]">
                        Amount
                      </TableHead>
                      <TableHead className="text-left px-2 sm:px-4 text-xs sm:text-sm font-medium min-w-[100px]">
                        Status
                      </TableHead>
                      <TableHead className="text-left px-2 sm:px-4 text-xs sm:text-sm font-medium min-w-[160px]">
                        Reference
                      </TableHead>
                      <TableHead className="text-left px-2 sm:px-4 text-xs sm:text-sm font-medium min-w-[80px]">
                        Currency
                      </TableHead>
                      <TableHead className="text-left px-2 sm:px-4 text-xs sm:text-sm font-medium min-w-[120px]">
                        Event ID
                      </TableHead>
                      <TableHead className="text-left px-2 sm:px-4 text-xs sm:text-sm font-medium min-w-[180px]">
                        Description
                      </TableHead>
                      <TableHead className="w-[100px] sm:w-[120px] text-center text-xs sm:text-sm font-medium">
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
                        <TableCell className="text-left pl-4 sm:pl-6 py-2 sm:py-4">
                          <div className="min-w-0">
                            <p
                              className="font-medium text-sm sm:text-base text-gray-900 truncate max-w-[180px]"
                              title={transaction.customer_name}
                            >
                              {transaction.customer_name || "Unknown"}
                            </p>
                            <p
                              className="text-xs sm:text-sm text-gray-500 truncate max-w-[180px]"
                              title={transaction.customer_email}
                            >
                              {transaction.customer_email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-left px-2 sm:px-4 py-2 sm:py-4">
                          <span className="font-semibold text-sm sm:text-base text-gray-900">
                            {formatCurrency(transaction.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-left px-2 sm:px-4 py-2 sm:py-4">
                          <span
                            className={cn(
                              "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap",
                              getStatusColor(transaction.status)
                            )}
                          >
                            {transaction.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-left px-2 sm:px-4 py-2 sm:py-4">
                          <span
                            className="font-mono text-xs sm:text-sm truncate block max-w-[140px]"
                            title={transaction.payment_reference}
                          >
                            {transaction.payment_reference}
                          </span>
                        </TableCell>
                        <TableCell className="text-left px-2 sm:px-4 py-2 sm:py-4">
                          <span className="font-medium text-sm">
                            {transaction.currency_code}
                          </span>
                        </TableCell>
                        <TableCell className="text-left px-2 sm:px-4 py-2 sm:py-4">
                          <span
                            className="font-mono text-xs sm:text-sm text-gray-600 truncate block max-w-[100px]"
                            title={transaction.event_id}
                          >
                            {transaction.event_id}
                          </span>
                        </TableCell>
                        <TableCell className="text-left px-2 sm:px-4 py-2 sm:py-4">
                          <span
                            className="text-xs sm:text-sm text-gray-600 truncate block max-w-[160px]"
                            title={transaction.payment_description}
                          >
                            {transaction.payment_description ||
                              "No description"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center px-2 sm:px-4 py-2 sm:py-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewUserInfo(transaction.customer_email);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              title="View User Info"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewEvent(transaction.event_id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              title="View Event"
                            >
                              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3 sm:space-y-4">
              {currentTransactions.map((transaction, index) => (
                <TransactionMobileCard key={index} transaction={transaction} />
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="p-3 sm:p-4 bg-white border-bluePrimary/20 bg-gradient-to-r from-bluePrimary/5 to-gold/5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredTransactions.length)} of{" "}
                {filteredTransactions.length} transactions
              </div>

              <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-7 sm:h-auto px-2 sm:px-3 text-xs sm:text-sm border-bluePrimary/30 text-bluePrimary hover:bg-bluePrimary/10"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Previous</span>
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
                        className={cn(
                          "w-6 h-6 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm",
                          pageNum === currentPage
                            ? "bg-bluePrimary hover:bg-bluePrimary/90"
                            : "border-bluePrimary/30 text-bluePrimary hover:bg-bluePrimary/10"
                        )}
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
                  className="h-7 sm:h-auto px-2 sm:px-3 text-xs sm:text-sm border-bluePrimary/30 text-bluePrimary hover:bg-bluePrimary/10"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>

      {/* User Info Dialog */}
      <Dialog open={userInfoDialog.open} onOpenChange={closeUserInfoDialog}>
        <DialogContent className="sm:max-w-md mx-3 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <div className="p-1.5 bg-bluePrimary/10 rounded-lg">
                <UserCircle className="w-4 h-4 text-bluePrimary" />
              </div>
              User Information
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-gray-600">
              Contact details for the customer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4">
            {userInfoDialog.loading ? (
              <div className="flex justify-center items-center py-6 sm:py-8">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-bluePrimary"></div>
                <span className="ml-2 sm:ml-3 text-sm text-gray-600">
                  Loading user data...
                </span>
              </div>
            ) : userInfoDialog.error ? (
              <div className="text-center py-6 sm:py-8">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-3 sm:mb-4" />
                <p className="text-red-600 font-medium text-sm">Error</p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {userInfoDialog.error}
                </p>
              </div>
            ) : userInfoDialog.user ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-bluePrimary/5 rounded-lg border border-bluePrimary/20">
                    <Mail className="w-4 h-4 text-bluePrimary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-700">Email</p>
                      <p className="text-sm text-gray-900 truncate">
                        {userInfoDialog.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gold/5 rounded-lg border border-gold/20">
                    <User className="w-4 h-4 text-gold flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-700">
                        Full Name
                      </p>
                      <p className="text-sm text-gray-900 truncate">
                        {userInfoDialog.user.first_name}{" "}
                        {userInfoDialog.user.last_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-700">
                        Phone Number
                      </p>
                      <p className="text-sm text-gray-900 truncate">
                        {userInfoDialog.user.phone_number || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <UserCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-700">
                        User Type
                      </p>
                      <p className="text-sm text-gray-900 capitalize">
                        {userInfoDialog.user.type || "Standard"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        window.open(`mailto:${userInfoDialog.user.email}`)
                      }
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs h-8 border-bluePrimary/30 text-bluePrimary hover:bg-bluePrimary/10"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>
                    {userInfoDialog.user.phone_number && (
                      <Button
                        onClick={() =>
                          window.open(`tel:${userInfoDialog.user.phone_number}`)
                        }
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-8 border-gold/30 text-gold hover:bg-gold/10"
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
