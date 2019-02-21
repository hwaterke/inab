import cuid from 'cuid'
import Papa from 'papaparse'
import PropTypes from 'prop-types'
import {head} from 'ramda'
import React from 'react'
import Dropzone from 'react-dropzone'
import FontAwesome from 'react-fontawesome'
import styled from 'styled-components'
import {Box} from '../../presentational/atoms/Box'
import {CenteredSpinner} from '../../presentational/atoms/CenteredSpinner'

const DropzoneContainer = styled.div`
  display: flex;
  justify-content: center;
`

const DropzoneInside = styled(Dropzone)`
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed rgba(0, 0, 0, 0.4);
  font-size: 4rem;
  border-radius: 0.5rem;
`

export class ImportFileDropzone extends React.Component {
  static propTypes = {
    account: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    clearImportAccountUuid: PropTypes.func.isRequired,
    setImportTransactions: PropTypes.func.isRequired,
  }

  state = {
    loading: false,
    errors: null,
  }

  transformValue = (value, column) => {
    const result = value.trim()

    if (column === 'amount') {
      return parseInt(result, 10)
    }

    return result
  }

  transformResults(transactions) {
    return transactions.map(transaction => ({...transaction, importId: cuid()}))
  }

  onDrop = files => {
    if (files.length !== 1) {
      this.setState({errors: ['Please provide exactly one CSV file']})
    }

    this.setState({loading: true}, () => {
      Papa.parse(head(files), {
        header: true,
        skipEmptyLines: true,
        transform: this.transformValue,
        complete: results => {
          if (results.errors.length > 0) {
            this.setState({loading: false, errors: results.errors})
            return
          }

          this.setState({loading: false})
          this.props.setImportTransactions(this.transformResults(results.data))
        },
      })
    })
  }

  render() {
    const {account, clearImportAccountUuid} = this.props
    const {loading, errors} = this.state

    if (loading) {
      return <CenteredSpinner />
    }

    return (
      <div className="columns">
        <div className="column">
          <Box>
            <div className="content">
              {errors && (
                <div className="notification is-danger">
                  <ul>
                    {errors.map((error, i) => (
                      <li key={i}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p>
                Importing transactions for account: <b>{account.name}</b>
                <a
                  role="button"
                  className="delete"
                  onClick={clearImportAccountUuid}
                >
                  Clear account
                </a>
              </p>

              <ul>
                <li>One CSV file</li>
                <li>Must be UTF-8</li>
                <li>First line must be a header row</li>
                <li>
                  One line needs to be <b>amount</b>
                </li>
                <li>
                  One line needs to be <b>date</b>
                </li>
                <li>
                  You can have a <b>payee_uuid</b> line
                </li>
                <li>
                  You can have a <b>payee</b> line that will be used to match
                  payees by name
                </li>
              </ul>
            </div>
          </Box>
        </div>

        <div className="column">
          <Box>
            <DropzoneContainer>
              <DropzoneInside onDrop={this.onDrop}>
                <FontAwesome name="upload" />
              </DropzoneInside>
            </DropzoneContainer>
          </Box>
        </div>
      </div>
    )
  }
}
