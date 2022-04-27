import { DATA_ATTR } from '../constants'
import { resolveField, getFieldEvents, getFieldValue } from '../utils/fields'

export function Bind (config) {
  const elements = config.root.querySelectorAll(DATA_ATTR.bind)

  elements.forEach(mount)

  /**
   * 🔒 Private Methods
   */

  function mount (element) {
    const id = element.getAttribute(
      stripeAttrName(DATA_ATTR.bind)
    )

    const filter = element.getAttribute(
      stripeAttrName(DATA_ATTR.filter)
    )

    const rootContext = element.hasAttribute(
      stripeAttrName(DATA_ATTR.root)
    )

    const fieldConfig = resolveField(id, config.root, { element, root: rootContext })

    if (!fieldConfig) return

    const { fields, mask } = fieldConfig
    const events = getFieldEvents(mask).join(' ')

    register({ events, fields, element, filter })
  }

  function register ({ events, fields, element, filter }) {
    fields.forEach(field =>
      /**
       * 😞 Why use jQuery instead of native listeners?
       * Orquestra/Zeev use some fields and side effects that
       * change input values directly by jQuery or without fire
       * the proper events, like `SUGGESTION` and `DATA` types,
       * or side effects ran by datasource mapping.
       */
      jQuery(field).on(events, () =>
        setValue({ fields, element, filter })
      )
    )

    setValue({ fields, element, filter })
  }

  function setValue ({ fields, element, filter }) {
    const value = getFieldValue(fields)

    element.innerHTML = filter
      ? config.filters[filter](value)
      : value
  }

  function stripeAttrName (selector) {
    return selector.substring(1, selector.length - 1)
  }
}
