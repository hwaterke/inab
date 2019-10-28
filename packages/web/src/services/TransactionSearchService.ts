import {Filter} from '../entities/Filter'

export class TransactionSearchService {
  applyFiltersToTransactions(transactions: any[], filters: Filter[]) {
    return transactions.filter(tr =>
      this.applyFiltersToTransaction(tr, filters)
    )
  }

  applyFiltersToTransaction(transaction: any, filters: Filter[]) {
    for (let filter of filters) {
      const value = transaction[filter.attribute]
      const searchValue = filter.value
      if (
        filter.operator === '=' &&
        !this.matchExact(value, searchValue as string)
      ) {
        return false
      }
      if (!this.matchContain(value, searchValue as string)) {
        return false
      }
    }
    return true
  }

  filter(transactions: any[], searchText: string) {
    if (!searchText) {
      return transactions
    }
    return transactions.filter(tr => this.transactionContains(tr, searchText))
  }

  transactionContains(transaction: any, searchText: string) {
    const searchColumns = [
      'date',
      'time',
      'account',
      'amount',
      'category',
      'description',
      'tagsForSearch',
      'payee',
    ]

    return searchText
      .split(/\s+/)
      .every(st =>
        searchColumns.some(col => this.matchContain(transaction[col], st))
      )
  }

  matchExact(value: any, searchText: string) {
    return this.tranformForSearch(value) === this.tranformForSearch(searchText)
  }

  matchContain(value: any, searchText: string) {
    return this.indexOf(searchText, value) !== -1
  }

  indexOf(searchText: string, value: any) {
    return this.tranformForSearch(value).indexOf(
      this.tranformForSearch(searchText)
    )
  }

  tranformForSearch(value: string) {
    if (!value) {
      return ''
    }
    return value.toString().toLowerCase()
  }
}
