const currencyFormatter = new Intl.NumberFormat(
  'pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

function cnpj (value) {
  return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, '$1.$2.$3/$4-$5')
}

function titleCase (value) {
  return value
    .toLowerCase()
    .split(' ')
    .map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    }).join(' ')
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
  const num = parseFloat(number) || 0

  if (num === 0) return '-'

  return currencyFormatter.format(num)
}

export const defaultFilters = {
  cnpj,
  titleCase,
  firstWord,
  empty,
  hour,
  currency
}
