"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";

type Status = "loading" | "ready" | "error";

type Props = {
  src: string;
  filename?: string;
};

export function SplatViewer({ src, filename }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let viewer: { dispose: () => Promise<void>; stop: () => void } | null = null;

    (async () => {
      try {
        const mod = await import("@mkkellogg/gaussian-splats-3d");
        if (cancelled) return;

        const v = new mod.Viewer({
          rootElement: container,
          cameraUp: [0, -1, 0],
          initialCameraPosition: [0, 1, 4],
          initialCameraLookAt: [0, 0, 0],
          sharedMemoryForWorkers: false,
          sphericalHarmonicsDegree: 0,
          dynamicScene: false,
          antialiased: false,
          ignoreDevicePixelRatio: false,
        });

        await v.addSplatScene(src, {
          format: mod.SceneFormat.Ply,
          showLoadingUI: false,
          splatAlphaRemovalThreshold: 5,
          progressiveLoad: false,
        });

        if (cancelled) {
          await v.dispose();
          return;
        }

        v.start();
        viewer = v;
        setStatus("ready");
      } catch (err) {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : "Couldn't load the splat file.";
          setError(msg);
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
      if (viewer) {
        try {
          viewer.stop();
        } catch {}
        void viewer.dispose().catch(() => {});
      }
      // Clean up any canvas/DOM the viewer attached
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [src]);

  return (
    <div className="relative h-[78vh] min-h-[480px] w-full overflow-hidden rounded-xl border bg-black shadow-sm">
      <div ref={containerRef} className="absolute inset-0" />
      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center bg-black/70 text-white">
          <div className="text-center">
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Rendering 3D tour…</p>
            {filename && (
              <p className="mt-1 text-xs text-white/60">{filename}</p>
            )}
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-black/80 p-6 text-white">
          <div className="max-w-md text-center">
            <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-400" />
            <p className="font-semibold">Couldn&apos;t render this .ply file</p>
            <p className="mt-2 text-sm text-white/70">{error}</p>
            <p className="mt-3 text-xs text-white/50">
              Make sure it&apos;s a Gaussian Splat .ply (not a mesh .ply).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
