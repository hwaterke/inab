import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {FileImportService} from './file-import/file-import.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true})

  // Import files
  const importService = app.get(FileImportService)
  await importService.importFiles()

  await app.listen(3000)
}
bootstrap()
