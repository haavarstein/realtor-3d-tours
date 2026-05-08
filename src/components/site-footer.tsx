import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Realtor3D. All rights reserved.</p>
        <p>
          Built with{" "}
          <Link
            href="https://superspl.at"
            className="font-medium text-foreground hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            SuperSplat
          </Link>{" "}
          +{" "}
          <Link
            href="https://claude.com/claude-code"
            className="font-medium text-foreground hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Claude
          </Link>
        </p>
      </div>
    </footer>
  );
}
