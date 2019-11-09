import {
  getAvailableToBudget,
  getBudgetedInFuture,
  getBudgetedThisMonth,
  getFundsForSelectedMonth,
  getOverspentLastMonth,
} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {Amount} from '../../Amount'
import MonthSelector from '../../MonthSelector'
import {HeaderContainer} from '../../presentational/atoms/HeaderContainer'
import {Text} from '../../presentational/atoms/Text'

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
`

const Available = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.5rem 1rem;
  > span {
    font-size: 2rem;
  }
`

const Details = styled.div`
  display: flex;
  margin: 0.5rem;
`

const Right = styled.div`
  text-align: right;
`

const Names = styled.div`
  margin-left: 0.3em;
`

const mapStateToProps = state => ({
  availableToBudget: getAvailableToBudget(state),
  fundsAvailable: getFundsForSelectedMonth(state),
  overspentLastMonth: getOverspentLastMonth(state),
  budgetedThisMonth: getBudgetedThisMonth(state),
  budgetedInFuture: getBudgetedInFuture(state),
})

export const BudgetHeader = connect(mapStateToProps)(
  class BudgetHeader extends React.Component {
    static propTypes = {
      availableToBudget: PropTypes.number.isRequired,
      fundsAvailable: PropTypes.number.isRequired,
      overspentLastMonth: PropTypes.number.isRequired,
      budgetedThisMonth: PropTypes.number.isRequired,
      budgetedInFuture: PropTypes.number.isRequired,
    }

    render() {
      return (
        <HeaderContainer>
          <div className="container is-fluid">
            <Header>
              <MonthSelector />
              <Header>
                <Available>
                  <Amount amount={this.props.availableToBudget} hasBackground />
                  <div>
                    <Text>Available to budget</Text>
                  </div>
                </Available>

                <Details>
                  <Right>
                    <div>
                      <Amount amount={this.props.fundsAvailable} />
                    </div>
                    <div>
                      <Amount amount={this.props.overspentLastMonth} />
                    </div>
                    <div>
                      <Amount amount={this.props.budgetedThisMonth} />
                    </div>
                    <div>
                      <Amount amount={this.props.budgetedInFuture} />
                    </div>
                  </Right>
                  <Names>
                    <div>
                      <Text>Funds</Text>
                    </div>
                    <div>
                      <Text>Overspent last month</Text>
                    </div>
                    <div>
                      <Text>Budgeted this month</Text>
                    </div>
                    <div>
                      <Text>Budgeted in the future</Text>
                    </div>
                  </Names>
                </Details>
              </Header>
            </Header>
          </div>
        </HeaderContainer>
      )
    }
  }
)
