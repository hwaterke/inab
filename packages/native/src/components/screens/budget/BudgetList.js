import React from 'react'
import PropTypes from 'prop-types'
import {SectionList, StyleSheet, Text, View} from 'react-native'
import {connect} from 'react-redux'
import {
  BudgetItemResource,
  CategoryGroupResource,
  CategoryResource,
  getAvailableByCategoryIdForSelectedMonth,
  getSelectedMonthBudgetItemByCategoryId,
  getSortedCategoryGroups,
  selectCategoriesByGroupId,
  selectSelectedMonthActivityByCategoryId,
} from '@inab/shared'
import {uuidExtractor} from '../../../utils'
import {globalStyles} from '../../../constants/styles'
import {Amount} from '../../Amount'
import {crudThunks} from '../../../thunks/crudThunks'

const mapStateToProps = state => ({
  categoryGroups: getSortedCategoryGroups(state),
  categoriesByGroupId: selectCategoriesByGroupId(state),
  selectedMonthActivityByCategoryId: selectSelectedMonthActivityByCategoryId(
    state
  ),
  selectedMonthBudgetItemByCategoryId: getSelectedMonthBudgetItemByCategoryId(
    state
  ),
  availableByCategory: getAvailableByCategoryIdForSelectedMonth(state),
})

const mapDispatchToProps = {
  fetchAll: crudThunks.fetchAll,
}

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export class BudgetList extends React.Component {
  static propTypes = {
    categoryGroups: PropTypes.arrayOf(CategoryGroupResource.propTypes)
      .isRequired,
    categoriesByGroupId: PropTypes.objectOf(
      PropTypes.arrayOf(CategoryResource.propTypes).isRequired
    ).isRequired,
    fetchAll: PropTypes.func.isRequired,
    selectedMonthActivityByCategoryId: PropTypes.objectOf(
      PropTypes.number.isRequired
    ).isRequired,
    selectedMonthBudgetItemByCategoryId: PropTypes.objectOf(
      BudgetItemResource.propTypes
    ).isRequired,
    availableByCategory: PropTypes.instanceOf(Map).isRequired,
  }

  state = {
    isFetching: false,
    sections: [],
  }

  onRefresh = () => {
    this.setState({isFetching: true}, () => {
      Promise.all([
        this.props.fetchAll({resource: CategoryGroupResource, replace: true}),
        this.props.fetchAll({resource: CategoryResource, replace: true}),
        this.props.fetchAll({resource: BudgetItemResource, replace: true}),
      ]).finally(() => this.setState({isFetching: false}))
    })
  }

  // TODO: create a selector for this
  groupCategories = (categoryGroups, categoriesByGroupId) => {
    this.setState({
      sections: categoryGroups.map(cg => ({
        title: cg.name,
        data: categoriesByGroupId[cg.uuid] || [],
      })),
    })
  }

  componentDidMount() {
    this.groupCategories(
      this.props.categoryGroups,
      this.props.categoriesByGroupId
    )
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.categoryGroups !== nextProps.categoryGroups ||
      this.props.categoriesByGroupId !== nextProps.categoriesByGroupId ||
      this.props.selectedMonthActivityByCategoryId !==
        nextProps.selectedMonthActivityByCategoryId ||
      this.props.selectedMonthBudgetItemByCategoryId !==
        nextProps.selectedMonthBudgetItemByCategoryId ||
      this.props.availableByCategory !== nextProps.availableByCategory
    ) {
      this.groupCategories(
        nextProps.categoryGroups,
        nextProps.categoriesByGroupId
      )
    }
  }

  renderItem = ({item}) => (
    <View style={globalStyles.row}>
      <View style={styles.categoryName}>
        <Text>{item.name}</Text>
      </View>

      <View style={styles.child}>
        <Amount
          value={
            this.props.selectedMonthBudgetItemByCategoryId[item.uuid]
              ? this.props.selectedMonthBudgetItemByCategoryId[item.uuid].amount
              : 0
          }
        />
      </View>

      <View style={styles.child}>
        <Amount
          value={this.props.selectedMonthActivityByCategoryId[item.uuid]}
        />
      </View>

      <View style={styles.child}>
        <Amount color value={this.props.availableByCategory.get(item.uuid)} />
      </View>
    </View>
  )

  renderSectionHeader = ({section}) => (
    <View style={globalStyles.sectionView}>
      <Text style={globalStyles.sectionText}>{section.title}</Text>
    </View>
  )

  render() {
    return (
      <SectionList
        sections={this.state.sections}
        keyExtractor={uuidExtractor}
        onRefresh={this.onRefresh}
        refreshing={this.state.isFetching}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
      />
    )
  }
}

const styles = StyleSheet.create({
  categoryName: {
    flex: 4,
  },

  child: {
    flex: 3,
    alignItems: 'flex-end',
  },
})
