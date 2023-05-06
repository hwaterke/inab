import {AccountResource} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {select} from 'redux-crud-provider'
import {LinkList} from '../../presentational/atoms/LinkList'
import {Section} from '../../presentational/atoms/Section'
import {Title} from '../../presentational/atoms/Title'
import {Box} from '../../presentational/atoms/Box'

const mapStateToProps = (state) => ({
  accounts: select(AccountResource).asArray(state),
})

export const AccountList = connect(mapStateToProps)(
  class AccountList extends React.Component {
    static propTypes = {
      accounts: PropTypes.arrayOf(AccountResource.propTypes).isRequired,
    }

    render() {
      return (
        <Section>
          <div className="columns">
            <div className="column">
              <Box>
                <Title>Accounts</Title>

                <Link to="/accounts/new">New account</Link>

                <LinkList>
                  {this.props.accounts.map((account) => (
                    <Link
                      key={account.uuid}
                      to={`/accounts/edit/${account.uuid}`}
                    >
                      {account.name}
                    </Link>
                  ))}
                </LinkList>
              </Box>
            </div>

            <div className="column is-4">
              <Box>
                <Title>Statistics</Title>
                <h5>{this.props.accounts.length} accounts</h5>
              </Box>
            </div>
          </div>
        </Section>
      )
    }
  }
)
