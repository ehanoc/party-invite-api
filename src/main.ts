import { NestFactory } from "@nestjs/core"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { NestExpressApplication } from "@nestjs/platform-express"
import { AppModule } from "./app.module"
import { join } from "path"
import "source-map-support/register"
import { PartyModule } from "./party/party.module"
import { ValidationPipe } from "@nestjs/common"
import { ExceptionsFilter } from "./exception.filter"
import { LoggingInterceptor } from "./logging.interceptor"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose"]
  })

  app.useGlobalFilters(new ExceptionsFilter())
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.setGlobalPrefix("v1")
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  const options = new DocumentBuilder()
    .setTitle("Intercom Party API")
    .setDescription(
      "Exposes operations through API to discover available atendees"
    )
    .setVersion("0.0.1")
    .addTag("Party")
    .setVersion("v1")
    .build()

  const partyAppDocs = SwaggerModule.createDocument(app, options, {
    include: [PartyModule]
  })

  SwaggerModule.setup("docs", app, partyAppDocs)

  if (process.env.NODE_ENV === "development") {
    app.useStaticAssets(join(__dirname, "..", "documentation"))
  }

  await app.listen(8080)
}
bootstrap()
