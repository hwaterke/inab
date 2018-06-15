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

@connect(mapStateToProps)
export class BudgetHeader extends React.Component {
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
        <div className="container">
          <div className="row">
            <div className="col">
              <Header>
                <MonthSelector />
                <Header>
                  <Available>
                    <Amount
                      amount={this.props.availableToBudget}
                      hasBackground
                    />
                    <div>Available to budget</div>
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
                      <div>Funds</div>
                      <div>Overspent last month</div>
                      <div>Budgeted this month</div>
                      <div>Budgeted in the future</div>
                    </Names>
                  </Details>
                </Header>
              </Header>
            </div>
          </div>
        </div>
      </HeaderContainer>
    )
  }
}
