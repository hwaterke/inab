import {CodegenConfig} from '@graphql-codegen/cli'
import {ApolloClientHelpersConfig} from '@graphql-codegen/typescript-apollo-client-helpers/typings/config'

const config: CodegenConfig = {
  schema: '../backend-nestjs/src/schema.gql',
  documents: ['src/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/': {
      preset: 'client',
    },
    './src/gql/typePolicies.codegen.ts': {
      plugins: ['typescript-apollo-client-helpers'],
      config: {
        requireKeyFields: true,
        requirePoliciesForAllTypes: true,
        useTypeImports: true,
      } as ApolloClientHelpersConfig,
    },
  },
}

export default config
