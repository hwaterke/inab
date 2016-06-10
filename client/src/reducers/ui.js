
export const getSelectedMonth = (state) => ({
  month: state.ui.get('budget').get('month'),
  year: state.ui.get('budget').get('year')
});

export const getSelectedTransactions = (state) => state.selectedTransactions;
