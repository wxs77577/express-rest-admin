const _ = require('lodash')

module.exports = {
  async site(req, res) {
    res.send(Object.assign({}, {
      name: 'REST-ADMIN',
      menu: [
        { name: 'Home', url: '/home', icon: 'icon icon-home' },
        { name: 'Content', title: true },
        { name: 'Users', url: '/rest/users', icon: 'icon icon-user' },
        { name: 'System', title: true },
        { name: 'Logout', url: '/logout', icon: 'icon icon-lock' },
      ],
      css: [
        // 'https://demos.creative-tim.com/argon-dashboard/assets/css/argon.min.css?v=1.0.0'
      ]
    }, req.options.site))
  },
  async home(req, res) {
    res.send({
      title: 'Welcome to REST ADMIN',
      description: 'Admin dashboard based on vue 2 and bootstrap 4',
      button: {
        icon: 'icon-people',
        variant: 'primary',
        text: 'Users',
        to: '/rest/users'
      },
      statics: [
        {
          bg: 'info',
          icon: 'icon-speedometer',
          value: 5000 + parseInt(Math.random() * 5000),
          title: 'Comments',
          progress: 78
        },
        {
          bg: 'success',
          icon: 'icon-people',
          value: 10000 + parseInt(Math.random() * 10000),
          title: 'Users',
          progress: 60
        },
        {
          bg: 'warning',
          icon: 'icon-basket-loaded',
          value: 100000 + parseInt(Math.random() * 30000),
          title: 'Sales',
          progress: 92
        },
        {
          bg: 'primary',
          icon: 'icon-camrecorder',
          value: 300 + parseInt(Math.random() * 300),
          title: 'Videos',
          progress: 67
        },
      ]
    })
  },
  async upload(req, res) {

  },
  async login(req, res) {
    const { modelName, username, password, where } = req.options.auth
    const user = await req.m(modelName).findOne({
      [username]: req.body[username]
    }).select(`+${username} +${password}`).where(where)
    res.assert(user, 422, `Invalid ${username}`)
    const isValidPassword = require('bcrypt').compareSync(req.body[password], user[password])
    res.assert(isValidPassword, 422, `Invalid password`)
    const signData = _.pick(user.toJSON(), ['id', username])
    const token = require('jsonwebtoken').sign(signData, req.app.get('secret'))
    res.send({
      token,
      user
    })
  },
  async logout(req, res) {

  },
  async register(req, res) {

  },
}