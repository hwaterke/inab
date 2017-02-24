// @flow
import React from 'react';
import type {ResourceDefinition} from '../types/ResourceDefinition';

export const AccountResource: ResourceDefinition = {
  path: 'accounts',
  propType: React.PropTypes.shape({
    id: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    name: React.PropTypes.string.isRequired
  })
};

export type Account = {
  id: number | string;
  name: string;
}
