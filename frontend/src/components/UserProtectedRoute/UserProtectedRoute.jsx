import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';

function UserProtectedRoute() {
  const userData = useUserStore((state) => state.data);

  return userData ? <Outlet /> : <Navigate to="/login" />;
}

export default UserProtectedRoute;
