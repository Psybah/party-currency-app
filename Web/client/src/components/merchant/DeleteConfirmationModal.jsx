import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <div className="text-center py-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Are You Sure?</h3>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-gold text-white hover:bg-gold/90 border-none"
            >
              Not sure
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes, delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
}; 