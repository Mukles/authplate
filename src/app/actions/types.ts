export type SubmitFormState<T> = {
  data: Omit<T, "variables"> | null;
  error: {
    path: string;
    message: string;
  }[];
  message: string | null;
  isError: boolean;
  isSuccess: boolean;
  statusCode: number | null;
};

export type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export type SubmitFormCallbacks<T> = {
  onSuccess?: (state: SubmitFormState<T>, ref: React.RefObject<any>) => void;
  onError?: (state: SubmitFormState<T>, ref: React.RefObject<any>) => void;
};
