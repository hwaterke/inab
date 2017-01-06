export default class TransactionSearchService {
  filter(transactions, searchText) {
    if (!searchText) {
      return transactions;
    }
    return transactions.filter(tr => this.transaction_contains(tr, searchText));
  }

  transaction_contains(transaction, searchText) {
    const searchColumns = ['date', 'account', 'amount', 'category', 'description', 'payee'];

    return searchText
      .split(/\s+/)
      .every(st => searchColumns
        .some(col => this.contains(transaction[col], st)));
  }

  contains(value, searchText) {
    if (!searchText) {
      return true;
    }
    if (!value) {
      return false;
    }
    return value.toString().toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
  }
}
