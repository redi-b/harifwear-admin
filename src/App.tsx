import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";
import SignIn from "@/pages/auth/SignIn";
import Dashboard from "@/pages/admin/Dashboard";
import RootLayout from "@/layouts/RootLayout";
import NotFound from "@/pages/NotFound";
import Normal_Orders from "./pages/normal_order/Normal_Orders";
import Custom_order from "./pages/custom_order/Custom_order";
import Purchased_orders from "./pages/purchased_orders/Purchased_orders";
import Shipped_orders from "./pages/Shipped_orders/Shipped_orders";
import Delivered_orders from "./pages/Deliverd_orders/Delivered_orders";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignIn />} />
        </Route>

        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/normal_orders" element={<AdminLayout />}>
          <Route index element={<Normal_Orders />} />
        </Route>
        <Route path="/custom_orders" element={<AdminLayout />}>
          <Route index element={<Custom_order />} />
        </Route>
        <Route path="/purchased_orders" element={<AdminLayout />}>
          <Route index element={<Purchased_orders />} />
        </Route>
        <Route path="/shipped_orders" element={<AdminLayout />}>
          <Route index element={<Shipped_orders />} />
        </Route>
        <Route path="/delivered_orders" element={<AdminLayout />}>
          <Route index element={<Delivered_orders />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
