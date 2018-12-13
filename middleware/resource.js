module.exports = (options = {}) => {
  const inflection = require('inflection')
  const _ = require('lodash')
  const mongoose = require.main.require('mongoose')
  options = Object.assign({
    name: 'resource',
    excludes: [],
  }, options)
  
  return async (req, res, next) => {
    const resource = req.params[options.name]
    res.assert(resource, 400, '资源不存在')

    req.modelName = options.getModelName ? options.getModelName(resource) : inflection.classify(resource)
    
    res.assert(!options.excludes.includes(req.modelName), 403, `Forbidden resource "${req.modelName}"`)

    const Model = req.Model = mongoose.model(req.modelName)
    const id = req.params.id || req.query.id || req.body.id
    if (id) {
      const allFields = _(Model.schema.obj).keys().map(v => `+${v}`).join(' ')
      req.model = await req.Model.findById(id).select(allFields)
    }
    
    await next()
  }
}