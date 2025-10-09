const getHome = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Chào mừng bạn đến với trang chủ của chúng tôi!'
  });
}
module.exports = {
    getHome
}