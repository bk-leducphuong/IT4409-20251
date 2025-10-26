import e from 'express';
import { getHomeService } from '../services/home.service.js';

export const getHome = (req, res) => {
  const message = getHomeService();

  res.status(200).json({
    success: true,
    message: message,
  });
};

export default {
  getHome,
};