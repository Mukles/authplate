"use server";

import { signIn } from "@/auth";
import connectDB from "@/db/connection";
import { formatZodIssues } from "@/lib/utils/formatZodIssues";
import User from "@/models/Users";
import bcrypt from "bcryptjs";
import { HydratedDocument } from "mongoose";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import "server-only";
import { v4 as uuidv4 } from "uuid";
import { generateToken } from "..";
import { ExtractVariables, SubmitFormState } from "../types";
import { loginSchema, registerSchema } from "./schema";
import { UserLogin, UserRegister } from "./types";

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

    // Generate a unique user ID
    const userId = uuidv4(); // Generate a unique ID

    // Create a new user instance
    const newUser = new User({
      userId,
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

export const loginUser = async ({
  email,
  password,
}: ExtractVariables<UserLogin>): Promise<SubmitFormState<UserLogin>> => {
  try {
    await connectDB();

    // Find the user by email
    const user = await User.findOne({ email }).select("+password"); // Include password field

    if (!user) {
      return {
        data: null,
        error: [],
        message: "User not found",
        isError: true,
        isSuccess: false,
        statusCode: 404,
      };
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        data: null,
        error: [],
        message: "Invalid password",
        isError: true,
        isSuccess: false,
        statusCode: 401,
      };
    }

    // Exclude the password from the response
    const { password: _, _id, ...userWithoutPassword } = user.toObject();

    const token = generateToken(user.userId, user.email);

    return {
      data: {
        ...userWithoutPassword,
        token,
      },
      error: [],
      message: "Login successful",
      isError: false,
      isSuccess: true,
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error during user login:", error);
    return {
      data: null,
      error: [],
      message: "An error occurred during login",
      isError: true,
      isSuccess: false,
      statusCode: 500,
    };
  }
};

export const login = async (
  prevState: SubmitFormState<UserLogin>,
  data: ExtractVariables<UserLogin>,
): Promise<SubmitFormState<UserLogin>> => {
  const parsed = loginSchema.safeParse(data);

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

  try {
    await signIn("credentials", data);
    return {
      data: null,
      error: [],
      message: "Validation failed",
      isError: true,
      isSuccess: false,
      statusCode: 400,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      redirect("/");
    }
    return {
      data: null,
      error: [],
      message: "Something went wrong",
      isError: true,
      isSuccess: false,
      statusCode: 400,
    };
  }
};

export const updateUser = async (
  data: Omit<ExtractVariables<UserRegister>, "password">,
): Promise<SubmitFormState<UserRegister>> => {
  try {
    await connectDB();
    console.log({ step1: data });

    // Try to find the user by email
    let user: HydratedDocument<UserRegister> | null = await User.findOne({
      email: data.email,
    });

    console.log({ step2: user });

    // If the user does not exist, create a new user
    if (!user) {
      try {
        console.log({ data });
        const newUser = new User(data);
        user = await newUser.save();
        return {
          data: user,
          error: [],
          message: "New user created successfully",
          isError: false,
          isSuccess: true,
          statusCode: 201,
        };
      } catch (error) {
        console.error("Error during user creation:", { error });
        return {
          data: null,
          error: [],
          message: "An error occurred during user creation",
          isError: true,
          isSuccess: false,
          statusCode: 500,
        };
      }
    }

    // Exclude userId from data before updating
    const { userId, ...updateData } = data;

    // Update the user without modifying userId
    const updatedUser = await User.findOneAndUpdate(
      { email: data.email },
      {
        $set: {
          ...updateData,
        },
      },
      { new: true },
    ).select("-password -_id"); // Exclude password and _id from the result

    return {
      data: updatedUser,
      error: [],
      message: "User updated successfully",
      isError: false,
      isSuccess: true,
      statusCode: 200,
    };
  } catch (error) {
    console.log({ step2Error: error });
    return {
      data: null,
      error: [],
      message: "An error occurred during user update or creation",
      isError: true,
      isSuccess: false,
      statusCode: 500,
    };
  }
};
