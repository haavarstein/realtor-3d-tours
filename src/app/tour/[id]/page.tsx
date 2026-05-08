import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TourViewer } from "@/components/tour-viewer";

export const metadata: Metadata = {
  title: "3D Tour — Realtor3D",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TourPage({ params }: Props) {
  const { id } = await params;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to tours
        </Link>
        <span className="text-xs text-muted-foreground">Tour #{id}</span>
      </div>
      <TourViewer tourId={id} />
    </section>
  );
}
