import {AccountResource} from '@inab/shared'
import PropTypes from 'prop-types'
import React, {Fragment} from 'react'
import Select from 'react-select'
import {ResourceListProvider} from 'redux-crud-provider'
import {crudThunks} from '../../../thunks/crudThunks'
import {Box} from '../../presentational/atoms/Box'
import {CenteredSpinner} from '../../presentational/atoms/CenteredSpinner'
import {Title} from '../../presentational/atoms/Title'

export class ImportAccountSelector extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div className="columns is-centered">
        <div className="column is-two-thirds-tablet is-half-desktop">
          <Box>
            <ResourceListProvider
              crudThunks={crudThunks}
              resource={AccountResource}
              loadingRender={<CenteredSpinner />}
              autoFetch
            >
              {({entities}) => (
                <Fragment>
                  <Title>Please select an account</Title>
                  <Select
                    options={entities.map(account => ({
                      label: account.name,
                      value: account.uuid,
                    }))}
                    onChange={item => this.props.onSelect(item.value)}
                  />
                </Fragment>
              )}
            </ResourceListProvider>
          </Box>
        </div>
      </div>
    )
  }
}
