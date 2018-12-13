module.exports = () => {
  return async (req, res, next) => {
    req.options = req.app.get('rest-admin-options')
    await next()
  }
}