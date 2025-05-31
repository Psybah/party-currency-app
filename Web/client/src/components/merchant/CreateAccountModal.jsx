import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import PropTypes from "prop-types";
import { BASE_URL } from "@/config";
import { getAuth } from "@/lib/util";
import { toast } from "sonner";

export function CreateAccountModal({ isOpen, onClose, onSuccess, onViewDetails }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    bvn: "",
    event_id: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const { accessToken } = getAuth();
      if (!accessToken) {
        throw new Error('Authentication required');
      }
      const response = await fetch(`${BASE_URL}/merchant/create-reserved-account`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: formData.event_id,
          customer_name: formData.customer_name,
          bvn: formData.bvn
        }),
      });
      const data = await response.json();
      if (!response.ok || (data.response && data.response.requestSuccessful === false)) {
        throw new Error(data.message || data.error || 'Failed to create account');
      }
      if (data.response && data.response.requestSuccessful) {
        setIsSuccess(true);
        onSuccess(data.response.responseBody || data.response);
        toast.success('Virtual account created successfully');
      } else {
    setIsSuccess(true);
        onSuccess(data);
        toast.success('Virtual account created successfully');
      }
    } catch (error) {
      setErrorMsg(error.message || 'Failed to create account');
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFormData({
      customer_name: "",
      bvn: "",
      event_id: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-playfair">Create Virtual Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              {errorMsg && (
                <div className="text-red-600 text-sm mb-2">{errorMsg}</div>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Event ID</label>
                  <Input
                    name="event_id"
                    value={formData.event_id}
                    onChange={handleInputChange}
                    placeholder="Enter Event ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Customer Name</label>
                  <Input
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    placeholder="Enter Customer Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bank Verification Number (BVN)</label>
                  <Input
                    name="bvn"
                    value={formData.bvn}
                    onChange={handleInputChange}
                    placeholder="Enter BVN"
                    required
                    minLength={11}
                    maxLength={11}
                    pattern="[0-9]{11}"
                    title="BVN must be 11 digits"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-gold hover:bg-gold/90 text-white"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Account created successfully</h3>
            <div className="flex justify-center gap-4 mt-6">
              <Button
                onClick={() => {
                  handleClose();
                  onViewDetails();
                }}
                className="bg-bluePrimary text-white hover:bg-bluePrimary/90"
              >
                View Account Details
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

CreateAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
}; 