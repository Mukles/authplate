"use server";

import { UserLogin, UserRegister } from "@/actions/user/types";
import { signIn } from "@/auth";
import { ExtractVariables, SubmitFormState } from "@/hooks/useSubmit";
import prisma from "@/lib/prismaClient";
import { loginSchema, registerSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { AuthError } from "next-auth";
import "server-only";
import { mutate, prismaExclude } from "../index";

export const createUser = async (
  prevState: SubmitFormState<UserRegister>,
  data: ExtractVariables<UserRegister>,
): Promise<SubmitFormState<UserRegister>> => {
  const userData = data;

  const validate = registerSchema.safeParse(userData);
  if (!validate.success) {
    return {
      data: null,
      error: [],
      message: null,
      isError: true,
      isSuccess: false,
      statusCode: 400,
    };
  }

  return await mutate<UserRegister>(async () => {
    const email = userData.email;
    const password = userData.password;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return {
        data: null,
        error: [],
        message: "User already exit!",
        isError: true,
        isSuccess: false,
        statusCode: 409,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    try {
      await prisma.$connect();
      delete data.confirmPassword;
      const newUser = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      return {
        data: newUser,
        error: [],
        message: "user created successfully!",
        isError: false,
        isSuccess: true,
        statusCode: 201,
      };
    } catch (error) {
      return {
        data: null,
        error: [],
        isError: true,
        // @ts-ignore
        message: error.message,
        statusCode: 500,
      };
    }
  });
};

export const login2 = async (
  data: ExtractVariables<UserLogin>,
): Promise<SubmitFormState<UserLogin>> => {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return {
      data: null,
      error: [],
      message: null,
      isError: true,
      isSuccess: false,
      statusCode: null,
    };
  }
  return await mutate<UserLogin>(async () => {
    await prisma.$connect();
    const user = await prisma.user.findFirst({
      where: { email: data.email },
      select: prismaExclude("User", ["password"]),
    });
    if (!user) {
      return {
        data: null,
        error: [],
        isError: true,
        message: "User not found!",
        statusCode: 500,
      };
    }

    const isMatch = bcrypt.compare(data.password, user.email);

    if (!isMatch) {
      throw Error("Incorrect password");
    }

    const accessToken = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET as Secret,
      {
        expiresIn: process.env.JWT_EXPIRES,
      },
    );
  });
};

export async function login(data: ExtractVariables<UserLogin>) {
  try {
    signIn("credentials", data);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { message: error.message };
        }
        default: {
          return { message: "Something went wrong!" };
        }
      }
    }
  }
}
