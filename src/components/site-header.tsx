import Link from "next/link";
import { Boxes } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Boxes className="h-4 w-4" />
          </span>
          <span className="text-base tracking-tight">Realtor3D</span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Dashboard
          </Link>
          <Link href="/upload" className={buttonVariants({ size: "sm" })}>
            Upload Video
          </Link>
        </nav>
        <div className="sm:hidden">
          <Link href="/upload" className={buttonVariants({ size: "sm" })}>
            Upload
          </Link>
        </div>
      </div>
    </header>
  );
}
