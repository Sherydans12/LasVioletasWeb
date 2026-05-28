import { auth } from "@/auth";
import { HIDDEN_LOGIN_PATH } from "@/lib/auth-routes";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect(`${HIDDEN_LOGIN_PATH}?callbackUrl=/admin`);
  }
  return (
    <div className="min-h-screen w-full overflow-x-hidden">{children}</div>
  );
}
