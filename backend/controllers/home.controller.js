import homeService from '../services/home.service.js';

export const getHome = (req, res) => {
  const message = homeService.getHome();

  res.status(200).json({
    success: true,
    message: message,
  });
};
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