import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, ShoppingBag, ArrowRightLeft, Users2, User2, Trash2, UserCheck, UserMinus } from 'lucide-react';
import { ActionMenu } from "@/components/admin/ActionMenu";
import { DeleteDialog, ActivateDialog, DeactivateDialog } from "@/components/admin/ActionDialogs";

export default function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [actionError, setActionError] = useState(null);

  const LoadingCard = () => (
    <div className="animate-pulse space-y-4 p-6 rounded-lg bg-white shadow">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  );

  const ErrorState = ({ message, onRetry }) => (
    <div className="text-center p-6 bg-white rounded-lg shadow">
      <User2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load dashboard</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="text-sm px-4 py-2 bg-bluePrimary text-white rounded-md hover:bg-bluePrimary/90"
      >
        Try Again
      </button>
    </div>
  );

  const EmptyMetricCard = ({ icon: Icon, title }) => (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-100 rounded-full">
          <Icon className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">--</p>
        </div>
      </div>
      <div className="mt-4 flex items-center text-gray-400 text-sm">
        <span>No data available</span>
      </div>
    </Card>
  );

  const EmptyChart = () => (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-6">Transaction Overview</h3>
      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed">
        <div className="text-center">
          <User2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No transaction data available</p>
        </div>
      </div>
    </Card>
  );

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

    if (user.status === 'Active') {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <div className="lg:pl-64">
          <AdminHeader toggleMobileMenu={() => setIsMobileMenuOpen(true)} />
          <main className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
            <LoadingCard />
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <div className="lg:pl-64">
          <AdminHeader toggleMobileMenu={() => setIsMobileMenuOpen(true)} />
          <main className="p-6">
            <ErrorState 
              message={error} 
              onRetry={() => {
                setError(null);
                // Implement retry logic
              }} 
            />
          </main>
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const stats = [
    { 
      title: "Active Users", 
      value: "120",
      change: "+12%",
      period: "this week",
      icon: <Users className="w-5 h-5 text-[#4069E5]" />,
      bgColor: "bg-[#EEF1FE]"
    },
    { 
      title: "Total Orders", 
      value: "70",
      change: "+20%",
      period: "this week",
      icon: <ShoppingBag className="w-5 h-5 text-[#3F845F]" />,
      bgColor: "bg-[#EDFAF3]"
    },
    { 
      title: "Total Transfers", 
      value: "50",
      change: "+12%",
      period: "this week",
      icon: <ArrowRightLeft className="w-5 h-5 text-[#E4C65B]" />,
      bgColor: "bg-[#FEF9EC]"
    },
    { 
      title: "Total Visitors", 
      value: "70",
      change: "+20%",
      period: "this week",
      icon: <Users2 className="w-5 h-5 text-[#E56940]" />,
      bgColor: "bg-[#FEF1EC]"
    }
  ];

  const users = [
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Merchant", status: "Suspended", lastActivity: "2 Hours ago", transaction: "₦500,000" },
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Merchant", status: "Active", lastActivity: "2 Hours ago", transaction: "₦500,000" },
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Merchant", status: "Active", lastActivity: "2 Hours ago", transaction: "₦500,000" },
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Merchant", status: "Active", lastActivity: "2 Hours ago", transaction: "₦500,000" },
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Merchant", status: "Suspended", lastActivity: "2 Hours ago", transaction: "₦500,000" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <div className="lg:pl-64">
        <AdminHeader toggleMobileMenu={() => setIsMobileMenuOpen(true)} />
        
        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold font-playfair">Hello, Admin</h1>
            <p className="text-sm text-gray-500">{currentDate}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 bg-white">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      {stat.icon}
                    </div>
                    <span className="text-sm text-gray-500">{stat.title}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl text-left font-semibold">{stat.value}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-500">{stat.change}</span>
                      <span className="text-sm text-gray-500">{stat.period}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User2 className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold">User Management</h2>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">User ID</TableHead>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">Role</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Last Activity</TableHead>
                  <TableHead className="text-center">Total Transaction</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-center">{user.id}</TableCell>
                    <TableCell className="text-center">{user.name}</TableCell>
                    <TableCell className="text-center">{user.role}</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">{user.lastActivity}</TableCell>
                    <TableCell className="text-center">{user.transaction}</TableCell>
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
