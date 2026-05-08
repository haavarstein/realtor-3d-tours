"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { FileBox, Upload } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SplatViewer } from "@/components/splat-viewer";

type Props = {
  tourId: string;
};

const noopSubscribe = () => () => {};

export function TourViewer({ tourId }: Props) {
  const src = useSyncExternalStore(
    noopSubscribe,
    () => window.sessionStorage.getItem(`tour:${tourId}:src`) ?? "",
    () => ""
  );
  const filename = useSyncExternalStore(
    noopSubscribe,
    () => window.sessionStorage.getItem(`tour:${tourId}:filename`) ?? "",
    () => ""
  );

  if (!src) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <FileBox className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">No tour data on this device</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              This mockup keeps tours in your browser session. Upload a .ply
              file to view it here.
            </p>
          </div>
          <Link href="/upload" className={buttonVariants({ size: "lg" })}>
            <Upload className="mr-2 h-4 w-4" /> Upload a .ply
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <SplatViewer src={src} filename={filename || undefined} />
      {filename && (
        <p className="text-xs text-muted-foreground">
          Viewing <span className="font-mono">{filename}</span> &middot; drag to
          orbit, scroll to zoom, right-click drag to pan.
        </p>
      )}
    </div>
  );
}
