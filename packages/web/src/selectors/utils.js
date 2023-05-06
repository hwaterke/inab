import {reduce} from 'ramda'

export const sumOfAmounts = reduce((acc, record) => acc + record.amount, 0)

export const groupBy = (items, ...mappers) => {
  const mapper = mappers.shift()
  const result = new Map()
  items.forEach((i) => {
    result.set(mapper(i), result.get(mapper(i)) || [])
    result.get(mapper(i)).push(i)
  })
  if (mappers.length > 0) {
    result.forEach((v, k) => result.set(k, groupBy(v, ...mappers)))
  }
  return result
}
