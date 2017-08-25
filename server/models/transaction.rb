DB.create_table? :transactions do
  uuid :uuid, primary_key: true
  foreign_key :user_uuid, :users, null: false, type: 'uuid'

  Date :date, null: false
  Time :time, only_time: true

  foreign_key :payee_uuid, :payees, type: 'uuid'

  String :description

  # Amount in cents
  Integer :amount, null: false, default: 0

  foreign_key :category_uuid, :categories, type: 'uuid'

  foreign_key :account_uuid, :accounts, null: false, type: 'uuid'

  # Second account for the transfer
  foreign_key :transfer_account_uuid, :accounts, type: 'uuid'

  # Type of Transaction
  # 0 = Regular transaction with a category
  # 1 = Inflow to be budgeted, no category
  # 2 = Split transaction, no category
  Integer :type, null: false

  # When the transaction was cleared (if it ever was)
  DateTime :cleared_at

  DateTime :created_at, null: false
  DateTime :updated_at, null: false
end

class Transaction < Sequel::Model
  plugin :enum
  enum :type, [:regular, :to_be_budgeted, :split]

  many_to_one :user, key: :user_uuid
  many_to_one :category, key: :category_uuid
  many_to_one :account, key: :account_uuid
  many_to_one :payee, key: :payee_uuid
  many_to_one :transfer_account, class: Account, key: :transfer_account_uuid
  one_to_many :subtransactions, key: :transaction_uuid
  one_to_many :tags, class: TransactionTag, key: :transaction_uuid

  def validate
    super
    errors.add(:account_uuid, ' cannot transfer to itself') if account_uuid == transfer_account_uuid
    errors.add(:amount, ' only inflows can be budgeted') if to_be_budgeted? and amount < 0
    errors.add(:payee, ' must be null for a transfer') if transfer? and payee != nil
    errors.add(:category_uuid, ' must be null for a transfer') if transfer? and category_uuid
    errors.add(:category_uuid, ' must be null for an inflow to be budgeted') if to_be_budgeted? and category_uuid
    errors.add(:category_uuid, ' must be null for split transaction') if split? and category_uuid
  end

  def transfer?
    not transfer_account.nil?
  end

  def before_create
    self.updated_at = Time.now
    self.created_at ||= self.updated_at
    super
  end

  def before_update
    self.updated_at ||= Time.now
    super
  end
end
