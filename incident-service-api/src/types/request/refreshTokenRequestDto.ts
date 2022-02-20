import { IsString } from "class-validator";

export class RefreshTokenRequestDto {
  @IsString({ message: "refreshToken must have a value" })
  refreshToken: string;

  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
  }
}
