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

        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
