import { LoadingDisplay } from "./LoadingDisplay";
import { useAuthenticated } from "@/lib/hooks";

export default function PrivateRoute({ children }) {
  const authenticated = useAuthenticated();

  return authenticated ? children : <LoadingDisplay />;
}
