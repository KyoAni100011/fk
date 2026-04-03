import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../core/AuthProvider";
import { CardLayout } from "../../core/components/CardLayout";
import { Loader } from "../../core/components/ui/Loader";

export const PublicLayout = () => {
  const { loading, user } = useAuth();

  if (loading) return <Loader />;

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center overflow-hidden relative">
      <CardLayout title="">
        <Outlet />
      </CardLayout>
    </div>
  );
};
