import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserCheck, UserMinus, Trash2, MoreVertical, Search, ChevronLeft, ChevronRight, Users2, AlertTriangle, CheckCircle } from 'lucide-react';

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

  const handleDelete = async () => {
    // API call to delete user
    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleActivate = async () => {
    // API call to activate user
    setShowActivateDialog(false);
    setSelectedUser(null);
  };

  const handleDeactivate = async () => {
    // API call to deactivate user
    setShowDeactivateDialog(false);
    setSelectedUser(null);
  };

  const DeleteDialog = () => (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="p-6">
          <div className="flex justify-end mb-2">
            <button 
              onClick={() => setShowDeleteDialog(false)} 
              className="text-gray-400 hover:text-gray-500" >
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold mb-2">Delete User Account</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Are you sure you want to delete this user? This action is permanent and cannot be undone.
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>This action cannot be undone</span>
            </div>
          </div>
        </div>
        <div className="flex border-t">
          <button 
            onClick={() => setShowDeleteDialog(false)}
            className="flex-1 px-5 py-3 text-sm font-medium border-r rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            className="flex-1 px-5 py-3 text-sm font-medium text-white rounded-md bg-[#6938EF] hover:bg-[#6938EF]/90"
          >
            Delete User
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ActivateDialog = () => (
    <Dialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="p-6">
          <div className="flex justify-end mb-2">
            <button 
              onClick={() => setShowActivateDialog(false)} 
              className="text-gray-400 hover:text-gray-500">
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold mb-2">Activate User</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Are you sure you want to activate this user? They will regain full access.
                </DialogDescription>
              </div>
            </div>
          </div>
        </div>
        <div className="flex border-t">
          <button 
            onClick={() => setShowActivateDialog(false)}
            className="flex-1 px-5 py-3 text-sm font-medium border-r rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleActivate}
            className="flex-1 px-5 py-3 text-sm font-medium text-white rounded-md bg-[#6938EF] hover:bg-[#6938EF]/90"
          >
            Activate
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const DeactivateDialog = () => (
    <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="p-6">
          <div className="flex justify-end mb-2">
            <button 
              onClick={() => setShowDeactivateDialog(false)} 
              className="text-gray-400 hover:text-gray-500">
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserMinus className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold mb-2">Deactivate User</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Are you sure you want to deactivate this user? They will lose access until reactivated.
                </DialogDescription>
              </div>
            </div>
          </div>
        </div>
        <div className="flex border-t">
          <button 
            onClick={() => setShowDeactivateDialog(false)}
            className="flex-1 px-5 py-3 text-sm font-medium border-r rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDeactivate}
            className="flex-1 px-5 py-3 text-sm font-medium text-white rounded-md bg-[#6938EF] hover:bg-[#6938EF]/90"
          >
            Deactivate
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ActionMenu = ({ user }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {user.status === "Deactivated" ? (
          <DropdownMenuItem className="cursor-pointer" onClick={() => handleAction('activate', user)}>
            <UserCheck className="mr-2 h-4 w-4" />
            <span>Activate User</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => handleAction('deactivate', user)}>
            <UserMinus className="mr-2 h-4 w-4" />
            <span>Deactivate User</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => handleAction('delete', user)}>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete User</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

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
                    className="pl-9 pr-4 py-2 w-[300px]"
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
                      <TableHead className="text-left pl-6">User ID</TableHead>
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
                        <TableCell className="text-left pl-6">{user.id}</TableCell>
                        <TableCell className="text-left">{user.name}</TableCell>
                        <TableCell className="text-left">{user.role}</TableCell>
                        <TableCell className="text-left">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === "Active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-left">{user.lastActivity}</TableCell>
                        <TableCell className="text-left">{user.transaction}</TableCell>
                        <TableCell className="text-left pr-6">
                          <ActionMenu user={user} />
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

      <DeleteDialog />
      <ActivateDialog />
      <DeactivateDialog />
    </div>
  );
}
