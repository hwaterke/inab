// @flow
import React from 'react';
import type {ResourceDefinition} from '../types/ResourceDefinition';

export const CategoryGroupResource: ResourceDefinition = {
  path: 'category_groups',
  propType: React.PropTypes.shape({
    id: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    name: React.PropTypes.string.isRequired,
    priority: React.PropTypes.number.isRequired
  })
};
