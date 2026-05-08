import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TourList } from "@/components/tour-list";

export const metadata: Metadata = {
  title: "Dashboard — Realtor3D",
};

export default function DashboardPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
      <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your tours</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Recent uploads are saved on this device. Sign-in coming soon.
          </p>
        </div>
        <Link href="/upload" className={buttonVariants({ size: "lg" })}>
          <Plus className="mr-2 h-4 w-4" /> New tour
        </Link>
      </div>
      <TourList />
    </section>
  );
}
