import {TransactionExtractor} from './TransactionExtractor'
import {isNil} from 'remeda'

enum ING_HEADERS {
  ACCOUNT_NUMBER = 'Numéro de compte',
  ACCOUNT_NAME = 'Nom du compte',
  BENEFICIARY_ACCOUNT = 'Compte partie adverse',
  MOVEMENT_NUMBER = 'Numéro de mouvement',
  POSTING_DATE = 'Date comptable',
  VALUE_DATE = 'Date valeur',
  AMOUNT = 'Montant',
  CURRENCY = 'Devise',
  LABELS = 'Libellés',
  DETAILS = 'Détails du mouvement',
  MESSAGE = 'Message',
}

const parseCentsFromString = (value: string) => {
  return parseInt(value.replace(/[,.]/g, ''), 10)
}

const getDate = (row: Record<string, string | undefined>) => {
  if (isNil(row[ING_HEADERS.VALUE_DATE])) {
    return null
  }

  return row[ING_HEADERS.VALUE_DATE].replace(
    /(\d{2})\/(\d{2})\/(\d{4})/,
    '$3-$2-$1'
  )
}

const extractTime = (text: string | undefined | null): string | null => {
  if (!text) {
    return null
  }

  const match = text.match(/\d{2} - (\d{2}h\d{2})/)
  if (match) {
    return `${match[1].replace('h', ':')}:00`
  }

  const match2 = text.match(/\d{2}\/\d{2} - (\d{2}:\d{2}:\d{2})/)
  if (match2) {
    return match2[1]
  }

  const match3 = text.match(/\d{2}\/\d{2} (\d{2}:\d{2})/)
  if (match3) {
    return `${match3[1]}:00`
  }

  return null
}

export const IngExtractor: TransactionExtractor = {
  convert(row) {
    if (isNil(row[ING_HEADERS.AMOUNT])) {
      console.log('No amount')
      console.log(row)
      return null
    }

    const amount = parseCentsFromString(row[ING_HEADERS.AMOUNT])

    if (amount === 0) {
      return null
    }

    if (row[ING_HEADERS.CURRENCY] !== 'EUR') {
      throw new Error('Currency not supported')
    }

    const hash = `ing-${row[ING_HEADERS.VALUE_DATE]}-${
      row[ING_HEADERS.MOVEMENT_NUMBER]
    }`

    const date = getDate(row)
    if (isNil(date)) {
      console.log(row)
      throw new Error('Transaction with no date')
    }

    return {
      amount,
      hash,
      date,
      time:
        extractTime(row[ING_HEADERS.LABELS]) ??
        extractTime(row[ING_HEADERS.DETAILS]),
      importDetails: JSON.stringify(row),
      beneficiaryAccountNumber: row[ING_HEADERS.BENEFICIARY_ACCOUNT] ?? null,
      // TODO
      transferBankAccountUuid: null,
    }
  },
}
