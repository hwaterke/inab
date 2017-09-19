import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {CategoryGroupResource} from 'inab-shared';
import {byIdSelector} from 'hw-react-shared';
import {CategoryGroupForm} from './CategoryGroupForm';

const mapStateToProps = state => ({
  categoryGroupById: byIdSelector(CategoryGroupResource)(state)
});

@connect(mapStateToProps)
export class CategoryGroupDetail extends React.Component {
  static propTypes = {
    categoryGroupById: PropTypes.objectOf(CategoryGroupResource.propType).isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired
    }).isRequired,
    match: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="mt-4 p-4 box">
              <h4>Category Group</h4>

              <CategoryGroupForm
                updatedResource={
                  this.props.match.params.uuid &&
                  this.props.categoryGroupById[this.props.match.params.uuid]
                }
                postSubmit={this.props.history.goBack}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
