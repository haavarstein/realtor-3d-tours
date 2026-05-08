"use client";

import { useState, useSyncExternalStore } from "react";
import { Copy, Check, ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const DEMO_VIEWER_URL =
  process.env.NEXT_PUBLIC_DEMO_SPLAT_URL ?? "https://superspl.at/";

const noopSubscribe = () => () => {};

type Props = {
  tourId: string;
};

export function TourViewer({ tourId }: Props) {
  const viewerUrl = DEMO_VIEWER_URL;
  const shareUrl = useSyncExternalStore(
    noopSubscribe,
    () => `${window.location.origin}/tour/${tourId}`,
    () => ""
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const embedCode = `<iframe src="${shareUrl}" width="800" height="600" frameborder="0" allow="fullscreen; xr-spatial-tracking"></iframe>`;

  async function copy(value: string, kind: "link" | "embed") {
    try {
      await navigator.clipboard.writeText(value);
      if (kind === "link") {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 1500);
      } else {
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 1500);
      }
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Couldn't copy. Select the text and copy manually.");
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: "3D virtual tour",
          text: "Check out this property in 3D",
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      void copy(shareUrl, "link");
    }
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border bg-black shadow-sm">
        <div className="aspect-video w-full">
          <iframe
            src={viewerUrl}
            className="h-full w-full border-0"
            allow="fullscreen; xr-spatial-tracking; accelerometer; gyroscope"
            title="3D tour"
          />
        </div>
      </div>

      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Share this tour</h2>
              <p className="text-sm text-muted-foreground">
                Send the link, embed it on your listing site, or open it in 3D.
              </p>
            </div>
            <Button onClick={nativeShare} className="shrink-0">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="share-link">Shareable link</Label>
            <div className="flex gap-2">
              <Input
                id="share-link"
                readOnly
                value={shareUrl}
                onFocus={(e) => e.currentTarget.select()}
              />
              <Button
                variant="secondary"
                onClick={() => copy(shareUrl, "link")}
                className="shrink-0"
              >
                {copiedLink ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="embed-code">Embed code</Label>
            <textarea
              id="embed-code"
              readOnly
              value={embedCode}
              onFocus={(e) => e.currentTarget.select()}
              className="min-h-20 w-full resize-none rounded-md border bg-background px-3 py-2 font-mono text-xs text-muted-foreground"
            />
            <Button
              variant="secondary"
              onClick={() => copy(embedCode, "embed")}
              className="w-full sm:w-auto"
            >
              {copiedEmbed ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              Copy embed code
            </Button>
          </div>

          <Separator />

          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={viewerUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", className: "flex-1" })}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in 3D
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
