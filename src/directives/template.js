import { NODE_TYPES, DELIMITERS } from '../constants'
import { resolveField, getFieldEvents } from '../utils/fields'

export function Template (config) {
  walk(config.root)

  /**
   * 🔒 Private Methods
   */

  function walk (context) {
    const type = context.nodeType
    const isNodeElementLike = [NODE_TYPES.element, NODE_TYPES.fragment].includes(type)
    const isNodeText = type === NODE_TYPES.text

    if (isNodeElementLike) return walkChildren(context)
    if (isNodeText) return parseNodeText(context, { cache: true })
  }

  function walkChildren (node) {
    let child = node.firstChild

    while (child) {
      child = walk(child) || child.nextSibling
    }
  }

  function parseNodeText (node, params = {}) {
    const data = params.data || node.data
    const cache = params.cache || false
    const hasExpressions = data.includes(DELIMITERS.start)

    if (!hasExpressions) return

    const segments = []
    let lastIndex = 0
    let match

    while ((match = DELIMITERS.regularExp.exec(data))) {
      const leading = data.slice(lastIndex, match.index)
      const expression = resolve(match[1], node, cache)

      if (leading) segments.push(leading)

      segments.push(expression)

      lastIndex = match.index + match[0].length
    }

    if (lastIndex < data.length) {
      segments.push(data.slice(lastIndex))
    }

    node.textContent = segments.join('')
  }

  function resolve (exp, node, cache = false) {
    const partials = exp.split('|')
    const id = partials[0].trim()
    const filter = partials[1]?.trim()

    const fieldConfig = resolveField(id, config.root)

    if (!fieldConfig) return ''

    const { fields, mask, value } = fieldConfig
    const events = getFieldEvents(mask).join(' ')

    if (cache) register({ events, fields, node })

    return filter
      ? config.filters[filter](value)
      : value
  }

  function register ({ events, fields, node }) {
    const data = node.data

    fields.forEach(field =>
      /**
       * 😞 Why use jQuery instead of native listeners?
       * Orquestra/Zeev use some fields and side effects that
       * change input values directly by jQuery or without fire
       * the proper events, like `SUGGESTION` and `DATA` types,
       * or side effects ran by datasource mapping.
       *
       * @todo Test alternative with MutationObserver or ObjectDefine
       */
      jQuery(field).on(events, () =>
        parseNodeText(node, { data })
      )
    )
  }
}
