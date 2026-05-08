"use client";

import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Boxes } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Tour } from "@/lib/tours";

const STORAGE_KEY = "realtor3d:tours";

function subscribeToStorage(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStorageSnapshot(): string {
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

function getServerSnapshot(): string | null {
  return null;
}

export function TourList() {
  const raw = useSyncExternalStore(
    subscribeToStorage,
    getStorageSnapshot,
    getServerSnapshot
  );
  const tours = useMemo<Tour[] | null>(() => {
    if (raw === null) return null;
    if (raw === "") return [];
    try {
      const parsed = JSON.parse(raw) as Tour[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [raw]);

  if (tours === null) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Boxes className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">No tours yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload your first walkthrough to create a 3D tour.
            </p>
          </div>
          <Link href="/upload" className={buttonVariants({ size: "lg" })}>
            <Plus className="mr-2 h-4 w-4" /> New tour
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tours.map((t) => (
        <Link key={t.id} href={`/tour/${t.id}`} className="group">
          <Card className="overflow-hidden p-0 transition-shadow hover:shadow-md">
            <div className="relative aspect-video bg-muted">
              {t.thumbnailUrl && (
                <Image
                  src={t.thumbnailUrl}
                  alt={t.title}
                  fill
                  sizes="(min-width: 1024px) 320px, 50vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="truncate text-sm font-semibold">{t.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(t.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
