"use server";

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
