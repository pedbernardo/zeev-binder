const NAME = 'Binder';

const DATA_ATTR = {
  bind: '[data-bind]',
  filter: '[data-filter]',
  prop: '[data-prop]',
  root: '[data-root]'
};

const SUPPORTED_FIELDS_TYPES = [
  'text',
  'textarea',
  'select-one',
  'hidden',
  'radio'
];

const FIELD_EVENTS = {
  default: ['change', 'keypress', 'keyup'],
  mask: ['change', 'keypress', 'keyup', 'blur']
};

const NODE_TYPES = {
  element: 1,
  fragment: 11,
  text: 3
};

const DELIMITERS = {
  start: '{{',
  end: '}}',
  regularExp: /\{\{([^]+?)\}\}/g
};

const currencyFormatter = new Intl.NumberFormat(
  'pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

function cnpj (value) {
  return value.length === 14
    ? value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, '$1.$2.$3/$4-$5')
    : value
}

function capitalize (value) {
  return value
    .toLowerCase()
    .split(' ')
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
}

function firstWord (value) {
  return value.split(' ')[0]
}

function empty (value) {
  if (!value) return '-'
  return value
}

function hour (value) {
  if (!value) return '-'
  if (isNaN(value)) return value

  return `${value}h`
}

function currency (number) {
  const num = parseFloat(number) || 0;

  if (num === 0) return '-'

  return currencyFormatter.format(num)
}

const defaultFilters = {
  cnpj,
  capitalize,
  firstWord,
  empty,
  hour,
  currency
};

function LogError ({ message, type }) {
  const error = {
    name: 'Binder',
    message,
    type,
    stack: (new Error()).stack,
    codflowExecute: document.getElementById('inpCodFlowExecute')?.value,
    codflow: document.getElementById('inpCodFlow')?.value
  };

  return console.error(error)
}

function resolveField (id, context, params = {}) {
  const fields = getFieldsById(id, context, params);

  if (!fields.length) {
    LogError({
      message: `field not found for id ${id}`,
      type: 'binder_field_not_found'
    });

    return null
  }

  const mask = fields[0].getAttribute('mask');
  const type = fields[0].type;
  const value = getFieldValue(fields);

  if (!(SUPPORTED_FIELDS_TYPES.includes(type))) {
    LogError({
      message: `field type ${type} in id ${id} is not supported`,
      type: 'binder_field_type_not_supported'
    });

    return null
  }

  return { fields, value, mask }
}

function getFieldEvents (mask) {
  return mask
    ? FIELD_EVENTS.mask
    : FIELD_EVENTS.default
}

function getFieldValue (fields) {
  const [field] = fields;
  const type = field.type;

  if (type === 'select-one') {
    return !field.value
      ? ''
      : field.options[field.selectedIndex].text
  }

  if (type === 'radio') {
    return fields.filter(field => field.checked)?.value || ''
  }

  return field.value
}

function getFieldsById (id, context, params) {
  const element = params.element;
  const isRoot = params.root || false;
  const insideTable = element?.closest('table[mult=S]');
  const row = insideTable ? element?.closest('tr') : null;

  const parent = isRoot
    ? context
    : row || context;

  return [...parent.querySelectorAll(`[xname=inp${id}]`)]
}

function Bind (config) {
  const elements = config.root.querySelectorAll(DATA_ATTR.bind);

  elements.forEach(mount);

  /**
   * 🔒 Private Methods
   */

  function mount (element) {
    const id = element.getAttribute(
      stripeAttrName(DATA_ATTR.bind)
    );

    const filter = element.getAttribute(
      stripeAttrName(DATA_ATTR.filter)
    );

    const rootContext = element.hasAttribute(
      stripeAttrName(DATA_ATTR.root)
    );

    const fieldConfig = resolveField(id, config.root, { element, root: rootContext });

    if (!fieldConfig) return

    const { fields, mask } = fieldConfig;
    const events = getFieldEvents(mask).join(' ');

    register({ events, fields, element, filter });
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
    );

    setValue({ fields, element, filter });
  }

  function setValue ({ fields, element, filter }) {
    const value = getFieldValue(fields);

    element.innerHTML = filter
      ? config.filters[filter](value)
      : value;
  }

  function stripeAttrName (selector) {
    return selector.substring(1, selector.length - 1)
  }
}

function Template (config) {
  walk(config.root);

  /**
   * 🔒 Private Methods
   */

  function walk (context) {
    const type = context.nodeType;
    const isNodeElementLike = [NODE_TYPES.element, NODE_TYPES.fragment].includes(type);
    const isNodeText = type === NODE_TYPES.text;

    if (isNodeElementLike) return walkChildren(context)
    if (isNodeText) return parseNodeText(context, { cache: true })
  }

  function walkChildren (node) {
    let child = node.firstChild;

    while (child) {
      child = walk(child) || child.nextSibling;
    }
  }

  function parseNodeText (node, params = {}) {
    const data = params.data || node.data;
    const cache = params.cache || false;
    const hasExpressions = data.includes(DELIMITERS.start);

    if (!hasExpressions) return

    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = DELIMITERS.regularExp.exec(data))) {
      const leading = data.slice(lastIndex, match.index);
      const expression = resolve(match[1], node, cache);

      if (leading) segments.push(leading);

      segments.push(expression);

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < data.length) {
      segments.push(data.slice(lastIndex));
    }

    node.textContent = segments.join('');
  }

  function resolve (exp, node, cache = false) {
    const partials = exp.split('|');
    const id = partials[0].trim();
    const filter = partials[1]?.trim();

    const fieldConfig = resolveField(id, config.root);

    if (!fieldConfig) return ''

    const { fields, mask, value } = fieldConfig;
    const events = getFieldEvents(mask).join(' ');

    if (cache) register({ events, fields, node });

    return filter
      ? config.filters[filter](value)
      : value
  }

  function register ({ events, fields, node }) {
    const data = node.data;

    fields.forEach(field =>
      /**
       * 😞 Why use jQuery instead of native listeners?
       * Orquestra/Zeev use some fields and side effects that
       * change input values directly by jQuery or without fire
       * the proper events, like `SUGGESTION` and `DATA` types,
       * or side effects ran by datasource mapping.
       */
      jQuery(field).on(events, () =>
        parseNodeText(node, { data })
      )
    );
  }
}

function Binder (params = {}) {
  const config = {
    ...params,
    name: NAME,
    root: createContext(params.root),
    filters: {
      ...defaultFilters,
      ...(params.filters || {})
    }
  };

  const instance = {
    init,
    update,
    destroy
  };

  config.root[`_${NAME}`] = instance;

  return instance

  /**
   * 🔒 Private Methods
   */

  function createContext (root) {
    if (root && !(root instanceof HTMLElement)) {
      return LogError({
        message: `config.root propertie must be a HTMLElement and was used ${root}`,
        type: 'binder_exp_invalid_root'
      })
    }

    return root || document.getElementById('BoxFrmExecute') || document.body
  }

  /**
   * 🔑 Public Methods
   */

  function init () {
    Bind(config);
    Template(config);
  }

  function update () {

  }

  function destroy () {

  }
}

export { Binder as default };
