import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User2 } from 'lucide-react';

export default function AdminDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Mock data for stats
  const stats = [
    { 
      title: "Active Users", 
      value: "120",
      change: "+12%",
      period: "this week",
      icon: "users"
    },
    { 
      title: "Total Orders", 
      value: "70",
      change: "+20%",
      period: "this week",
      icon: "orders"
    },
    { 
      title: "Total Transfers", 
      value: "50",
      change: "+12%",
      period: "this week",
      icon: "transfers"
    },
    { 
      title: "Total Visitors", 
      value: "70",
      change: "+20%",
      period: "this week",
      icon: "visitors"
    }
  ];

  // Mock data for user management table
  const users = [
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Merchant", status: "Suspended", lastActivity: "2 Hours ago", transaction: "NGN500,000" },
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Merchant", status: "Active", lastActivity: "2 Hours ago", transaction: "NGN500,000" },
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Merchant", status: "Active", lastActivity: "2 Hours ago", transaction: "NGN500,000" },
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Merchant", status: "Active", lastActivity: "2 Hours ago", transaction: "NGN500,000" },
    { id: "TAL-0001", name: "Felix Nwaghods", role: "Merchant", status: "Suspended", lastActivity: "2 Hours ago", transaction: "NGN500,000" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="md:pl-64">
        <AdminHeader />
        
        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Hello, Admin</h1>
            <p className="text-sm text-gray-500">{currentDate}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 bg-white">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{stat.title}</span>
                    <img 
                      src={`/${stat.icon}.svg`} 
                      alt={stat.title} 
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-semibold">{stat.value}</p>
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
              <div></div>
              <User2 className="w-6 h-6" />
              <h2 className="text-lg font-semibold text-left">User Management</h2>
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
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
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
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm">•••</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}
