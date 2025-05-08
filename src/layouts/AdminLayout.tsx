import { useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading";

const AdminLayout = () => {
  const { user, authenticated, loading, verifying, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated && !verifying) {
      navigate("/sign-in");
    }
  }, [authenticated, navigate]);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate("/sign-in");
    } else {
      console.error("Logout failed:", error);
    }
  };

  if (!authenticated || loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <Link to={"/"} className="text-lg font-semibold text-orange-600">
          Harifwear Admin
        </Link>
        <div className="flex flex-col items-center gap-4 text-sm text-gray-600 sm:flex-row">
          <span>{user?.email}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 font-semibold text-white bg-orange-600 rounded cursor-pointer md:font-medium hover:bg-orange-500"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
