import RegisterForm from "@/components/Form/RegistrationForm";

export default function Register() {
  return (
    <>
      <div className="text-center mb-12">
        <h1 className="h2 font-semibold">Sign up to your account</h1>
      </div>
      <RegisterForm />
      <div className="relative w-full h-[1px] bg-[#B3B8C2] mb-4">
        <span className="absolute bg-light z-10 inline-block left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2">
          Or Continue With
        </span>
      </div>
    </>
  );
}
