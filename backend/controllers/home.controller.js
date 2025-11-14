import homeService from '../services/home.service.js';

// GET / - Trang chủ
export const getHome = (req, res) => {
  const message = homeService.getHome();

  res.status(200).json({
    success: true,
    message: message,
  });
};

// GET /dashboard - Trang dashboard admin
export const getDashboard = (req, res) => {
  const message = homeService.getDashboard();
  res.status(200).json({
    success: true,
    message: message,
  });
};
export default {
  getHome,
  getDashboard,
};
