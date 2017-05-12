// @flow
import React from 'react';
import type {ResourceDefinition} from 'hw-react-shared/src/crud/types/ResourceDefinition';

export const AccountResource: ResourceDefinition = {
  path: 'accounts',
  propType: React.PropTypes.shape({
    uuid: React.PropTypes.string,
    name: React.PropTypes.string.isRequired
  })
};

export type Account = {
  uuid: string,
  name: string
};
