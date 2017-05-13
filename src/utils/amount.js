export const amountToCents = amount => {
  if (amount) {
    return Math.round(Number(amount) * 100);
  }
  return 0;
};

export const amountFromCents = amount => {
  if (amount) {
    return amount / 100;
  }
  return 0;
};
