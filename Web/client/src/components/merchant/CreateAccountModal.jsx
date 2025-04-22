import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import PropTypes from "prop-types";

export function CreateAccountModal({ isOpen, onClose, onSuccess, onViewDetails }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    bvn: "",
    merchantId: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API integration will go here
    setIsSuccess(true);
    onSuccess({
      ...formData,
      accountNumber: "Generated Account Number", // Will come from API
      accountName: formData.fullName,
      dateCreated: new Date().toISOString(),
      bankName: "Generated Bank Name", // Will come from API
    });
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
      fullName: "",
      bvn: "",
      merchantId: "",
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full name</label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter Your Full Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bank verification number</label>
                  <Input
                    name="bvn"
                    value={formData.bvn}
                    onChange={handleInputChange}
                    placeholder="Enter Your BVN"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Merchant identification number</label>
                  <Input
                    name="merchantId"
                    value={formData.merchantId}
                    onChange={handleInputChange}
                    placeholder="Enter Your merchant ID"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-gold hover:bg-gold/90 text-white">
                  Create Account
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