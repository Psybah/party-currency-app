import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCheck, UserMinus, Trash2, Search, ChevronLeft, ChevronRight, Users2 } from 'lucide-react';
import { ActionMenu } from '@/components/admin/ActionMenu';
import { DeleteDialog, ActivateDialog, DeactivateDialog } from '@/components/admin/ActionDialogs';

export default function UserManagement() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Mock data - will be replaced with API call later
  const [users] = useState([
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Merchant", status: "Deactivated", lastActivity: "2 Hours ago", transaction: "₦500,000" },
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Host", status: "Active", lastActivity: "2 Hours ago", transaction: "₦500,000" },
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Merchant", status: "Active", lastActivity: "2 Hours ago", transaction: "₦500,000" },
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Host", status: "Active", lastActivity: "2 Hours ago", transaction: "₦500,000" },
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Merchant", status: "Deactivated", lastActivity: "2 Hours ago", transaction: "₦500,000" },
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Host", status: "Deactivated", lastActivity: "2 Hours ago", transaction: "₦500,000" },
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Host", status: "Deactivated", lastActivity: "2 Hours ago", transaction: "₦500,000" }
  ]);

  const handleAction = (action, user) => {
    setSelectedUser(user);
    setActionError(null);
    switch (action) {
      case 'delete':
        setShowDeleteDialog(true);
        break;
      case 'activate':
        setShowActivateDialog(true);
        break;
      case 'deactivate':
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

  const handleDelete = () => handleActionWithLoading('delete', async () => {
    // API call to delete user
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setShowDeleteDialog(false);
    setSelectedUser(null);
  });

  const handleActivate = () => handleActionWithLoading('activate', async () => {
    // API call to activate user
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setShowActivateDialog(false);
    setSelectedUser(null);
  });

  const handleDeactivate = () => handleActionWithLoading('deactivate', async () => {
    // API call to deactivate user
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setShowDeactivateDialog(false);
    setSelectedUser(null);
  });

  const getActions = (user) => {
    const actions = [
      {
        id: 'delete',
        label: 'Delete User',
        icon: Trash2
      }
    ];

    if (user.status === 'active' || user.status === 'Active') {
      actions.push({
        id: 'deactivate',
        label: 'Deactivate User',
        icon: UserMinus
      });
    } else {
      actions.push({
        id: 'activate',
        label: 'Activate User',
        icon: UserCheck
      });
    }

    return actions;
  };

  const totalPages = 3; // This would come from your API

  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
    // Here you would fetch data for the new page
    setTimeout(() => setLoading(false), 500); // Simulating API call
  };

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
        <div key={i} className="flex items-center space-x-4 py-4 px-6 border-b">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <div className="lg:pl-64">
        <AdminHeader toggleMobileMenu={() => setIsMobileMenuOpen(true)} />
        
        <main className="p-6 space-y-6">
          <h1 className="text-2xl text-left font-semibold font-playfair">User Management</h1>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="User ID, Name, Role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-[300px]"
                  />
                </div>
              </div>
            </div>
            
            {error ? (
              <div className="p-6 text-center text-red-600">
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setError(null);
                    // Retry fetching data
                  }}
                >
                  Try Again
                </Button>
              </div>
            ) : loading ? (
              <LoadingState />
            ) : users.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left pl-10">User ID</TableHead>
                      <TableHead className="text-left">Name</TableHead>
                      <TableHead className="text-left">Role</TableHead>
                      <TableHead className="text-left">Status</TableHead>
                      <TableHead className="text-left">Last Activity</TableHead>
                      <TableHead className="text-left">Total Transaction</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-left pl-10">{user.id}</TableCell>
                        <TableCell className="text-left">{user.name}</TableCell>
                        <TableCell className="text-left">{user.role}</TableCell>
                        <TableCell className="text-left">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status.toLowerCase() === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-left">{user.lastActivity}</TableCell>
                        <TableCell className="text-left">{user.transaction}</TableCell>
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

            {users.length > 0 && (
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
                    className={currentPage === i + 1 
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
      </div>

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        error={actionError}
      />

      <ActivateDialog
        open={showActivateDialog}
        onOpenChange={setShowActivateDialog}
        onConfirm={handleActivate}
        error={actionError}
      />

      <DeactivateDialog
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
        onConfirm={handleDeactivate}
        error={actionError}
      />
    </div>
  );
}
