import {Filter} from '../entities/Filter';

export class TransactionSearchService {

  applyFiltersToTransactions(transactions, filters: Filter[]) {
    return transactions.filter(tr => this.applyFiltersToTransaction(tr, filters));
  }

  applyFiltersToTransaction(transaction, filters: Filter[]) {
    for (let filter: Filter of filters) {
      const value = transaction[filter.attribute];
      const searchValue = filter.value;
      if (filter.operator === '=' && !this.matchExact(value, searchValue)) {
        return false;
      }
      if (!this.matchContain(value, searchValue)) {
        return false;
      }
    }
    return true;
  }

  filter(transactions, searchText) {
    if (!searchText) {
      return transactions;
    }
    return transactions.filter(tr => this.transactionContains(tr, searchText));
  }

  transactionContains(transaction, searchText) {
    const searchColumns = ['date', 'account', 'amount', 'category', 'description', 'payee'];

    return searchText
      .split(/\s+/)
      .every(st => searchColumns
        .some(col => this.matchContain(transaction[col], st)));
  }

  matchExact(value, searchText) {
    return this.tranformForSearch(value) === this.tranformForSearch(searchText);
  }

  matchContain(value, searchText) {
    return this.indexOf(searchText, value) !== -1;
  }

  indexOf(searchText, value) {
    return this.tranformForSearch(value).indexOf(this.tranformForSearch(searchText));
  }

  tranformForSearch(value) {
    if (value === undefined) {
      return "";
    }
    return value.toString().toLowerCase();
  }
}
