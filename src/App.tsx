import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProductsPage from "./pages/Products/ProductsPage";
import CartPage from "./pages/Cart/CartPage";
import { useAuth } from "./context/AuthContext";
import ProductAdminPage from "./pages/Products/ProductAdminPage";

export default function App() {
  const { user } = useAuth();
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* --- Public Routes --- */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={user && user.role==='admin'?<ProductAdminPage />:<ProductsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route element={<AppLayout />}>
              <Route path="/cart" element={<CartPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/products" element={<ProductAdminPage />} />
            </Route>
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
