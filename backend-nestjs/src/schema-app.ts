import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'

/**
 * This app is only used at build time to force NestJS to generate the GQL schema which is then used for client gql codegen
 */
const main = async () => {
  await NestFactory.createApplicationContext(AppModule)
  console.log('Nothing to do. Schema generated.')
}
void main()
