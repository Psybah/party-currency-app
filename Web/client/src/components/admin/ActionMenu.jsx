import { MoreVertical, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ActionMenu({ actions = [], onAction, loading = false, loadingAction = null }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" disabled={loading}>
        {loading ? (
          <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
        ) : (
          <MoreVertical className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            onClick={() => onAction(action.id)}
            className="flex items-center gap-2 cursor-pointer"
            disabled={loading && loadingAction === action.id}
          >
            {loading && loadingAction === action.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              action.icon && <action.icon className="h-4 w-4" />
            )}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
