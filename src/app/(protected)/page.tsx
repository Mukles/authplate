import { auth } from "@/auth";

export default async function () {
  const { user } = (await auth()) || {};
  return (
    <div className="container min-h-screen">
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
