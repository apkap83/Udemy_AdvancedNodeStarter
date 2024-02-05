const { clearHash } = require("../services/cache");

// This middleware runs AFTER the Route handler
module.exports = async (req, res, next) => {
  // First Run the Route Handler
  await next();

  clearHash(req.user.id);
};
