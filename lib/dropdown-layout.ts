type TriggerBounds = { top: number; bottom: number; left: number; width: number };

/** Pick one side of the trigger and constrain the entire popup to the viewport. */
export function dropdownLayout(rect: TriggerBounds, viewportWidth: number, viewportHeight: number) {
  const margin = 12;
  const gap = 6;
  const below = Math.max(0, viewportHeight - rect.bottom - margin - gap);
  const above = Math.max(0, rect.top - margin - gap);
  const useBelow = below >= 220 || below >= above;
  const height = Math.min(320, useBelow ? below : above);
  const width = Math.min(Math.max(rect.width, 240), Math.max(0, viewportWidth - margin * 2));
  return {
    top: useBelow ? rect.bottom + gap : Math.max(margin, rect.top - height - gap),
    left: Math.min(Math.max(margin, rect.left), Math.max(margin, viewportWidth - width - margin)),
    width,
    height,
  };
}
