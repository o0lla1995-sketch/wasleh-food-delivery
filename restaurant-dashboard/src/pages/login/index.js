import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useRestaurantAuth } from "../../contexts/RestaurantAuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useRestaurantAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-500 text-white text-3xl font-bold mb-4 shadow-lg">
            W
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Wasleh Dashboard</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your restaurant</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md space-y-5"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              placeholder="owner@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-orange-500 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </form>

        <div className="mt-6 p-4 bg-orange-50 rounded-xl text-sm text-gray-700">
          <p className="font-semibold mb-1">Demo account:</p>
          <p>Email: <code className="bg-white px-1 rounded">owner@wasleh.app</code></p>
          <p>Password: <code className="bg-white px-1 rounded">wasleh123</code></p>
        </div>
      </div>
    </div>
  );
}
