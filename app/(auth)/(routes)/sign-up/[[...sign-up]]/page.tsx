import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { isClerkEnabled } from "@/lib/auth";

export default function Page() {
  if (!isClerkEnabled) redirect("/"); // dev auth mode: already signed in
  return <SignUp />;
};
