import type { ReactNode } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppBubble } from "@/components/shared/WhatsAppBubble";
import { cn } from "@/lib/utils";

type PublicPageShellProps = {
  children: ReactNode;
  mainClassName?: string;
};

export function PublicPageShell({
  children,
  mainClassName,
}: PublicPageShellProps) {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className={cn(
          "pt-28 md:pt-36 pb-20 bg-school-neutral min-h-screen",
          mainClassName
        )}
      >
        {children}
      </main>
      <Footer />
      <WhatsAppBubble />
    </>
  );
}
