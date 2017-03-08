// @flow
import React from 'react';
import type {ResourceDefinition} from '../types/ResourceDefinition';

export const CategoryGroupResource: ResourceDefinition = {
  path: 'category_groups',
  propType: React.PropTypes.shape({
    uuid: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    priority: React.PropTypes.number.isRequired
  })
};

export type CategoryGroup = {
  uuid: string;
  name: string;
  priority: number;
}
