export class Filter {
  attribute: string
  operator: string
  value: string | number

  constructor(attribute: string, operator: string, value: string | number) {
    this.attribute = attribute
    this.operator = operator
    this.value = value
  }
}
