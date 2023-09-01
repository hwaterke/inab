import {TransactionExtractor} from './TransactionExtractor'
import {isNil} from 'remeda'

enum HEADERS {
  DATE = 'DATE',
  DESCRIPTION = 'DESCRIPTION',
  COUNTRY = 'COUNTRY',
  CARD_NUMBER = 'CARD_NUMBER',
  PARTNER_IBAN = 'PARTNER_IBAN',
  AMOUNT = 'AMOUNT',
  STATEMENT = 'STATEMENT',
}

const parseCentsFromString = (value: string) => {
  // We always expect two decimals
  if (value.match(/^-?\d+\.\d{2}$/)) {
    return parseInt(value.replace(/[,.]/g, ''), 10)
  }
  throw new Error(`Unexpected amount format ${value}`)
}

const getDate = (value: string) => {
  // Expected YYY-MM-DD
  if (value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)) {
    return value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')
  }
  throw new Error(`Unexpected date format`)
}

const getHash = (row: Record<string, string | undefined>) => {
  return `g-${row[HEADERS.DATE]}-${(row[HEADERS.DESCRIPTION] ?? '')
    .replace(/[^A-Za-z0-9]+/g, '')
    .toUpperCase()
    .trim()}-${row[HEADERS.AMOUNT]}`
}

export const GenericExtractor: TransactionExtractor = {
  canHandle(rows) {
    return [
      HEADERS.DATE,
      HEADERS.AMOUNT,
      HEADERS.DESCRIPTION,
      HEADERS.STATEMENT,
    ].every((header) => !isNil(rows[0][header]))
  },

  async convert(row, {bankAccountService, cache}) {
    if (isNil(row[HEADERS.AMOUNT]) || isNil(row[HEADERS.DATE])) {
      return null
    }

    const amount = parseCentsFromString(row[HEADERS.AMOUNT])

    if (amount === 0) {
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
    if (!isNil(row[HEADERS.PARTNER_IBAN])) {
      const transferAccount = await bankAccountService.findOneByIbanEndingWith(
        row[HEADERS.PARTNER_IBAN]
      )
      if (transferAccount) {
        transferBankAccountUuid = transferAccount.uuid
      }
    }

    return {
      amount,
      hash,
      date: getDate(row[HEADERS.DATE]),
      time: null,
      importDetails: JSON.stringify(row),
      beneficiaryAccountNumber: null,
      transferBankAccountUuid,
    }
  },
}
