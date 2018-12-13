const jwt = require('jsonwebtoken')
const ctx = require('express-http-context')

module.exports = (options) => {
  
  const mongoose = require.main.require('mongoose')

  return async (req, res, next) => {
    options = Object.assign({
      modelName: req.options.auth.modelName,
      allowGuest: false
    }, options)

    let userId = null
    try {
      const token = req.get('authorization').split(' ').pop()
      const secret = req.app.get('secret')
      userId = jwt.verify(token, secret).id
    } catch (e) {
      // console.log('invalid user')
    }
    req.user = await mongoose.model(options.modelName).findById(userId)
    if (req.user) {
      ctx.set('user_id', req.user._id)
    }
    await next()
  }
}