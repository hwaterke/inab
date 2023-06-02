import {TransactionExtractor} from './TransactionExtractor'
import {isNil} from 'remeda'

enum N26_HEADERS {
  DATE = 'Date',
  PAYEE = 'Payee',
  ACCOUNT_NUMBER = 'Account number',
  TRANSACTION_TYPE = 'Transaction type',
  PAYMENT_REFERENCE = 'Payment reference',
  AMOUNT = 'Amount (EUR)',
  AMOUNT_FOREIGN_CURRENCY = 'Amount (Foreign Currency)',
  FOREIGN_CURRENCY = 'Type Foreign Currency',
  EXCHANGE_RATE = 'Exchange Rate',
}

const parseCentsFromString = (value: string) => {
  const toInt = (amount: string) => parseInt(amount.replace(/[,.]/g, ''), 10)

  if (value.match(/\.\d{2}$/)) {
    return toInt(value)
  }
  if (value.match(/\.\d$/)) {
    return toInt(value) * 10
  }

  throw new Error(`Could not parse amount ${value}`)
}

const getHash = (row: Record<string, string | undefined>) => {
  return `n26-${row[N26_HEADERS.DATE]}-${(row[N26_HEADERS.PAYEE] ?? '')
    .replace(/[^A-Za-z0-9]+/g, '')
    .toUpperCase()
    .trim()}-${row[N26_HEADERS.AMOUNT]}`
}

export const N26Extractor: TransactionExtractor = {
  canHandle(rows: Record<string, string | undefined>[]): boolean {
    return !isNil(rows[0][N26_HEADERS.AMOUNT])
  },

  async convert(row, {bankAccountService, cache}) {
    if (isNil(row[N26_HEADERS.AMOUNT])) {
      return null
    }

    const amount = parseCentsFromString(row[N26_HEADERS.AMOUNT])

    if (amount === 0) {
      return null
    }

    if (row[N26_HEADERS.PAYMENT_REFERENCE] === 'Round-up') {
      // Skip internal transfers
      return null
    }

    let hash = getHash(row)
    // Check presence in cache
    if (cache.has(hash)) {
      hash = `${hash}-${cache.get(hash)}`
      cache.set(hash, cache.get(hash)! + 1)
    } else {
      cache.set(hash, 1)
    }

    // Try to find the transfer account
    let transferBankAccountUuid = null
    if (!isNil(row[N26_HEADERS.ACCOUNT_NUMBER])) {
      const transferAccount = await bankAccountService.findOneByIbanEndingWith(
        row[N26_HEADERS.ACCOUNT_NUMBER]
      )
      if (transferAccount) {
        transferBankAccountUuid = transferAccount.uuid
      }
    }

    return {
      amount,
      hash,
      date: row[N26_HEADERS.DATE]!,
      time: null,
      importDetails: JSON.stringify(row),
      beneficiaryAccountNumber: transferBankAccountUuid
        ? null
        : row[N26_HEADERS.ACCOUNT_NUMBER] ?? null,
      transferBankAccountUuid,
    }
  },
}
