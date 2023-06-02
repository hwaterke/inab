import {BankAccountService} from '../../bank-accounts/bank-account.service'

export interface TransactionExtractor {
  canHandle(rows: Record<string, string | undefined>[]): boolean

  convert(
    row: Record<string, string | undefined>,
    context: {
      bankAccountService: BankAccountService
      cache: Map<string, number>
    }
  ): Promise<{
    date: string
    time: string | null
    amount: number
    beneficiaryAccountNumber: string | null
    hash: string
    importDetails: string | null
    transferBankAccountUuid: string | null
  } | null>
}
