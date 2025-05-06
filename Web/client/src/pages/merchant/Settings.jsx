import { useState, useEffect } from "react";
import { MerchantSidebar } from "@/components/merchant/MerchantSidebar";
import MerchantHeader from "@/components/merchant/MerchantHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { getAuth } from "@/lib/util";
import { BASE_URL } from "@/config";

export default function Settings() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [merchantData, setMerchantData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    businessAddress: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setSidebarCollapsed(event.detail.isCollapsed);
    };

    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    fetchMerchantData();
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  const fetchMerchantData = async () => {
    try {
      const { accessToken } = getAuth();
      const response = await axios.get(`${BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Token ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setMerchantData({
          firstName: response.data.firstname || "",
          lastName: response.data.lastname || "",
          email: response.data.email || "",
          phone: response.data.phonenumber || "",
          businessName: response.data.business_name || "",
          businessAddress: response.data.business_address || "",
        });
      }
    } catch (error) {
      console.error('Error fetching merchant data:', error);
      toast.error('Failed to load profile data');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { accessToken } = getAuth();
      await axios.put(
        `${BASE_URL}/users/update-profile`,
        {
          firstname: merchantData.firstName,
          lastname: merchantData.lastName,
          phonenumber: merchantData.phone,
          business_name: merchantData.businessName,
          business_address: merchantData.businessAddress,
        },
        {
          headers: {
            'Authorization': `Token ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { accessToken } = getAuth();
      await axios.put(
        `${BASE_URL}/users/change-password`,
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            'Authorization': `Token ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Password updated successfully');
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <MerchantSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
      }`}>
        <MerchantHeader
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-left">
              <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your account settings and preferences
              </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6 text-left">
              <TabsList className="justify-start">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="max-w-3xl">
                  <CardHeader className="text-left">
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your account profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 text-left">
                          <Label htmlFor="firstName" className="text-left">First Name</Label>
                          <Input
                            id="firstName"
                            value={merchantData.firstName}
                            onChange={(e) =>
                              setMerchantData({
                                ...merchantData,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2 text-left">
                          <Label htmlFor="lastName" className="text-left">Last Name</Label>
                          <Input
                            id="lastName"
                            value={merchantData.lastName}
                            onChange={(e) =>
                              setMerchantData({
                                ...merchantData,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2 text-left">
                          <Label htmlFor="email" className="text-left">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={merchantData.email}
                            disabled
                          />
                        </div>
                        <div className="space-y-2 text-left">
                          <Label htmlFor="phone" className="text-left">Phone Number</Label>
                          <Input
                            id="phone"
                            value={merchantData.phone}
                            onChange={(e) =>
                              setMerchantData({
                                ...merchantData,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2 text-left">
                          <Label htmlFor="businessName" className="text-left">Business Name</Label>
                          <Input
                            id="businessName"
                            value={merchantData.businessName}
                            onChange={(e) =>
                              setMerchantData({
                                ...merchantData,
                                businessName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2 text-left">
                          <Label htmlFor="businessAddress" className="text-left">Business Address</Label>
                          <Input
                            id="businessAddress"
                            value={merchantData.businessAddress}
                            onChange={(e) =>
                              setMerchantData({
                                ...merchantData,
                                businessAddress: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="text-left">
                        <Button className="bg-gold" type="submit" disabled={loading}>
                          {loading ? "Updating..." : "Update Profile"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="max-w-3xl">
                  <CardHeader className="text-left">
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your account password
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2 text-left">
                        <Label htmlFor="currentPassword" className="text-left">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 text-left">
                        <Label htmlFor="newPassword" className="text-left">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 text-left">
                        <Label htmlFor="confirmPassword" className="text-left">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <div className="text-left ">
                        <Button className="bg-gold" type="submit" disabled={loading}>
                          {loading ? "Updating..." : "Change Password"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}