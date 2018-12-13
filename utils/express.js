module.exports = app => {
  app.response.assert = (condition, statusCode, message) => {
    if (condition) {
      return
    }
    const error = new Error(message)
    error.statusCode = statusCode
    error.code = statusCode
    throw error
  }
  app.request.m = name => require.main.require('mongoose').model(name)
}