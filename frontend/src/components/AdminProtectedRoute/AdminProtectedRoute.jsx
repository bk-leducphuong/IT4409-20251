import { Outlet, Navigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';

function AdminProtectedRoute() {
  const isAdmin = useUserStore((state) => state.data)?.role === 'admin';

  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
}

export default AdminProtectedRoute;
