// Health check endpoint for Vercel
module.exports = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cardiology Hospital API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};
