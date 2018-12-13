# Express REST-ADMIN
> [REST-ADMIN](https://github.com/wxs77577/rest-admin) server-side based on Express@next and Mongoose

## Usage
> Please make sure to follow the guide of [REST-ADMIN](https://github.com/wxs77577/rest-admin)
1. Install: `npm i express-rest-admin`
2. `app.use('/admin/api', require('express-rest-admin')())`
3. Now you got all apis for REST-ADMIN.

## Options

Use: `require('express-rest-admin')(options)`

```javascript
{
  secret: 'a random string', // used for jwt signing
  auth: {
    modelName: 'User', // which model to use for login
    allowGuest: true, // allow guests access
    username: 'username', // `username` field
    password: 'password', // `password` field
    where: {} // additional query
  },
  site: {}, // rest admin site config
  middleware: {
    query: {
      name: 'query' // req.query.query
    },
    resource: {
      name: 'resource' //req.params.resource
    },
  },
  router: {
    prefix: '/' // restful apis prefix
  },
  controllers: {} // override default controllers
}
```