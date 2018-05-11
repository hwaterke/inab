import React from 'react'
import {ResourceFormProvider, TransactionResource} from 'inab-shared'
import {crudThunks} from '../../../thunks/crudThunks'
import {TransactionForm} from './TransactionForm'

function resourceToForm(v) {
  return {
    amount: {
      amount: 0,
      isOutcome: true,
    },
    ...v,
  }
}

export class TransactionAddScreen extends React.Component {
  render() {
    return (
      <ResourceFormProvider
        crudThunks={crudThunks}
        resource={TransactionResource}
        resourceToForm={resourceToForm}
      >
        {props => <TransactionForm {...props} />}
      </ResourceFormProvider>
    )
  }
}
