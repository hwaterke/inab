DB.create_table? :transactions do
  primary_key :id

  Date :date, null: false

  String :payee

  String :description

  # Amount in cents
  Integer :amount, null: false, default: 0

  foreign_key :category_id, :categories

  foreign_key :account_id, :accounts, null: false

  # Second account for the transfer
  foreign_key :transfer_account_id, :accounts

  # Type of Transaction
  # 0 = Regular transaction with a category
  # 1 = Inflow to be budgeted, no category
  # 2 = Split transaction, no category
  Integer :type, null: false

  DateTime :created_at, null: false
  DateTime :updated_at, null: false
end

class Transaction < Sequel::Model
  plugin :enum
  enum :type, [:regular, :to_be_budgeted, :split]

  many_to_one :category
  many_to_one :account
  many_to_one :transfer_account, class: Account
  one_to_many :subtransactions

  def validate
    super
    errors.add(:account_id, ' cannot transfer to itself') if account_id == transfer_account_id
    errors.add(:amount, ' only inflows can be budgeted') if to_be_budgeted? and amount < 0
    errors.add(:payee, ' must be null for a transfer') if transfer? and payee != nil
    errors.add(:category_id, ' must be null for a transfer') if transfer? and category_id
    errors.add(:category_id, ' must be null for an inflow to be budgeted') if to_be_budgeted? and category_id
    errors.add(:category_id, ' must be null for split transaction') if split? and category_id
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
