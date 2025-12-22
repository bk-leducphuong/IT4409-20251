import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { setPreviousSite } from '../../libs/storage';

function UserProtectedRoute() {
  const userData = useUserStore((state) => state.data);

  if (!userData) {
    setPreviousSite(window.location.pathname);
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default UserProtectedRoute;
