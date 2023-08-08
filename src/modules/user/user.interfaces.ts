import mongoose, { Model, Document } from "mongoose";
import { QueryResult } from "../paginate/paginate";

export interface IUser {
  name: string;
  password: string | undefined;
  phoneNumber: string;
  otp?: string;
  isAccountVerified?: boolean | undefined;
  active?: boolean | undefined;
  passwordResetToken?: String | undefined;
  passwordResetExpires?: Date | undefined;
  passwordChangedAt?: Date | undefined;
}

export interface IUserDoc extends IUser, Document {
  _id: string;
  isPasswordMatch(password: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): Promise<boolean>;
  createPasswordResetToken(): Promise<string>;
}

export interface IUserModel extends Model<IUserDoc> {
  isNameTaken(
    name: string,
    excludeUserId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}

export interface IUserWithToken {
  user: IUserDoc;
  token: string;
}

export type UpdateUserBody = Partial<IUser>;
export type TUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<
  IUser,
  | "isAccountVerified"
  | "active"
  | "passwordResetToken"
  | "passwordResetExpires"
  | "passwordChangedAt"
  | "otp"
>;

export type NewCreatedUser = Omit<
  IUser,
  | "isEmailVerified"
  | "active"
  | "passwordResetToken"
  | "passwordResetExpires"
  | "passwordChangedAt"
>;

export interface IUserWithTokens {
  user: IUserDoc;
  // tokens: AccessAndRefreshTokens;
}
