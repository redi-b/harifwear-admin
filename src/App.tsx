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

import Custom_order from "./pages/custom_order/Custom_order";

import OrdersStatus from "./pages/order_status/OrderStatus";
import Regular_Orders from "./pages/regular_order/Regular_Orders";

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
          <Route index element={<Regular_Orders />} />
        </Route>
        <Route path="/custom_orders" element={<AdminLayout />}>
          <Route index element={<Custom_order />} />
        </Route>
        
        <Route path="/order_status" element={<AdminLayout />}>
          <Route index element={<OrdersStatus />} />
        </Route>
      
        

        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
