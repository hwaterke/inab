import {
  BudgetItemResource,
  CategoryGroupResource,
  CategoryResource,
  getAvailableByCategoryIdForSelectedMonth,
  getSelectedMonthBudgetItemByCategoryId,
  getSortedCategoryGroups,
  goalToBudgetByCategoryForSelectedMonth,
  selectCategoriesByGroupId,
  selectSelectedMonthActivityByCategoryId,
} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import ui from 'redux-ui'
import styled from 'styled-components'
import {media} from '../../../styles/styleUtils'
import CategoryGroupRow from '../../CategoryGroupRow'
import {CategoryRow} from '../../CategoryRow'

const Table = styled.table.attrs(() => ({
  className: 'table is-narrow is-fullwidth',
}))`
  input {
    padding-top: 1px;
    padding-bottom: 1px;
    text-align: right;
  }

  ${media.tablet`
    td:first-child,
    th:first-child {
      padding-left: 1.5rem;
    }

    td:last-child,
    th:last-child {
      padding-right: 1.5rem;
    }
  `};
`

const BudgetedColumn = styled.th`
  width: 15%;
`

const mapStateToProps = (state) => ({
  categoryGroups: getSortedCategoryGroups(state),
  categoriesByGroupId: selectCategoriesByGroupId(state),
  selectedMonthActivityByCategoryId:
    selectSelectedMonthActivityByCategoryId(state),
  selectedMonthBudgetItemByCategoryId:
    getSelectedMonthBudgetItemByCategoryId(state),
  availableByCategory: getAvailableByCategoryIdForSelectedMonth(state),
  goalToBudgetByCategoryForSelectedMonth:
    goalToBudgetByCategoryForSelectedMonth(state),
})

export const BudgetTable = ui({
  state: {
    editingCategoryId: undefined,
  },
})(
  connect(mapStateToProps)(
    withRouter(
      class BudgetTable extends React.Component {
        static propTypes = {
          categoryGroups: PropTypes.arrayOf(CategoryGroupResource.propTypes)
            .isRequired,
          categoriesByGroupId: PropTypes.objectOf(
            PropTypes.arrayOf(CategoryResource.propTypes).isRequired
          ).isRequired,
          selectedMonthActivityByCategoryId: PropTypes.objectOf(
            PropTypes.number.isRequired
          ).isRequired,
          selectedMonthBudgetItemByCategoryId: PropTypes.objectOf(
            BudgetItemResource.propTypes
          ).isRequired,
          availableByCategory: PropTypes.instanceOf(Map).isRequired,
          goalToBudgetByCategoryForSelectedMonth: PropTypes.objectOf(
            PropTypes.number
          ).isRequired,
          ui: PropTypes.shape({
            categorySelected: PropTypes.string,
          }).isRequired,
          updateUI: PropTypes.func.isRequired,
          history: PropTypes.shape({
            push: PropTypes.func.isRequired,
          }).isRequired,
        }

        categoryNameClick = (categoryUuid) => () => {
          if (this.props.ui.categorySelected === categoryUuid) {
            this.props.updateUI({categorySelected: null})
          } else {
            this.props.updateUI({categorySelected: categoryUuid})
          }
        }

        render() {
          const rows = []
          this.props.categoryGroups.forEach((cg) => {
            rows.push(
              <CategoryGroupRow
                key={'cg' + cg.uuid}
                categoryGroup={cg}
                onClick={() =>
                  this.props.history.push(`/category-groups/edit/${cg.uuid}`)
                }
              />
            )
            if (this.props.categoriesByGroupId[cg.uuid]) {
              this.props.categoriesByGroupId[cg.uuid].forEach((c) => {
                rows.push(
                  <CategoryRow
                    key={'c' + c.uuid}
                    category={c}
                    onNameClick={this.categoryNameClick(c.uuid)}
                    budgetItem={
                      this.props.selectedMonthBudgetItemByCategoryId[c.uuid]
                    }
                    activity={
                      this.props.selectedMonthActivityByCategoryId[c.uuid]
                    }
                    available={this.props.availableByCategory.get(c.uuid)}
                    goal={
                      !!this.props.goalToBudgetByCategoryForSelectedMonth[
                        c.uuid
                      ]
                    }
                  />
                )
              })
            }
          })

          return (
            <Table>
              <thead>
                <tr>
                  <th>Category</th>
                  <BudgetedColumn className="has-text-right">
                    Budgeted
                  </BudgetedColumn>
                  <th className="has-text-right">Activity</th>
                  <th className="has-text-right">Available</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          )
        }
      }
    )
  )
)
