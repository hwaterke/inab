import {TransactionResource} from '@inab/shared'
import PropTypes from 'prop-types'
import React, {Fragment} from 'react'
import {ResourceProvider} from 'redux-crud-provider'
import {crudThunks} from '../../../thunks/crudThunks'
import {Modal} from '../../modal/Modal'
import {Box} from '../../presentational/atoms/Box'
import {Button} from '../../presentational/atoms/Button'
import {CenteredSpinner} from '../../presentational/atoms/CenteredSpinner'
import {fieldDifferenceForUpdate} from './ImportTransactionTable'

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
              <pre>
                <code>
                  {JSON.stringify(
                    fieldDifferenceForUpdate(entity, newData),
                    null,
                    2
                  )}
                </code>
              </pre>

              <Button
                onClick={() =>
                  updateEntity(fieldDifferenceForUpdate(entity, newData))
                }
              >
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
