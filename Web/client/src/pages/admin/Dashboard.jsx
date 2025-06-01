import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Users,
  ShoppingBag,
  ArrowRightLeft,
  Users2,
  User2,
  Eye,
  ExternalLink,
  DollarSign,
  UserCircle,
  Mail,
  Phone,
  User,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import adminApi from "@/api/adminApi";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState({
    totalActiveUsers: 0,
    newUsersThisWeek: 0,
    newUsersPreviousWeek: 0,
    userGrowthPercentage: 0,
    totalCompletedTransactions: 0,
    totalPendingTransactions: 0,
    transactionsThisWeek: 0,
    transactionGrowthPercentage: 0,
    totalEvents: 0,
    eventsThisWeek: 0,
    eventGrowthPercentage: 0,
  });
  const [transactions, setTransactions] = useState([]);

  // State for user info dialog
  const [userInfoDialog, setUserInfoDialog] = useState({
    open: false,
    loading: false,
    user: null,
    error: null,
  });

  const LoadingCard = () => (
    <Card className="p-4 sm:p-6 bg-white">
      <div className="animate-pulse space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
        </div>
        <div className="space-y-2">
          <div className="h-6 sm:h-7 bg-gray-200 rounded w-16 sm:w-20"></div>
          <div className="flex items-center gap-2">
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-10 sm:w-12"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16"></div>
          </div>
        </div>
      </div>
    </Card>
  );

  const LoadingTable = () => (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <div className="p-3 sm:p-4 border-b">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gray-200 rounded-lg"></div>
          <div className="h-5 sm:h-6 bg-gray-200 rounded w-24 sm:w-32"></div>
        </div>
      </div>
      <div className="animate-pulse">
        <div className="border-b">
          <div className="flex p-3 sm:p-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-1 px-2 sm:px-3">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
            <div className="w-16 sm:w-20"></div>
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex p-3 sm:p-4 border-b">
            {[...Array(6)].map((_, j) => (
              <div key={j} className="flex-1 px-2 sm:px-3">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-[80%]"></div>
              </div>
            ))}
            <div className="w-16 sm:w-20 px-2 sm:px-3">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ErrorState = ({ message, onRetry }) => (
    <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow">
      <User2 className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
        Unable to load dashboard
      </h3>
      <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="text-sm px-3 sm:px-4 py-2 bg-bluePrimary text-white rounded-md hover:bg-bluePrimary/90"
      >
        Try Again
      </button>
    </div>
  );

  ErrorState.propTypes = {
    message: PropTypes.string.isRequired,
    onRetry: PropTypes.func.isRequired,
  };

  // Handle view user info
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch admin statistics
      const statsResponse = await adminApi.getAdminStatistics();
      console.log("Stats Response:", statsResponse); // Debug log

      // Fetch transactions
      const transactionsResponse = await adminApi.getAllTransactions();
      console.log("Transactions Response:", transactionsResponse); // Debug log

      // Set the stats data based on the actual API response fields
      setStatsData({
        totalActiveUsers: statsResponse?.total_active_users || 0,
        newUsersThisWeek: statsResponse?.new_active_users_this_week || 0,
        newUsersPreviousWeek:
          statsResponse?.new_active_users_previous_week || 0,
        userGrowthPercentage: statsResponse?.percentage_increase || 0,
        totalCompletedTransactions:
          statsResponse?.total_completed_transactions || 0,
        totalPendingTransactions:
          statsResponse?.total_pending_transactions || 0,
        transactionsThisWeek: statsResponse?.transactions_this_week || 0,
        transactionGrowthPercentage:
          statsResponse?.percentage_increase_transactions || 0,
        totalEvents: statsResponse?.total_events || 0,
        eventsThisWeek: statsResponse?.events_this_week || 0,
        eventGrowthPercentage: statsResponse?.percentage_increase_events || 0,
      });

      setTransactions(transactionsResponse.transactions || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Transactions Mobile Card Component
  const TransactionMobileCard = ({ transaction }) => (
    <Card
      className="p-3 sm:p-4 hover:shadow-md transition-all duration-200 bg-white cursor-pointer hover:bg-gray-50"
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
            <span className="font-medium">
              {transaction.payment_reference}
            </span>
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

  // Empty Transactions Component
  const EmptyTransactionsTable = () => (
    <div className="text-center py-8 sm:py-12">
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="p-2 sm:p-3 bg-gray-100 rounded-full">
          <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
        </div>
      </div>
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
        No transactions found
      </h3>
      <p className="text-sm sm:text-base text-gray-500 max-w-sm mx-auto">
        There are currently no transactions in the system.
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-0">
        <div className="flex justify-between items-center">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-24 sm:w-32"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-24"></div>
        </div>
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
        <LoadingTable />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          setError(null);
          fetchDashboardData();
        }}
      />
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats = [
    {
      id: "total-active-users",
      title: "Total Active Users",
      value: statsData.totalActiveUsers,
      change: statsData.userGrowthPercentage,
      period: "vs last week",
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#4069E5]" />,
      bgColor: "bg-[#EEF1FE]",
      subtitle: `${statsData.newUsersThisWeek} new this week`,
    },
    {
      id: "completed-transactions",
      title: "Completed Transactions",
      value: statsData.totalCompletedTransactions,
      change: statsData.transactionGrowthPercentage,
      period: "vs last week",
      icon: <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#3F845F]" />,
      bgColor: "bg-[#EDFAF3]",
      subtitle: `${statsData.transactionsThisWeek} this week`,
    },
    {
      id: "pending-transactions",
      title: "Pending Transactions",
      value: statsData.totalPendingTransactions,
      change: null,
      period: "awaiting completion",
      icon: <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#E4C65B]" />,
      bgColor: "bg-[#FEF9EC]",
      subtitle: `${statsData.totalPendingTransactions} need attention`,
    },
    {
      id: "total-events",
      title: "Total Events",
      value: statsData.totalEvents,
      change: statsData.eventGrowthPercentage,
      period: "vs last week",
      icon: <Users2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#E56940]" />,
      bgColor: "bg-[#FEF1EC]",
      subtitle: `${statsData.eventsThisWeek} this week`,
    },
  ];

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold font-playfair">Hello, Admin</h1>
          <p className="text-xs sm:text-sm text-gray-500">{currentDate}</p>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.id}
              className="p-3 sm:p-6 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col h-full text-left">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className={cn("p-1.5 sm:p-2 rounded-lg", stat.bgColor)}>
                    {stat.icon}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 font-medium leading-tight text-left">
                    {stat.title}
                  </span>
                </div>
                <div className="space-y-1 sm:space-y-2 flex-1 text-left">
                  <p className="text-xl sm:text-3xl font-bold text-gray-900 text-left">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight text-left">{stat.subtitle}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-left">
                    {stat.change !== null && (
                      <span
                        className={cn(
                          "text-xs font-medium px-1 sm:px-2 py-0.5 sm:py-1 rounded-full self-start",
                          stat.change === 0
                            ? "text-gray-600 bg-gray-100"
                            : stat.change > 0
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                        )}
                      >
                        {stat.change === 0
                          ? "0%"
                          : `${statsData.eventGrowthPercentage > 0 ? "+" : ""}${stat.change.toFixed(
                              1
                            )}%`}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 leading-tight text-left">{stat.period}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-3 sm:p-4 border-b">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-base sm:text-lg font-semibold">Recent Transactions</h2>
              <span className="text-xs sm:text-sm text-gray-500">
                ({transactions.length} total)
              </span>
            </div>
          </div>

          {transactions && transactions.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left pl-6">Customer</TableHead>
                      <TableHead className="text-left">Amount</TableHead>
                      <TableHead className="text-left">Status</TableHead>
                      <TableHead className="text-left">Reference</TableHead>
                      <TableHead className="text-left">Currency</TableHead>
                      <TableHead className="text-left">Event ID</TableHead>
                      <TableHead className="w-[120px] text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 8).map((transaction, index) => (
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
                            {formatCurrency(transaction.amount)}
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
              <div className="lg:hidden p-3 sm:p-4 space-y-3 sm:space-y-4">
                {transactions.slice(0, 8).map((transaction, index) => (
                  <TransactionMobileCard
                    key={index}
                    transaction={transaction}
                  />
                ))}
              </div>

              {/* Show more button if there are more transactions */}
              {transactions.length > 8 && (
                <div className="p-3 sm:p-4 border-t bg-gray-50 text-center">
                  <Button
                    onClick={() => navigate("/admin/transactions")}
                    variant="outline"
                    className="text-xs sm:text-sm"
                  >
                    View All Transactions ({transactions.length})
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyTransactionsTable />
          )}
        </div>
      </div>

      {/* User Info Dialog */}
      <Dialog open={userInfoDialog.open} onOpenChange={closeUserInfoDialog}>
        <DialogContent className="sm:max-w-md mx-3 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1.5 text-sm sm:text-lg">
              <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              User Information
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Contact details for the customer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 sm:space-y-4">
            {userInfoDialog.loading ? (
              <div className="flex justify-center items-center py-4 sm:py-8">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-xs sm:text-base text-gray-600">Loading user data...</span>
              </div>
            ) : userInfoDialog.error ? (
              <div className="text-center py-4 sm:py-8">
                <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-500 mx-auto mb-2 sm:mb-4" />
                <p className="text-red-600 font-medium text-xs sm:text-base">Error</p>
                <p className="text-gray-600 text-xs sm:text-sm">{userInfoDialog.error}</p>
              </div>
            ) : userInfoDialog.user ? (
              <div className="space-y-2 sm:space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Email</p>
                      <p className="text-xs sm:text-sm text-gray-900 truncate">
                        {userInfoDialog.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Name</p>
                      <p className="text-xs sm:text-sm text-gray-900 truncate">
                        {userInfoDialog.user.first_name} {userInfoDialog.user.last_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Phone</p>
                      <p className="text-xs sm:text-sm text-gray-900 truncate">
                        {userInfoDialog.user.phone_number || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <UserCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Type</p>
                      <p className="text-xs sm:text-sm text-gray-900 capitalize">
                        {userInfoDialog.user.type || "Standard"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 sm:pt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(`mailto:${userInfoDialog.user.email}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs sm:text-sm h-7 sm:h-9"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>
                    {userInfoDialog.user.phone_number && (
                      <Button
                        onClick={() => window.open(`tel:${userInfoDialog.user.phone_number}`)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs sm:text-sm h-7 sm:h-9"
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
    </>
  );
}
