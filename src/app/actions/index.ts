"use server";

import jwt from "jsonwebtoken";
import "server-only";
import { SubmitFormState } from "./types";

export async function mutate<T>(
  callback: () => Promise<any>,
): Promise<SubmitFormState<T>> {
  try {
    const { message, data, statusCode, isError, error, isSuccess } =
      (await callback()) || {};
    return {
      data: data as T,
      error,
      message,
      isError,
      isSuccess,
      statusCode,
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        data: null,
        isError: true,
        isSuccess: false,
        error: [],
        message: err.message,
        statusCode: 500,
      };
    }

    return {
      data: null,
      isError: true,
      isSuccess: false,
      error: [],
      message: "Something went wrong",
      statusCode: 500,
    };
  }
}

// Define a secret key for signing tokens
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const generateToken = (userId: string, email: string): string => {
  // Generate JWT token
  return jwt.sign(
    { id: userId, email }, // Payload
    JWT_SECRET, // Secret key
    { expiresIn: "1h" }, // Token expiration
  );
};
