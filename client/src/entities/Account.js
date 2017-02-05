// @flow
import React from 'react';
import type {ResourceDefinition} from '../types/ResourceDefinition';

export const AccountResource: ResourceDefinition = {
  path: 'accounts',
  propType: React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired
  })
};
