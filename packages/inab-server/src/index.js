import {createConnection} from 'typeorm'
import {createExpressApp} from './app'
import {NODE_ENV} from "./constants/version";
import {databaseConfig} from './database/config'

createConnection(databaseConfig).then(() => {
  // Start express server
  const port = process.env.PORT || 3003

  createExpressApp().listen(port, function() {
    //eslint-disable-next-line no-console
    console.log(`Server running in ${NODE_ENV}`)
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${port}!`)
  })
})
