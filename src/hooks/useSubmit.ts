import {
  ExtractVariables,
  SubmitFormCallbacks,
  SubmitFormState,
} from "@/actions/types";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export function useSubmitForm<T>(
  serverAction: (
    prevState: SubmitFormState<Omit<T, "variables">>,
    data: ExtractVariables<T>,
  ) => Promise<SubmitFormState<Omit<T, "variables">>>,
  { onSuccess, onError }: SubmitFormCallbacks<T> = {},
) {
  const ref = useRef<any>(null);
  // @ts-ignore
  const [state, formAction] = useFormState<SubmitFormState<T>>(serverAction, {
    data: null,
    error: null,
    status: null,
    message: null,
    isError: false,
    isSuccess: false,
    statusCode: null,
  });

  useEffect(() => {
    if (state?.isError) {
      typeof onError === "function"
        ? onError(state, ref)
        : toast.error(state?.message);
    }

    if (state?.isSuccess) {
      typeof onSuccess === "function"
        ? onSuccess(state, ref)
        : toast.success(state?.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return {
    state,
    ref,
    // @ts-ignore
    action: formAction as (
      data: ExtractVariables<T>,
    ) => Promise<SubmitFormState<T>>,
  };
}
