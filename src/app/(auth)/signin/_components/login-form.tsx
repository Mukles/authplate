"use client";

import { login } from "@/actions/user";
import { UserLogin } from "@/actions/user/types";
import { useSubmitForm } from "@/hooks/useSubmit";
import { loginSchema } from "@/lib/validation";
import { Button } from "@/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const { action: loginAction, state } = useSubmitForm<UserLogin>(login);
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "mukles.themefisher@gmail.com",
      password: "Mokles1234$",
    },
  });

  console.log(state);

  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit((data) => {
          startTransition(async () => {
            loginAction(data);
          });
        })}
      >
        <div className="mb-4">
          <FormField
            control={loginForm.control}
            name={"email"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="abc@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mb-4">
          <FormField
            control={loginForm.control}
            name={"password"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="py-2 px-4 font-bold w-full text-lg mt-4"
          disabled={isPending}
        >
          Login
          {isPending && <Loader2 className="size-5 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
};
export default LoginForm;
