import { FIELD_EVENTS, SUPPORTED_FIELDS_TYPES } from '../constants'
import { LogError } from './log'

export function resolveField (id, context, params = {}) {
  const fields = getFieldsById(id, context, params)

  if (!fields.length) {
    LogError({
      message: `field not found for id ${id}`,
      type: 'binder_field_not_found'
    })

    return null
  }

  const mask = fields[0].getAttribute('mask')
  const type = fields[0].type
  const value = getFieldValue(fields)

  if (!(SUPPORTED_FIELDS_TYPES.includes(type))) {
    LogError({
      message: `field type ${type} in id ${id} is not supported`,
      type: 'binder_field_type_not_supported'
    })

    return null
  }

  return { fields, value, mask }
}

export function getFieldEvents (mask) {
  return mask
    ? FIELD_EVENTS.mask
    : FIELD_EVENTS.default
}

export function getFieldValue (fields) {
  const [field] = fields
  const type = field.type

  if (type === 'select-one') {
    return field.options[field.selectedIndex].text
  }

  if (type === 'radio') {
    return fields.filter(field => field.checked)?.value || ''
  }

  return field.value
}

function getFieldsById (id, context, params) {
  const element = params.element
  const isRoot = params.root || false
  const insideTable = element?.closest('table[mult=S]')
  const row = insideTable ? element?.closest('tr') : null

  const parent = isRoot
    ? context
    : row || context

  return [...parent.querySelectorAll(`[xname=inp${id}]`)]
}
