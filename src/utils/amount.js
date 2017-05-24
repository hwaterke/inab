// @flow

export const amountToCents = (amount: number) => {
  if (amount) {
    return Math.round(Number(amount) * 100);
  }
  return 0;
};

export const amountFromCents = (amount: number) => {
  if (amount) {
    return amount / 100;
  }
  return 0;
};
