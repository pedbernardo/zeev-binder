export const NAME = 'Binder'

export const DATA_ATTR = {
  bind: '[data-bind]',
  filter: '[data-filter]',
  prop: '[data-prop]',
  root: '[data-root]'
}

export const SUPPORTED_FIELDS_TYPES = [
  'text',
  'textarea',
  'select-one',
  'hidden',
  'radio'
]

export const FIELD_EVENTS = {
  default: ['change', 'keypress', 'keyup'],
  mask: ['change', 'keypress', 'keyup', 'blur']
}

export const NODE_TYPES = {
  element: 1,
  fragment: 11,
  text: 3
}

export const DELIMITERS = {
  start: '{{',
  end: '}}',
  regularExp: /\{\{([^]+?)\}\}/g
}
