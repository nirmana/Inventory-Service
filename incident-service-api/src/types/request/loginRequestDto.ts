import { IsString } from "class-validator";

export class LoginRequestDto {
  @IsString({ message: "Username must have a value" })
  userName: string;
  @IsString({ message: "Password must have a value" })
  password: string;

  constructor(userName: string, password: string) {
    this.userName = userName;
    this.password = password;
  }
}
