"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, AlertCircle, Video } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { defaultThumbnail, newTourId, saveTour } from "@/lib/tours";

const MAX_BYTES = 200 * 1024 * 1024;
const PROCESSING_DURATION_MS = 35_000;

type Stage = "idle" | "uploading" | "processing" | "done" | "error";

const PROCESSING_STEPS = [
  "Extracting frames from your video…",
  "Detecting camera path…",
  "Reconstructing 3D geometry…",
  "Generating Gaussian splats…",
  "Compositing tour…",
];

export function UploadFlow() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [procPct, setProcPct] = useState(0);
  const [procStep, setProcStep] = useState(0);

  function pickFile() {
    fileInputRef.current?.click();
  }

  function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    if (!f.type.startsWith("video/")) {
      setError("Please pick a video file.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("File too large. The maximum is 200 MB.");
      return;
    }
    setFile(f);
    void uploadFile(f);
  }

  function uploadFile(f: File): Promise<void> {
    return new Promise((resolve) => {
      setStage("uploading");
      setUploadPct(0);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");

      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          setUploadPct(Math.round((ev.loaded / ev.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadPct(100);
          startProcessing();
        } else {
          let msg = "Upload failed.";
          try {
            const body = JSON.parse(xhr.responseText) as { error?: string };
            if (body.error) msg = body.error;
          } catch {}
          setError(msg);
          setStage("error");
          toast.error(msg);
        }
        resolve();
      };

      xhr.onerror = () => {
        setError("Network error while uploading.");
        setStage("error");
        toast.error("Network error while uploading.");
        resolve();
      };

      const fd = new FormData();
      fd.append("file", f);
      xhr.send(fd);
    });
  }

  function startProcessing() {
    setStage("processing");
    setProcPct(0);
    setProcStep(0);

    const id = newTourId();
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(99, Math.round((elapsed / PROCESSING_DURATION_MS) * 100));
      setProcPct(pct);
      setProcStep(
        Math.min(
          PROCESSING_STEPS.length - 1,
          Math.floor((pct / 100) * PROCESSING_STEPS.length)
        )
      );
      if (elapsed >= PROCESSING_DURATION_MS) {
        clearInterval(interval);
        setProcPct(100);
        saveTour({
          id,
          title: file?.name?.replace(/\.[^.]+$/, "") || "Untitled property",
          createdAt: Date.now(),
          thumbnailUrl: defaultThumbnail(),
        });
        toast.success("Tour ready");
        setStage("done");
        router.push(`/tour/${id}`);
      }
    }, 250);
  }

  if (stage === "uploading" || stage === "processing") {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="space-y-6 p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              {stage === "uploading" ? (
                <Upload className="h-5 w-5" />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}
            </span>
            <div>
              <h2 className="text-lg font-semibold">
                {stage === "uploading"
                  ? "Uploading your video…"
                  : "Generating your 3D tour…"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {stage === "uploading"
                  ? "Don't close this tab until the upload completes."
                  : PROCESSING_STEPS[procStep]}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={stage === "uploading" ? uploadPct : procPct} />
            <p className="text-right text-xs tabular-nums text-muted-foreground">
              {stage === "uploading" ? uploadPct : procPct}%
            </p>
          </div>
          {file && (
            <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
              <Video className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{file.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(1)} MB
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="space-y-6 p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Upload className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Upload your walkthrough
          </h2>
          <p className="text-sm text-muted-foreground">
            Pick the video you just recorded on your phone. We&apos;ll handle
            the rest.
          </p>
        </div>
        <Button
          size="lg"
          className="h-14 w-full text-base shadow-md"
          onClick={pickFile}
        >
          <Upload className="mr-2 h-5 w-5" />
          Choose video
        </Button>
        <p className="text-xs text-muted-foreground">
          MP4 / MOV / WebM &middot; up to 200 MB
        </p>
        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-left text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          capture="environment"
          className="hidden"
          onChange={onFileChosen}
        />
      </CardContent>
    </Card>
  );
}
