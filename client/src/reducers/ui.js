
export const getSelectedPage = (state) => state.selectedPage.name;

export const getSelectedAccount = (state) => state.selectedPage.name == 'ACCOUNT' && state.selectedPage.data;

export const getSelectedMonth = (state) => ({
  month: state.ui.get('budget').get('month'),
  year: state.ui.get('budget').get('year')
});

export const getSelectedTransactions = (state) => state.selectedTransactions;
