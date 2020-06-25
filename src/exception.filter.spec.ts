import { Test, TestingModule } from "@nestjs/testing"
import { HttpException, HttpStatus } from "@nestjs/common"
import { ExceptionsFilter } from "./exception.filter"

describe("ExceptionsFilter", () => {
  let filter: ExceptionsFilter

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionsFilter]
    }).compile()

    filter = module.get<ExceptionsFilter>(ExceptionsFilter)
  })

  it("should be defined", () => {
    expect(filter).toBeDefined()
  })

  it("take exception transform into valid error response", () => {
    const httpException = new HttpException("http error", 422)
    let expectation

    const host: any = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ url: "test" }),
        getResponse: jest.fn().mockReturnValue({
          status: jest.fn().mockReturnValue({
            json: jest.fn().mockImplementationOnce(json => {
              expectation = json
            })
          })
        })
      })
    }
    filter.catch(httpException, host)
    expect(expectation.statusCode).toBe(httpException.getStatus())
    expect(expectation.path).toBe("test")
    expect(expectation.message).toBe(httpException.message)
  })

  it("should return 500 if its a non http exception", () => {
    const nonHttpException = new Error("non http error")
    let expectation

    const host: any = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ url: "test" }),
        getResponse: jest.fn().mockReturnValue({
          status: jest.fn().mockReturnValue({
            json: jest.fn().mockImplementationOnce(json => {
              expectation = json
            })
          })
        })
      })
    }

    filter.catch(nonHttpException, host)
    expect(expectation.statusCode).toBe(500)
    expect(expectation.path).toBe("test")
    expect(expectation.message).toBe(nonHttpException.message)
  })
})
