import mongoose, { model } from "mongoose";
import { UserMethods, UserModel, UserType } from "./user.type";

const userSchema = new mongoose.Schema<UserType, UserModel, UserMethods>(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      min: [8, "Must be at least 8, got {VALUE}"],
      max: 12,
    },
    profession: {
      type: String,
    },
    country: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.isUserExist = async function (
  params: string,
): Promise<Partial<UserType> | null> {
  return await User.findOne(
    {
      $or: [
        {
          email: params,
        },
        {
          id: params,
        },
      ],
    },
    {
      id: 1,
      email: 1,
      password: 1,
      first_name: 1,
      last_name: 1,
      country: 1,
      image: 1,
      verified: 1,
      role: 1,
      profession: 1,
    },
  );
};

userSchema.index({
  email: "text",
  id: "text",
});

export const User =
  mongoose.models.user || model<UserType, UserModel>("user", userSchema);
