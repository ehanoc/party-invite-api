import { Injectable } from "@nestjs/common"
import { GeoPoint } from "./types/geo.point"

@Injectable()
export class GpsDistanceService {
  distance(p1: GeoPoint, p2: GeoPoint): number {
    const p1Lat = this.toRadians(p1.latitude)
    const p1Long = this.toRadians(p1.longitude)

    const p2Lat = this.toRadians(p2.latitude)
    const p2Long = this.toRadians(p2.longitude)

    const latsSin: number = Math.sin(p1Lat) * Math.sin(p2Lat)
    const longCos: number = Math.cos(p1Lat) * Math.cos(p2Lat)
    const diffCosLong: number = Math.cos(Math.abs(p2Long - p1Long))

    const angleRad: number = Math.acos(latsSin + longCos * diffCosLong)

    // aprox earth radius * angle
    return 6371 * angleRad
  }

  private toRadians(n: number): number {
    return n * (Math.PI / 180)
  }
}
