import {TransactionExtractor} from './TransactionExtractor'
import {isNil} from 'remeda'
import {DateTime} from 'luxon'

enum FIELDS {
  ID = 'id',
  AMOUNT = 'amount',
  SMART_LINK_ID = 'smartLinkId',
  CONFIRMED = 'confirmed',
  PARTNER_IBAN = 'partnerIban',
  PENDING = 'pending',
  PAYMENT_SCHEME = 'paymentScheme',
  TYPE = 'type',
}

export const N26ApiExtractor: TransactionExtractor = {
  canHandle(rows: Record<string, string | undefined>[]): boolean {
    return !isNil(rows[0][FIELDS.SMART_LINK_ID])
  },

  async convert(row: Record<string, any>, {bankAccountService}) {
    // Skip pending transactions
    if (row[FIELDS.PENDING] === true) {
      return null
    }

    // Skip SPACES transfers
    if (
      ['DT', 'CT'].includes(row[FIELDS.TYPE]) &&
      row[FIELDS.PAYMENT_SCHEME] === 'SPACES'
    ) {
      return null
    }

    const datetime = DateTime.fromMillis(row[FIELDS.CONFIRMED])
    const amount = Math.round(row[FIELDS.AMOUNT] * 100)

    // Try to find the transfer account
    let transferBankAccountUuid = null
    if (!isNil(row[FIELDS.PARTNER_IBAN])) {
      const transferAccount = await bankAccountService.findOneByIbanEndingWith(
        row[FIELDS.PARTNER_IBAN]
      )
      if (transferAccount) {
        transferBankAccountUuid = transferAccount.uuid
      }
    }

    return {
      date: datetime.toISODate()!,
      time: datetime.toFormat('HH:mm:ss'),
      amount,
      hash: row[FIELDS.ID],
      importDetails: JSON.stringify(row),
      transferBankAccountUuid,
      beneficiaryAccountNumber: transferBankAccountUuid
        ? null
        : row[FIELDS.PARTNER_IBAN] ?? null,
    }
  },
}
