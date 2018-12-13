module.exports = options => {

  const _ = require('lodash')

  options = _.merge({}, {
    secret: require('crypto').createHash('md5').update(require('os').hostname()).digest('hex'),
    auth: {
      modelName: 'User',
      allowGuest: true,
      username: 'username',
      password: 'password',
      where: {}
    },
    site: {},
    middleware: {
      
      query: {
        name: 'query'
      },
      resource: {
        name: 'resource'
      },
    },
    router: {
      prefix: '/'
    },
    controllers: {}
  }, options)

  const express = require('express')
  const app = express()

  require('./utils/mongoose')(app)
  require('./utils/express')(app)

  app.use('/assets', express.static(__dirname + '/assets'))

  let controllers = require('./controllers')
  controllers = _.merge(
    {},
    controllers,
    options.controllers
  )
  // console.log(controllers)
  const middleware = require('./middleware')

  app.set('rest-admin-options', options)
  app.set('secret', options.secret)
  app.use(middleware.options())

  const authMiddleware = middleware.auth(options.middleware.auth)
  const queryMiddleware = middleware.query(options.middleware.query)
  const resourceMiddleware = middleware.resource(options.middleware.resource)

  app.get('/', controllers.site.home)
  app.get('/home', controllers.site.home)
  app.get('/site', controllers.site.site)
  app.post('/login', controllers.site.login)
  app.post('/upload', controllers.site.upload)

  const router = express.Router({
    mergeParams: true
  })
  router.use(authMiddleware, queryMiddleware, resourceMiddleware)
  router.get('/grid', controllers.resource.grid)
  router.get('/form', controllers.resource.form)
  router.get('/create', controllers.resource.create)
  router.get('/edit', controllers.resource.edit)
  router.get('/view', controllers.resource.view)
  router.get('/', controllers.resource.index)
  router.post('/', controllers.resource.store)
  router.get('/:id', resourceMiddleware, controllers.resource.show)
  router.put('/:id', resourceMiddleware, controllers.resource.update)
  router.post('/:id', resourceMiddleware, controllers.resource.update)
  router.delete('/:id', resourceMiddleware, controllers.resource.destroy)
  router.delete('/', controllers.resource.destroyAll)

  app.use(`${options.router.prefix}:resource`, router)

  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      statusCode: err.statusCode,
      message: err.message,
      // stack: err.stack,
    })
    await next(err)
  })

  return app
}