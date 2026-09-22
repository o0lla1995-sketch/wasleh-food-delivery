import { useEffect } from "react";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import { RestaurantAuthProvider, useRestaurantAuth } from "../contexts/RestaurantAuthContext";

function AuthGuard({ children }) {
  const { user, loading } = useRestaurantAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const isAuthPage = router.pathname === "/login" || router.pathname === "/signup";
      if (!user && !isAuthPage) {
        router.push("/login");
      } else if (user && isAuthPage) {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500">Loading Wasleh Dashboard...</p>
        </div>
      </div>
    );
  }

  const isAuthPage = router.pathname === "/login" || router.pathname === "/signup";
  if (!user && !isAuthPage) {
    return null;
  }
  if (user && isAuthPage) {
    return null;
  }

  return children;
}

export default function App({ Component, pageProps }) {
  return (
    <RestaurantAuthProvider>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </RestaurantAuthProvider>
  );
}
