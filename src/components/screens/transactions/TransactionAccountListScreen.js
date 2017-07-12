import React from 'react';
import PropTypes from 'prop-types';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {arraySelector} from 'hw-react-shared';
import {AccountResource} from 'inab-shared';
import {Ionicons} from '@expo/vector-icons';
import {crud} from '../../hoc/crud';
import {globalStyles} from '../../../constants/styles';
import {uuidExtractor} from '../../../utils';

const mapStateToProps = state => ({
  accounts: arraySelector(AccountResource)(state)
});

@crud
@connect(mapStateToProps)
export class TransactionAccountListScreen extends React.Component {
  static propTypes = {
    accounts: PropTypes.arrayOf(AccountResource.propType).isRequired,
    fetchAll: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired
    }).isRequired
  };

  state = {
    isFetching: false
  };

  onRefresh = () => {
    this.setState({isFetching: true}, () => {
      this.props
        .fetchAll(AccountResource, true)
        .then(() => this.setState({isFetching: false}));
    });
  };

  navigateToAccount = accountUuid => {
    this.props.navigation.navigate('TransactionList', {accountUuid});
  };

  render() {
    return (
      <View style={globalStyles.screen}>
        <FlatList
          data={this.props.accounts}
          keyExtractor={uuidExtractor}
          onRefresh={this.onRefresh}
          refreshing={this.state.isFetching}
          renderItem={({item}) =>
            <TouchableOpacity onPress={() => this.navigateToAccount(item.uuid)}>
              <View style={globalStyles.row}>
                <Text>
                  {item.name}
                </Text>
                <Ionicons
                  name={'ios-arrow-forward'}
                  size={26}
                  style={{opacity: 0.5}}
                />
              </View>
            </TouchableOpacity>}
          ListHeaderComponent={() =>
            <TouchableOpacity onPress={() => this.navigateToAccount()}>
              <View style={globalStyles.row}>
                <Text>All</Text>
                <Ionicons
                  name={'ios-arrow-forward'}
                  size={26}
                  style={{opacity: 0.5}}
                />
              </View>
            </TouchableOpacity>}
        />
      </View>
    );
  }
}
