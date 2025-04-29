import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: null as string | null,
    password: null as string | null,
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const from = new URLSearchParams(location.search).get("from") || "/";

  const { signIn } = useAuth();

  const validate = (email: string, password: string) => {
    const errs = {
      email: null as string | null,
      password: null as string | null,
    };
    if (!email) errs.email = "Email is required.";
    if (!password) errs.password = "Password is required.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: null, password: null });
    setServerError(null);

    const validation = validate(email, password);
    if (validation.email || validation.password) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password, from);

    if (error) {
      setServerError(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-md shadow">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Admin SignIn
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full mt-1 px-3 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              disabled={loading}
              autoFocus
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full mt-1 px-3 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500"
              disabled={loading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-orange-600 cursor-pointer text-white rounded hover:bg-orange-500 transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
