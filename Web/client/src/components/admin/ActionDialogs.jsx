import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle, UserMinus, Trash2, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  iconColor = "text-red-600",
  iconBgColor = "bg-red-100",
  confirmLabel = "Confirm",
  onConfirm,
  error
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="p-6">
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex items-start gap-3">
              <div className={`p-2 ${iconBgColor} rounded-lg`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold mb-2">{title}</DialogTitle>
                <DialogDescription className="text-gray-600">
                  {description}
                </DialogDescription>
              </div>
            </div>
            {confirmLabel === "Delete" && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>This action cannot be undone</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex border-t">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 px-5 py-3 text-sm font-medium border-r rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-5 py-3 text-sm font-medium text-white rounded-md bg-[#6938EF] hover:bg-[#6938EF]/90"
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteDialog({ open, onOpenChange, onConfirm, error }) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete User Account"
      description="Are you sure you want to delete this user? This action is permanent and cannot be undone."
      icon={Trash2}
      confirmLabel="Delete"
      onConfirm={onConfirm}
      error={error}
    />
  );
}

export function ActivateDialog({ open, onOpenChange, onConfirm, error }) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Activate User"
      description="Are you sure you want to activate this user? They will regain full access."
      icon={CheckCircle}
      iconColor="text-green-600"
      iconBgColor="bg-green-100"
      confirmLabel="Activate"
      onConfirm={onConfirm}
      error={error}
    />
  );
}

export function DeactivateDialog({ open, onOpenChange, onConfirm, error }) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Deactivate User"
      description="Are you sure you want to deactivate this user? They will lose access until reactivated."
      icon={UserMinus}
      confirmLabel="Deactivate"
      onConfirm={onConfirm}
      error={error}
    />
  );
}
