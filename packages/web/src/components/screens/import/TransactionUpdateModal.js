import {TransactionResource} from '@inab/shared'
import PropTypes from 'prop-types'
import React, {Fragment} from 'react'
import {ResourceProvider} from 'redux-crud-provider'
import {crudThunks} from '../../../thunks/crudThunks'
import {Modal} from '../../modal/Modal'
import {Box} from '../../presentational/atoms/Box'
import {Button} from '../../presentational/atoms/Button'
import {CenteredSpinner} from '../../presentational/atoms/CenteredSpinner'
import {getUpdatableFields} from './ImportTransactionTable'

export const TransactionUpdateModal = ({uuid, newData, onCloseRequested}) => (
  <Modal onCloseRequested={onCloseRequested}>
    <ResourceProvider
      uuid={uuid}
      resource={TransactionResource}
      crudThunks={crudThunks}
      postAction={onCloseRequested}
    >
      {({entity, isUpdating, updateEntity, deleteEntity}) => (
        <Box>
          {isUpdating ? (
            <CenteredSpinner />
          ) : (
            <Fragment>
              <code>{JSON.stringify(getUpdatableFields(entity), null, 2)}</code>

              <code>
                {JSON.stringify(getUpdatableFields(newData), null, 2)}
              </code>

              <Button onClick={() => updateEntity(getUpdatableFields(newData))}>
                Update
              </Button>

              <Button onClick={deleteEntity}>Delete</Button>
            </Fragment>
          )}
        </Box>
      )}
    </ResourceProvider>
  </Modal>
)

TransactionUpdateModal.propTypes = {
  uuid: PropTypes.string.isRequired,
  newData: PropTypes.object.isRequired,
  onCloseRequested: PropTypes.func.isRequired,
}
