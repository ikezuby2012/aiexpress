import { Request } from "express";
// import { IUserDoc } from "../modules/user/user.interfaces";

export interface ExtendedUser extends Request {
  user: any;
}
