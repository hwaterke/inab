// @flow
import React from 'react';
import type {ResourceDefinition} from '../types/ResourceDefinition';

export const CategoryResource: ResourceDefinition = {
  path: 'categories',
  propType: React.PropTypes.shape({
    id: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    name: React.PropTypes.string.isRequired,
    priority: React.PropTypes.number.isRequired,
    category_group_id: React.PropTypes.number.isRequired
  })
};

export type Category = {
  id: number | string;
  name: string;
  priority: number;
  category_group_id: number | string;
}
