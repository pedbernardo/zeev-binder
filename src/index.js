import { NAME } from './constants'
import { defaultFilters } from './utils/filters'
import { LogError } from './utils/log'

import { Bind } from './directives/bind'
import { Template } from './directives/template'

export default function Binder (params = {}) {
  const config = {
    ...params,
    name: NAME,
    root: createContext(params.root),
    filters: {
      ...defaultFilters,
      ...(params.filters || {})
    }
  }

  const instance = {
    init,
    update,
    destroy
  }

  config.root[`_${NAME}`] = instance

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
    Bind(config)
    Template(config)
  }

  function update () {

  }

  function destroy () {

  }
}
