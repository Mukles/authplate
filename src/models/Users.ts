import { Schema, model, models } from "mongoose";

export interface UserDocument {
  userId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  image?: string;
  _id: string;
  isTermsAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
  provider: "google" | "github" | "credential";
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
    userId: {
      type: String,
      required: [true, "userId is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [3, "First name must be at least 3 characters"],
      maxLength: [25, "First name must be at most 25 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minLength: [3, "Last name must be at least 3 characters"],
      maxLength: [25, "Last name must be at most 25 characters"],
    },
    provider: {
      type: String,
      enum: ["google", "github", "credential"],
      default: "credential",
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
