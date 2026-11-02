import { Navigate } from "react-router-dom";
import { readToken } from "../services/session";

export function HomeRedirect() {
  const token = readToken();
  return <Navigate to={token === null ? "/login" : "/account"} replace />;
}
