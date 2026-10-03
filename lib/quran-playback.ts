type Timing = { number: number; from: number; to: number };
export type PracticeRange = { first: number; last: number; from: number; to: number; repeats: number };

export function practiceRange(timings: readonly Timing[], first: number, last: number, repeats: number): PracticeRange | null {
  if (![first, last, repeats].every(Number.isInteger) || first < 1 || last < first || repeats < 1 || repeats > 10) return null;
  const selected = timings.filter((timing) => timing.number >= first && timing.number <= last);
  if (selected.length !== last - first + 1 || selected.some((timing, index) =>
    timing.number !== first + index || !Number.isFinite(timing.from) || !Number.isFinite(timing.to) ||
    timing.from < 0 || timing.to <= timing.from || (index > 0 && timing.from < selected[index - 1].to))) return null;
  return { first, last, from: selected[0].from, to: selected.at(-1)!.to, repeats };
}

export function practiceBoundary(seconds: number, range: PracticeRange, round: number) {
  if (seconds * 1000 < range.from) return { action: "seek" as const, round, seek: range.from / 1000 };
  if (seconds * 1000 < range.to) return { action: "continue" as const, round };
  return round < range.repeats
    ? { action: "repeat" as const, round: round + 1, seek: range.from / 1000 }
    : { action: "complete" as const, round, seek: range.to / 1000 };
}
