// A strip pinned to the bottom of the viewport that blurs whatever scrolls
// under it, stronger toward the edge. One backdrop-filter can only blur by a
// single amount, so the gradient is faked with eight stacked layers, each
// doubling the blur and masked to its own overlapping band.
const LAYERS = 8;

export function ProgressiveBlur({ height = 80 }: { height?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30"
      style={{ height }}
    >
      {Array.from({ length: LAYERS }, (_, i) => {
        const step = 100 / LAYERS;
        const mask = `linear-gradient(to bottom, transparent ${i * step}%, black ${(i + 1) * step}%, black ${(i + 2) * step}%, transparent ${(i + 3) * step}%)`;
        const blur = `blur(${0.5 * 2 ** i}px)`;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: blur,
              WebkitBackdropFilter: blur,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
