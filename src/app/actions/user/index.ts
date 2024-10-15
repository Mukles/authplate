"use server";

import connectDB from "@/db/connection";
import { formatZodIssues } from "@/lib/utils/formatZodIssues";
import User from "@/models/Users";
import bcrypt from "bcryptjs";
import "server-only";
import { ExtractVariables, SubmitFormState } from "../types";
import { registerSchema } from "./schema";
import { UserRegister } from "./types";

export const register = async (
  prevState: SubmitFormState<UserRegister>,
  data: ExtractVariables<UserRegister>,
): Promise<SubmitFormState<UserRegister>> => {
  // Validate data using registerSchema
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return {
      data: null,
      error: formatZodIssues(parsed.error), // Include validation errors for better feedback
      message: "Validation failed",
      isError: true,
      isSuccess: false,
      statusCode: 400,
    };
  }

  const { email, password, firstName, lastName, isTermsAccepted } = data;

  try {
    await connectDB();
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        data: null,
        error: [],
        message: "User already exists",
        isError: true,
        isSuccess: false,
        statusCode: 409, // Conflict status code for existing resource
      };
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      email,
      firstName,
      lastName,
      isTermsAccepted,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    const { password: _, _id, ...userWithoutPassword } = savedUser.toObject();

    return {
      data: userWithoutPassword,
      error: [],
      message: "User registered successfully",
      isError: false,
      isSuccess: true,
      statusCode: 201, // Created status code
    };
  } catch (error) {
    console.error("Error during user registration:", error);
    return {
      data: null,
      error: [],
      message: "An error occurred during registration",
      isError: true,
      isSuccess: false,
      statusCode: 500, // Internal Server Error
    };
  }
};
