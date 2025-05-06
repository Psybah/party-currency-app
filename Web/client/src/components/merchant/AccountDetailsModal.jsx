import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import PropTypes from "prop-types";

export function AccountDetailsModal({ isOpen, onClose, account }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <DialogTitle className="text-2xl font-playfair">Account Details</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Account number</label>
              <p className="text-base text-gray-900">{account?.accountNumber || "------------"}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Account name</label>
              <p className="text-base text-gray-900">{account?.accountName || "------------"}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Date Created</label>
              <p className="text-base text-gray-900">{account?.dateCreated || "------------"}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Merchant ID</label>
              <p className="text-base text-gray-900">{account?.merchantId || "------------"}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Bank name</label>
              <p className="text-base text-gray-900">{account?.bankName || "------------"}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

AccountDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  account: PropTypes.shape({
    accountNumber: PropTypes.string,
    accountName: PropTypes.string,
    dateCreated: PropTypes.string,
    merchantId: PropTypes.string,
    bankName: PropTypes.string,
  }),
}; 