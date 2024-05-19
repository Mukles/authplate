import mongoose, { model } from "mongoose";
import { OtpVerificationType } from "../types/index.type";

// passowrd verification token model
export const otpVerificationSchema = new mongoose.Schema<OtpVerificationType>(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expires: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const OtpVerification =
  mongoose.models.otp_verification ||
  model<OtpVerificationType>("otp_verification", otpVerificationSchema);
