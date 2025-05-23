// src/middlewares/role.middleware.js
const ApiResponse = require("../utils/apiResponse");

const roleCheck = (roles) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(
          ApiResponse.error("You do not have permission to perform this action")
        );
    }
    next();
  };
};

module.exports = roleCheck;
