import {BankAccountService} from '../../bank-accounts/bank-account.service'

export interface TransactionExtractor {
  convert(
    row: Record<string, string | undefined>,
    context: {
      bankAccountService: BankAccountService
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
