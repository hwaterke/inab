// @flow
import React from 'react';
import type {ResourceDefinition} from '../types/ResourceDefinition';

export const CategoryResource: ResourceDefinition = {
  path: 'categories',
  propType: React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    priority: React.PropTypes.number.isRequired,
    category_group_id: React.PropTypes.number.isRequired
  })
};
