import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading";

const AdminLayout = () => {
  const { user, authenticated, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate("/sign-in");
    }
  }, [authenticated, loading, navigate]);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate("/sign-in");
    } else {
      console.error("Logout failed:", error);
    }
  };

  if (loading || !authenticated) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="text-lg font-semibold text-orange-600">
          Harifwear Admin
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{user?.email}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-white bg-orange-600 rounded hover:bg-orange-500 cursor-pointer"
          >
            Logout
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
