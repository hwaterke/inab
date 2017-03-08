// @flow
import React from 'react';
import type {ResourceDefinition} from '../types/ResourceDefinition';

export const CategoryResource: ResourceDefinition = {
  path: 'categories',
  propType: React.PropTypes.shape({
    uuid: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    priority: React.PropTypes.number.isRequired,
    category_group_uuid: React.PropTypes.string.isRequired
  })
};

export type Category = {
  uuid: string;
  name: string;
  priority: number;
  category_group_uuid: string;
}
