import { ZodError } from "zod";

export function formatZodIssues({ issues }: ZodError): {
  path: string;
  message: string;
}[] {
  return issues.reduce<
    {
      path: string;
      message: string;
    }[]
  >((acc, issue) => {
    acc.push({
      path: issue.path.join("."),
      message: issue.message,
    });
    return acc;
  }, []);
}
