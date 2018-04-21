import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {CategoryResource} from 'inab-shared';
import {byIdSelector} from 'hw-react-shared';
import {CategoryForm} from './CategoryForm';

const mapStateToProps = state => ({
  categoryById: byIdSelector(CategoryResource)(state)
});

@connect(mapStateToProps)
export class CategoryDetail extends React.Component {
  static propTypes = {
    categoryById: PropTypes.objectOf(CategoryResource.propType).isRequired,
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
              <h4>Category</h4>

              <CategoryForm
                updatedResource={
                  this.props.match.params.uuid &&
                  this.props.categoryById[this.props.match.params.uuid]
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
