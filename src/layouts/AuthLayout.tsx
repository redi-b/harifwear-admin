import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading";

const AuthLayout = () => {
  const { authenticated, loading, verifying } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated, loading, navigate]);

  if (loading || authenticated || verifying) return <Loading />;

  return <Outlet />;
};

export default AuthLayout;
