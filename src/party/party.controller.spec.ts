import { Test, TestingModule } from "@nestjs/testing"
import { PartyController } from "./party.controller"
import { PartyModule } from "./party.module"
import { Attendee } from "./types/attendee"
import { GpsDistanceService } from "../gps/gps.distance.service"
import { FilesHandlerService } from "../files/files.handler.service"
import { ConfigModule, ConfigService } from "@nestjs/config"

describe("PartyController", () => {
  let partyController: PartyController
  const envs = {
    OFFICE_LATITUDE: 53.339428,
    OFFICE_LONGITUDE: -6.257664,
    OFFICE_INVITATION_THRESHOLD: 100
  }

  const mockConfigService = {
    get: jest.fn(key => envs[key])
  }

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [PartyModule, ConfigModule],
      controllers: [PartyController],
      providers: [GpsDistanceService, FilesHandlerService, ConfigService]
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile()

    partyController = app.get<PartyController>(PartyController)
  })

  beforeEach(() => {
    jest.resetAllMocks()
    mockConfigService.get = jest.fn().mockImplementation(key => envs[key])
  })

  it("controller can be build", () => {
    expect(partyController).toBeDefined()
  })

  it("onModuleInit callback sucessful", () => {
    partyController.onModuleInit()
    expect(mockConfigService.get).toBeCalledTimes(3)
    expect(mockConfigService.get).toBeCalledWith("OFFICE_LATITUDE")
    expect(mockConfigService.get).toBeCalledWith("OFFICE_LONGITUDE")
    expect(mockConfigService.get).toBeCalledWith("OFFICE_INVITATION_THRESHOLD")
  })

  describe(" (Party controller submit attendee list route)", () => {
    it(" (POST) should return 1 attendee within radius to invite", () => {
      const singleAttendee: Attendee = {
        latitude: "53.2451022",
        user_id: 4,
        name: "Ian Kehoe",
        longitude: "-6.238335"
      }

      const file = { buffer: Buffer.from(JSON.stringify(singleAttendee)) }
      expect(partyController.attendeesToInvite(file)).toStrictEqual([
        singleAttendee
      ])
    })

    it(" (POST) should return empty result because user is not within radius threshold", () => {
      const singleAttendee: Attendee = {
        latitude: "51.92893",
        user_id: 1,
        name: "Alice Cahill",
        longitude: "-10.27699"
      }

      const file = { buffer: Buffer.from(JSON.stringify(singleAttendee)) }
      expect(partyController.attendeesToInvite(file)).toStrictEqual([])
    })

    it(`\ (POST) should return 422 error for invalid file upload`, () => {
      let error
      try {
        partyController.attendeesToInvite(undefined)
      } catch (e) {
        error = e
      }

      expect(error).toBeDefined()
    })

    it(` (POST) correctly filters all attendees within radius threshold`, () => {
      const rawText = `{"latitude": "52.986375", "user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"}
                {"latitude": "51.92893", "user_id": 1, "name": "Alice Cahill", "longitude": "-10.27699"}
                {"latitude": "51.8856167", "user_id": 2, "name": "Ian McArdle", "longitude": "-10.4240951"}
                {"latitude": "52.3191841", "user_id": 3, "name": "Jack Enright", "longitude": "-8.5072391"}
                {"latitude": "53.807778", "user_id": 28, "name": "Charlie Halligan", "longitude": "-7.714444"}
                {"latitude": "53.4692815", "user_id": 7, "name": "Frank Kehoe", "longitude": "-9.436036"}
                {"latitude": "54.0894797", "user_id": 8, "name": "Eoin Ahearn", "longitude": "-6.18671"}
                {"latitude": "53.038056", "user_id": 26, "name": "Stephen McArdle", "longitude": "-7.653889"}
                {"latitude": "54.1225", "user_id": 27, "name": "Enid Gallagher", "longitude": "-8.143333"}
                {"latitude": "53.1229599", "user_id": 6, "name": "Theresa Enright", "longitude": "-6.2705202"}
                {"latitude": "52.2559432", "user_id": 9, "name": "Jack Dempsey", "longitude": "-7.1048927"}
                {"latitude": "52.240382", "user_id": 10, "name": "Georgina Gallagher", "longitude": "-6.972413"}
                {"latitude": "53.2451022", "user_id": 4, "name": "Ian Kehoe", "longitude": "-6.238335"}
                {"latitude": "53.1302756", "user_id": 5, "name": "Nora Dempsey", "longitude": "-6.2397222"}
                {"latitude": "53.008769", "user_id": 11, "name": "Richard Finnegan", "longitude": "-6.1056711"}
                {"latitude": "53.1489345", "user_id": 31, "name": "Alan Behan", "longitude": "-6.8422408"}
                {"latitude": "53", "user_id": 13, "name": "Olive Ahearn", "longitude": "-7"}
                {"latitude": "51.999447", "user_id": 14, "name": "Helen Cahill", "longitude": "-9.742744"}
                {"latitude": "52.966", "user_id": 15, "name": "Michael Ahearn", "longitude": "-6.463"}
                {"latitude": "52.366037", "user_id": 16, "name": "Ian Larkin", "longitude": "-8.179118"}
                {"latitude": "54.180238", "user_id": 17, "name": "Patricia Cahill", "longitude": "-5.920898"}
                {"latitude": "53.0033946", "user_id": 39, "name": "Lisa Ahearn", "longitude": "-6.3877505"}
                {"latitude": "52.228056", "user_id": 18, "name": "Bob Larkin", "longitude": "-7.915833"}
                {"latitude": "54.133333", "user_id": 24, "name": "Rose Enright", "longitude": "-6.433333"}
                {"latitude": "55.033", "user_id": 19, "name": "Enid Cahill", "longitude": "-8.112"}
                {"latitude": "53.521111", "user_id": 20, "name": "Enid Enright", "longitude": "-9.831111"}
                {"latitude": "51.802", "user_id": 21, "name": "David Ahearn", "longitude": "-9.442"}
                {"latitude": "54.374208", "user_id": 22, "name": "Charlie McArdle", "longitude": "-8.371639"}
                {"latitude": "53.74452", "user_id": 29, "name": "Oliver Ahearn", "longitude": "-7.11167"}
                {"latitude": "53.761389", "user_id": 30, "name": "Nick Enright", "longitude": "-7.2875"}
                {"latitude": "54.080556", "user_id": 23, "name": "Eoin Gallagher", "longitude": "-6.361944"}
                {"latitude": "52.833502", "user_id": 25, "name": "David Behan", "longitude": "-8.522366"}`

      const file = { buffer: Buffer.from(rawText) }
      expect(partyController.attendeesToInvite(file).length).toBe(16)
    })
  })
})
