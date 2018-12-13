const _ = require('lodash')
const inflection = require('inflection')

module.exports = {
  async grid(req, res) {
    const fields = await req.Model.schema.getAdminFields()
    const title = inflection.titleize(req.modelName)

    res.send({
      title,
      searchModel: {},
      searchFields: _(fields).pickBy('searchable'),
      fields: _(fields).omitBy(v => v.listable === false)
    })
  },
  async form(req, res) {
    const fields = await req.Model.schema.getAdminFields()
    const title = inflection.titleize(req.modelName)

    res.send({
      title,
      model: req.model || {},
      fields: _(fields).omitBy(v => v.editable === false)
    })
  },
  async create(req, res) {
    await this.form(req, res)
  },
  async edit(req, res) {
    await this.form(req, res)
  },
  async view(req, res) {
    const fields = await req.Model.schema.getAdminFields()
    const title = inflection.titleize(req.modelName)

    res.send({
      title,
      model: req.model || {},
      fields: _(fields).omitBy(v => v.viewable === false)
    })
  },

  async index(req, res) {
    let {
      where = {}, select = '', sort = '-_id',
      page = 1,
      limit = 10, skip = 0, populate
    } = req.q || {}

    if (page > 1) {
      skip = (page - 1) * limit
    }

    const finder = req.Model.find()

    // where string : regexp
    where = _(where).omitBy(v => v === '').mapValues((v, k) => {
      const type = _.get(req.Model, `schema.paths.${k}.instance`)
      if (type === 'String' && typeof v === 'string') {
        v = new RegExp(v, 'i')
      }
      return v
    }).toJSON()

    // select listable
    select += ' ' + _(req.Model.schema.obj).pickBy('listable').keys().map(v => `+${v}`).join(' ')

    finder.where(where).select(select)

    const total = await finder.countDocuments()

    if (populate || req.q.with) {
      finder.populate(populate || req.q.with)
    }
    const data = await finder.setOptions({
      skip, limit, sort
    }).find().lean()
    res.send({
      limit,
      skip,
      total,
      page,
      perPage: limit,
      data
    })
  },
  async store(req, res) {
    const model = new req.Model(req.body)
    await model.save()
    res.send(model)
  },
  async show(req, res) {
    res.send(req.model)
  },
  async update(req, res) {
    await req.model.update(req.body)
    res.send(req.model)
  },
  async destroy(req, res) {
    await req.model.remove()
    res.send({
      success: true
    })
  },
  async destroyAll(req, res) {
    // await req.Model.remove({})
    res.send({
      success: true
    })
  },

}