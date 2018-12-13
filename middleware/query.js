module.exports = (options = {}) => {
  options = Object.assign({
    name: 'query'
  }, options)
  return async (req, res, next) => {
    try {
      req.q = JSON.parse(req.query[options.name])
    } catch (e) {
      req.q = {}
    }
    await next()
  }
}