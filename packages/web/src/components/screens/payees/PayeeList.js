import {getSortedPayees, PayeeResource} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {ResourceListProvider} from 'redux-crud-provider'
import styled from 'styled-components'
import {crudThunks} from '../../../thunks/crudThunks'
import {Box} from '../../presentational/atoms/Box'
import {LinkList} from '../../presentational/atoms/LinkList'
import {Section} from '../../presentational/atoms/Section'
import {Title} from '../../presentational/atoms/Title'

const PayeeListContainer = styled(LinkList)`
  > a {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

const mapStateToProps = state => ({
  payees: getSortedPayees(state),
})

export const PayeeList = connect(mapStateToProps)(
  class PayeeList extends React.Component {
    static propTypes = {
      payees: PropTypes.arrayOf(PayeeResource.propTypes).isRequired,
    }

    render() {
      return (
        <ResourceListProvider
          crudThunks={crudThunks}
          resource={PayeeResource}
          autoFetch
        >
          {() => (
            <Section>
              <div className="columns">
                <div className="column">
                  <Box>
                    <Title>Payees</Title>

                    <Link to="/payees/new">New payee</Link>

                    <PayeeListContainer>
                      {this.props.payees.map(payee => (
                        <Link
                          key={payee.uuid}
                          to={`/payees/edit/${payee.uuid}`}
                        >
                          <span>{payee.name}</span>
                          <span className="tag is-rounded">
                            {payee.locations.length}
                          </span>
                        </Link>
                      ))}
                    </PayeeListContainer>
                  </Box>
                </div>

                <div className="column is-4">
                  <Box>
                    <Title>Statistics</Title>

                    <h5>{this.props.payees.length} payees</h5>
                    <h5>
                      {this.props.payees.reduce(
                        (acc, v) => acc + v.locations.length,
                        0
                      )}{' '}
                      locations
                    </h5>
                  </Box>
                </div>
              </div>
            </Section>
          )}
        </ResourceListProvider>
      )
    }
  }
)
