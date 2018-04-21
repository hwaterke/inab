import React from 'react'
import PropTypes from 'prop-types'
import {Text, View, SectionList, StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import {
  BudgetItemResource,
  CategoryResource,
  CategoryGroupResource,
  getSortedCategoryGroups,
  selectCategoriesByGroupId,
  selectSelectedMonthActivityByCategoryId,
  getSelectedMonthBudgetItemByCategoryId,
  getAvailableByCategoryIdForSelectedMonth,
} from 'inab-shared'
import {crud} from '../../hoc/crud'
import {uuidExtractor} from '../../../utils'
import {globalStyles} from '../../../constants/styles'
import {Amount} from '../../Amount'

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

@crud
@connect(mapStateToProps)
export class BudgetList extends React.Component {
  static propTypes = {
    categoryGroups: PropTypes.arrayOf(CategoryGroupResource.propType)
      .isRequired,
    categoriesByGroupId: PropTypes.objectOf(
      PropTypes.arrayOf(CategoryResource.propType).isRequired
    ).isRequired,
    fetchAll: PropTypes.func.isRequired,
    selectedMonthActivityByCategoryId: PropTypes.objectOf(
      PropTypes.number.isRequired
    ).isRequired,
    selectedMonthBudgetItemByCategoryId: PropTypes.objectOf(
      BudgetItemResource.propType
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
        this.props.fetchAll(CategoryGroupResource, true),
        this.props.fetchAll(CategoryResource, true),
        this.props.fetchAll(BudgetItemResource, true),
      ])
        .then(() => this.setState({isFetching: false}))
        .catch(() => this.setState({isFetching: false}))
    })
  }

  groupCategories = (categoryGroups, categoriesByGroupId) => {
    this.setState({
      sections: categoryGroups.map(cg => ({
        title: cg.name,
        data: categoriesByGroupId[cg.uuid],
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
