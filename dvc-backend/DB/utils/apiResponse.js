// src/utils/apiResponse.js
class ApiResponse {
  constructor(success, message, data = null) {
    this.success = success;
    this.message = message;
    if (data) this.data = data;
  }

  static success(message, data) {
    return new ApiResponse(true, message, data);
  }

  static error(message, errors = null) {
    return new ApiResponse(false, message, errors);
  }
}

module.exports = ApiResponse;
