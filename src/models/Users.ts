import { Schema, model, models } from "mongoose";

export interface UserDocument {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  image?: string;
  _id: string;
  isTermsAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "Fullname is required"],
      minLength: [3, "fullname must be at least 3 characters"],
      maxLength: [25, "fullname must be at most 25 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Fullname is required"],
      minLength: [3, "fullname must be at least 3 characters"],
      maxLength: [25, "fullname must be at most 25 characters"],
    },
    isTermsAccepted: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = models.User || model<UserDocument>("User", UserSchema);
export default User;
