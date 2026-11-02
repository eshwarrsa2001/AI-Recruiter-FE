import { Route, Routes } from "react-router-dom";
import { AccountPage } from "../pages/AccountPage";
import { HomeRedirect } from "../pages/HomeRedirect";
import { LoginPage } from "../pages/LoginPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/account" element={<AccountPage />} />
    </Routes>
  );
}
