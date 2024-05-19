import { Model } from "mongoose";

export type UserType = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  profession: string;
  country: string;
  verified: boolean;
  role: "user";
  image?: string;
};

export type LoginResponse<T> = Partial<T> & {
  accessToken: string;
};

export type UserMethods = {
  isUserExist: (params: string) => Promise<Partial<UserType> | null>;
};

export type UserModel = Model<UserType, object, UserMethods>;
