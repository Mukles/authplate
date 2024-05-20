"use server";

import { UserLogin, UserRegister } from "@/actions/user/types";
import { signIn } from "@/auth";
import { ExtractVariables, SubmitFormState } from "@/hooks/useSubmit";
import prisma from "@/lib/prismaClient";
import { registerSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import "server-only";
import { mutate } from "../index";

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

export async function login(
  prevState: SubmitFormState<UserLogin>,
  data: ExtractVariables<UserLogin>,
): Promise<SubmitFormState<UserLogin>> {
  signIn("credentials", data);
}
