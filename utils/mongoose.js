module.exports = app => {
  const mongoose = require.main.require('mongoose')
  const _ = require('lodash')
  const inflection = require('inflection')

  mongoose.Schema.prototype.getAdminFields = async function () {
    let fields = _.merge({}, {
      _id: { editable: false }
    }, this.obj)

    const getRefField = async (name, field, multiple = false) => {
      const refLabel = field.refLabel || 'name'
      const ref = field.ref
      const options = await mongoose.model(ref).find().select(refLabel).sort('-_id').setOptions(field.refQuery || {}).lean()
      field.type = field.fieldType || 'select2'
      field.multiple = multiple
      field.options = options.map(v => ({ text: v[refLabel], value: v._id }))
      field.ref = [name, field.refLabel].join('.')
      return field
    }
    const getFields = async fields => {

      for (let [name, field] of Object.entries(fields)) {
        if ('_id created_at updated_at _actions'.split(' ').includes(name)) {
          field.editable = false
          if ('_actions'.split(' ').includes(name)) {
            field.viewable = false
          }
        }
        if (typeof field === 'function') {
          field = {}
        }
        if (field.field) {
          field = field.field
        } else if (Object.keys(this.paths).some(v => String(v).includes(`${name}.`))) {
          const rawFields = Object.assign({}, field)
          field.type = 'object'
          field.fields = await getFields(rawFields)
        }
        if (field.fieldType) {
          field.type = field.fieldType
        }
        if (field.type === Array) {
          field.type = 'array'
        }
        if (field.ref) {
          field = await getRefField(name, field)
        }
        if (Array.isArray(field) && _.get(field, '0.ref')) {
          field = await getRefField(name, field[0], true)
        }
        if (!field.listable && field.select === false) {
          field.listable = false
        }
        if (!field.label) {
          field.label = inflection.titleize(name).trim()
        }
        fields[name] = field
      }
      return fields
    }
    fields = await getFields(fields)
    // console.log(this.obj)
    return fields
  }
}