"use client";
import { otpSender, resendOtp } from "@/app/action";
import useResponse from "@/hooks/useResponse";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import SubmitButton from "./SubmitButton";

const OtpVerifyForm = ({ urlParams }: { urlParams: any }) => {
  const reset = useSearchParams().get("reset");
  const updateUserWithId = otpSender.bind(
    null,
    urlParams.email,
    new Date().toISOString(),
    reset,
  );
  const { dispatch, error } = useResponse(updateUserWithId);
  const resendAction = resendOtp.bind(
    null,
    new Date().toISOString(),
    urlParams.email,
  );
  return (
    <>
      <form className="mx-auto max-w-md" action={dispatch}>
        <div className="mb-4">
          {/* <LabelField htmlFor="otp" label="OTP" /> */}
          <label htmlFor="otp">OTP</label>
          <input
            type="text"
            id="otp"
            className="w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-none focus:ring-0"
            placeholder="* * * *"
            name="otp"
            required
          />
        </div>
        {/* <div className="mb-2">
        <small className="text-red-600">{error}</small>
      </div> */}
        <SubmitButton
          label="Submit"
          pending_label="Submitting..."
          className=""
        />
      </form>
      <form action={resendAction} className="mt-4 mx-auto max-w-md">
        Don't get otp? <span className="text-green-700">resend</span>
      </form>
    </>
  );
};


