/**
 * Health check controller
 * Endpoint: GET /api/health
 */
export const getHealthStatus = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running successfully"
  });
};

