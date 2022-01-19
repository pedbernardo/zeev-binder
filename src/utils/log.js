export function LogError ({ message, type }) {
  const error = {
    name: 'Binder',
    message,
    type,
    stack: (new Error()).stack,
    codflowExecute: document.getElementById('inpCodFlowExecute')?.value,
    codflow: document.getElementById('inpCodFlow')?.value
  }

  return console.error(error)
}
