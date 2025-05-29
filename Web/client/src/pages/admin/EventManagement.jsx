import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  MapPin,
  User,
  Package,
  CreditCard,
  Truck,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Printer,
  Ship,
  Package2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import adminApi from "@/api/adminApi";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

// Status configuration
const DELIVERY_STATUSES = [
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "printing",
    label: "Printing",
    icon: Printer,
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "printed",
    label: "Printed",
    icon: Package2,
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "shipping",
    label: "Shipping",
    icon: Ship,
    color: "bg-orange-100 text-orange-700",
  },
  {
    value: "delivered",
    label: "Delivered",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-700",
  },
];

const PAYMENT_STATUS_CONFIG = {
  successful: { icon: CheckCircle2, color: "bg-green-100 text-green-700" },
  pending: { icon: Clock, color: "bg-yellow-100 text-yellow-700" },
  failed: { icon: XCircle, color: "bg-red-100 text-red-700" },
  cancelled: { icon: XCircle, color: "bg-red-100 text-red-700" },
};

// Status Badge Component
const StatusBadge = ({ status, type = "delivery" }) => {
  if (type === "payment") {
    const config =
      PAYMENT_STATUS_CONFIG[status?.toLowerCase()] ||
      PAYMENT_STATUS_CONFIG["pending"];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Pending"}
      </span>
    );
  }

  const statusConfig =
    DELIVERY_STATUSES.find((s) => s.value === status?.toLowerCase()) ||
    DELIVERY_STATUSES[0];
  const Icon = statusConfig.icon;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {statusConfig.label}
    </span>
  );
};

// Event Card Component
const EventCard = ({ event, onStatusUpdate, isUpdating }) => {
  const [selectedStatus, setSelectedStatus] = useState(
    event.delivery_status?.toLowerCase() || "pending"
  );

  const handleStatusChange = async (newStatus) => {
    if (newStatus === selectedStatus) return;

    try {
      await onStatusUpdate(event.event_id, newStatus);
      setSelectedStatus(newStatus);
      toast.success("Delivery status updated successfully");
    } catch (error) {
      toast.error("Failed to update delivery status");
      console.error("Error updating status:", error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {event.event_name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {event.event_description}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                ID: {event.event_id}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Payment Status:
              </span>
              <StatusBadge status={event.payment_status} type="payment" />
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Delivery Status:
              </span>
              <StatusBadge status={event.delivery_status} type="delivery" />
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Author:</span>
            <span className="truncate">{event.event_author}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Date:</span>
            <span>
              {formatDate(event.start_date)} - {formatDate(event.end_date)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Location:</span>
            <span className="truncate">
              {event.city}, {event.state}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Created:</span>
            <span>{formatDateTime(event.created_at)}</span>
          </div>
        </div>

        {/* Address */}
        <div className="text-sm">
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Address:</span>
              <div className="ml-1">
                <div className="text-gray-600">{event.street_address}</div>
                <div className="text-gray-600">
                  {event.city}, {event.state} {event.postal_code}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Status Update */}
        <div className="border-t pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Update Delivery Status:
              </span>
            </div>

            <Select
              value={selectedStatus}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DELIVERY_STATUSES.map((status) => {
                  const Icon = status.icon;
                  return (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {status.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Additional Info */}
        {event.reconciliation && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>Reconciliation enabled</span>
          </div>
        )}
      </div>
    </Card>
  );
};

// Main Component
export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("-created_at");
  const pageSize = 10;

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

  // Fetch events
  const fetchEvents = async (
    page = currentPage,
    search = searchTerm,
    sort = sortBy
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getEvents(page, pageSize, search, sort);
      setEvents(response.events || []);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || "Failed to fetch events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchEvents(1, value, sortBy);
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
    fetchEvents(1, searchTerm, value);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchEvents(page, searchTerm, sortBy);
  };

  // Handle status update
  const handleStatusUpdate = async (eventId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await adminApi.updateDeliveryStatus(eventId, newStatus);
      // Update the local state
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.event_id === eventId
            ? { ...event, delivery_status: newStatus }
            : event
        )
      );
    } catch (error) {
      throw error;
    } finally {
      setUpdatingStatus(false);
    }
  };

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
              Event Management
            </h1>
            <div className="text-sm text-gray-500">
              {pagination && `${pagination.total_count} total events`}
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search events by name, author, or location..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-created_at">Newest First</SelectItem>
                    <SelectItem value="created_at">Oldest First</SelectItem>
                    <SelectItem value="event_name">Name A-Z</SelectItem>
                    <SelectItem value="-event_name">Name Z-A</SelectItem>
                    <SelectItem value="start_date">
                      Event Date (Early)
                    </SelectItem>
                    <SelectItem value="-start_date">
                      Event Date (Late)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Events List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading events...</span>
            </div>
          ) : error ? (
            <Card className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Loading Events
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => fetchEvents()} variant="outline">
                Try Again
              </Button>
            </Card>
          ) : events.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Events Found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "No events match your search criteria."
                  : "No events have been created yet."}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <EventCard
                  key={event.event_id}
                  event={event}
                  onStatusUpdate={handleStatusUpdate}
                  isUpdating={updatingStatus}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing page {pagination.current_page} of{" "}
                  {pagination.total_pages}({pagination.total_count} total
                  events)
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(pagination.current_page - 1)
                    }
                    disabled={!pagination.has_previous}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(5, pagination.total_pages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.total_pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.current_page <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.current_page >=
                          pagination.total_pages - 2
                        ) {
                          pageNum = pagination.total_pages - 4 + i;
                        } else {
                          pageNum = pagination.current_page - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              pageNum === pagination.current_page
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(pagination.current_page + 1)
                    }
                    disabled={!pagination.has_next}
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
    </div>
  );
}
