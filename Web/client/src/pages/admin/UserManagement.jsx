import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  UserCheck,
  UserMinus,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Users2,
} from "lucide-react";
import { ActionMenu } from "@/components/admin/ActionMenu";
import {
  DeleteDialog,
  ActivateDialog,
  DeactivateDialog,
} from "@/components/admin/ActionDialogs";
import adminApi from "@/api/adminApi";
import { cn } from "@/lib/utils";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchUsers();
  }, []); // Remove currentPage dependency since we'll handle pagination client-side

  useEffect(() => {
    // Filter and paginate users when search query changes
    const filtered = users.filter(
      (user) =>
        user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, users]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "--";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return timestamp; // Return original if parsing fails
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getUsers();

      // Transform the data to match our needs
      const transformedData = Array.isArray(response)
        ? response
        : response?.users || [];
      const formattedUsers = transformedData.map((user) => {
        return {
          id: user.username, // Use username as ID since it's the unique identifier
          email: user.username,
          name: user.name || "--",
          role: user.role?.toLowerCase() || "--",
          status: user.isActive ? "Active" : "Inactive",
          last_activity: formatDate(user.last_login),
          total_transaction:
            typeof user.total_transaction === "number"
              ? `₦${user.total_transaction.toLocaleString()}`
              : "₦0",
        };
      });

      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to load users");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action, user) => {
    setSelectedUser(user);
    setActionError(null);
    switch (action) {
      case "delete":
        setShowDeleteDialog(true);
        break;
      case "activate":
        setShowActivateDialog(true);
        break;
      case "deactivate":
        setShowDeactivateDialog(true);
        break;
    }
  };

  const handleActionWithLoading = async (action, handler) => {
    setLoadingAction(action);
    setActionError(null);
    try {
      await handler();
    } catch (error) {
      setActionError(
        error.response?.data?.message ||
          "An error occurred while performing this action. Please try again."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const [actionFeedback, setActionFeedback] = useState({
    message: "",
    type: "",
  });

  const showFeedback = (message, type = "success") => {
    setActionFeedback({ message, type });
    setTimeout(() => setActionFeedback({ message: "", type: "" }), 3000);
  };

  const handleDelete = async () => {
    if (!selectedUser?.id) {
      setActionError("Username is required for deletion");
      return;
    }
    await handleActionWithLoading("delete", async () => {
      try {
        await adminApi.deleteUser(selectedUser.id);
        setShowDeleteDialog(false);
        setSelectedUser(null);
        await fetchUsers();
        showFeedback(
          `Successfully deleted user ${selectedUser.name || selectedUser.id}`
        );
      } catch (error) {
        console.error("Delete error:", error);
        setActionError(error.message || "Failed to delete user");
      }
    });
  };

  const handleActivate = async () => {
    if (!selectedUser?.id) {
      setActionError("Username is required for activation");
      return;
    }
    await handleActionWithLoading("activate", async () => {
      try {
        await adminApi.activateUser(selectedUser.id);
        setShowActivateDialog(false);
        setSelectedUser(null);
        await fetchUsers();
        showFeedback(
          `Successfully activated user ${selectedUser.name || selectedUser.id}`
        );
      } catch (error) {
        console.error("Activate error:", error);
        setActionError(error.message || "Failed to activate user");
      }
    });
  };

  const handleDeactivate = async () => {
    if (!selectedUser?.id) {
      setActionError("Username is required for deactivation");
      return;
    }
    await handleActionWithLoading("deactivate", async () => {
      try {
        await adminApi.suspendUser(selectedUser.id);
        setShowDeactivateDialog(false);
        setSelectedUser(null);
        await fetchUsers();
        showFeedback(
          `Successfully deactivated user ${
            selectedUser.name || selectedUser.id
          }`
        );
      } catch (error) {
        console.error("Deactivate error:", error);
        setActionError(error.message || "Failed to deactivate user");
      }
    });
  };

  const getActions = (user) => {
    if (!user?.email) {
      return []; // Don't show actions if email is missing
    }

    const actions = [
      {
        id: "delete",
        label: "Delete User",
        icon: Trash2,
      },
    ];

    if (user.status?.toLowerCase() === "active") {
      actions.push({
        id: "deactivate",
        label: "Deactivate User",
        icon: UserMinus,
      });
    } else {
      actions.push({
        id: "activate",
        label: "Activate User",
        icon: UserCheck,
      });
    }

    return actions;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gray-100 rounded-full">
          <Users2 className="w-8 h-8 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-6">
        {searchQuery
          ? "No users match your search criteria. Try adjusting your filters."
          : "There are no users in the system yet."}
      </p>
    </div>
  );

  const LoadingState = () => (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center border-b py-4">
          <div className="w-1/5">
            <div className="h-4 bg-gray-200 rounded w-[150px]"></div>
          </div>
          <div className="w-1/5">
            <div className="h-4 bg-gray-200 rounded w-[200px]"></div>
          </div>
          <div className="w-1/6">
            <div className="h-4 bg-gray-200 rounded w-[80px]"></div>
          </div>
          <div className="w-1/6">
            <div className="h-4 bg-gray-200 rounded w-[60px]"></div>
          </div>
          <div className="w-1/5">
            <div className="h-4 bg-gray-200 rounded w-[140px]"></div>
          </div>
          <div className="w-1/5">
            <div className="h-4 bg-gray-200 rounded w-[100px]"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 space-y-6">
        <h1 className="text-2xl text-left font-semibold font-playfair">
          User Management
        </h1>

        {actionFeedback.message && (
          <div
            className={cn(
              "fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-500",
              actionFeedback.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {actionFeedback.message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Name, Email, Role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : !currentUsers || currentUsers.length === 0 ? (
            <EmptyState />
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left pl-10">Name</TableHead>
                    <TableHead className="text-left">Email</TableHead>
                    <TableHead className="text-left">Role</TableHead>
                    <TableHead className="text-left">Status</TableHead>
                    <TableHead className="text-left">Last Activity</TableHead>
                    <TableHead className="text-left">
                      Total Transaction
                    </TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-left pl-10">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-left">{user.email}</TableCell>
                      <TableCell className="text-left">{user.role}</TableCell>
                      <TableCell className="text-left">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status?.toLowerCase() === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-left">
                        {user.last_activity}
                      </TableCell>
                      <TableCell className="text-left">
                        {user.total_transaction}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <ActionMenu
                          actions={getActions(user)}
                          onAction={(action) => handleAction(action, user)}
                          loading={loadingAction !== null}
                          loadingAction={loadingAction}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && !error && filteredUsers.length > 0 && (
            <div className="p-4 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="text-gray-600 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(i + 1)}
                  className={
                    currentPage === i + 1
                      ? "bg-bluePrimary text-white hover:bg-bluePrimary/90"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                  disabled={loading}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="text-gray-600 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </main>

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        error={actionError}
        loading={loadingAction === "delete"}
        user={selectedUser}
      />

      <ActivateDialog
        open={showActivateDialog}
        onOpenChange={setShowActivateDialog}
        onConfirm={handleActivate}
        error={actionError}
        loading={loadingAction === "activate"}
        user={selectedUser}
      />

      <DeactivateDialog
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
        onConfirm={handleDeactivate}
        error={actionError}
        loading={loadingAction === "deactivate"}
        user={selectedUser}
      />
    </div>
  );
}
