export type Tour = {
  id: string;
  title: string;
  createdAt: number;
  thumbnailUrl?: string;
  videoUrl?: string;
  splatUrl?: string;
};

const STORAGE_KEY = "realtor3d:tours";

const SAMPLE_THUMB =
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=70";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function listTours(): Tour[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Tour[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTour(tour: Tour): void {
  if (!isBrowser()) return;
  const tours = listTours();
  const next = [tour, ...tours.filter((t) => t.id !== tour.id)];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 50)));
}

export function getTour(id: string): Tour | undefined {
  return listTours().find((t) => t.id === id);
}

export function newTourId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function defaultThumbnail(): string {
  return SAMPLE_THUMB;
}

const SRC_KEY = (id: string) => `tour:${id}:src`;
const NAME_KEY = (id: string) => `tour:${id}:filename`;

export function setTourSource(id: string, src: string, filename: string): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(SRC_KEY(id), src);
  window.sessionStorage.setItem(NAME_KEY(id), filename);
}

export function getTourSource(
  id: string
): { src: string; filename: string } | null {
  if (!isBrowser()) return null;
  const src = window.sessionStorage.getItem(SRC_KEY(id));
  if (!src) return null;
  return {
    src,
    filename: window.sessionStorage.getItem(NAME_KEY(id)) ?? "tour.ply",
  };
}
