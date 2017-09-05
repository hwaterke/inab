class SubtransactionSplit < Grape::Validations::Base
  def validate_param!(attr_name, params)
    number_of_sub = number_of_subtransactions(params)
    if split?(params)
      if number_of_sub < 2
        fail Grape::Exceptions::Validation, params: [@scope.full_name(attr_name)], message: 'split must have at least two subtransactions'
      end

      total = params.subtransactions.inject(0) { |sum, n| sum + (n.amount || 0) }
      if total != params.amount
        fail Grape::Exceptions::Validation, params: [@scope.full_name('amount')], message: 'does not match the subtransaction amounts'
      end
    else
      if number_of_sub > 0
        fail Grape::Exceptions::Validation, params: [@scope.full_name(attr_name)], message: 'provided cannot have subtransactions'
      end
    end
  end

  def split?(params)
    params.respond_to?(:type) and params.type == :split
  end

  def number_of_subtransactions(params)
    if params.respond_to?(:subtransactions)
      params.subtransactions.size
    else
      0
    end
  end
end
