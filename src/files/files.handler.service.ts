import { Injectable, Logger } from "@nestjs/common"

@Injectable()
export class FilesHandlerService {
  parseFileBuffer<T>(
    buffer: Buffer,
    separator: string,
    typeGuardCheck: (element) => element is T
  ): T[] {
    return buffer
      .toString()
      .split(separator)
      .map(v => this.parse<T>(v))
      .filter(Boolean)
      .filter(typeGuardCheck)
  }

  private parse<T>(token: string): T {
    let res: T
    try {
      res = JSON.parse(token) as T
    } catch (e) {}

    return res
  }
}
