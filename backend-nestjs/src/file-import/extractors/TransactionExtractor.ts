export interface TransactionExtractor {
  convert(row: Record<string, string | undefined>): {
    date: string
    time: string | null
    amount: number
    beneficiaryAccountNumber: string | null
    hash: string
    importDetails: string | null
    transferBankAccountUuid: string | null
  } | null
}
