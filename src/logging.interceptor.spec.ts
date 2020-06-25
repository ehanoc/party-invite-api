import { Test, TestingModule } from "@nestjs/testing"
import { LoggingInterceptor } from "./logging.interceptor"
import { mocked } from "ts-jest/utils"
import { Logger } from "@nestjs/common"

describe("LoggingInterceptor", () => {
  let interceptor: LoggingInterceptor
  const logger = mocked(Logger).prototype

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingInterceptor]
    })
      .overrideProvider(Logger)
      .useValue(logger)
      .compile()

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor)
  })

  it("should log http requests", () => {
    const next: any = {
      handle: jest.fn().mockReturnValue({
        pipe: jest.fn()
      })
    }
    const context: any = {
      getArgs: jest.fn().mockReturnValue([{ url: "url", method: "POST" }])
    }

    const spy = jest.spyOn(logger, "log")
    interceptor.intercept(context, next)
    expect(spy).toBeCalledWith("url", "POST")
  })
})
