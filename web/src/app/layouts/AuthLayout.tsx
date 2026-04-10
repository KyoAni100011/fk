import { Navigate, Outlet, Link } from "react-router";
import { useAuth } from "../../app/providers/AuthProvider";
import { Loader } from "../../shared/ui/Loader";

export const AuthLayout = () => {
  const { loading, user, logout } = useAuth();

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/sign-in" replace />;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="w-full bg-white border-b border-[#333333] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-black tracking-tight hover:underline">Papana.</Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm font-bold text-black hover:underline transition">Home</Link>
            <Link to="/profile" className="text-sm font-bold text-black hover:underline transition">Profile</Link>
            <Link to="/settings" className="text-sm font-bold text-black hover:underline transition">Settings ({user.username})</Link>
            <button onClick={logout} className="text-sm font-bold text-black hover:underline transition cursor-pointer">Logout</button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-4xl mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
};
