/**
 * Nappe d'ambiance fixe : trois masses beige floutées qui dérivent
 * lentement. Seul `transform` est animé — le flou est rasterisé une fois.
 */
export function BackgroundBlobs() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="blob blob-a -left-[14vw] -top-[18vh] h-[clamp(340px,52vw,760px)] w-[clamp(340px,52vw,760px)] opacity-80" />
      <div className="blob blob-b -right-[16vw] top-[38vh] h-[clamp(300px,44vw,660px)] w-[clamp(300px,44vw,660px)] opacity-70" />
      <div className="blob blob-c bottom-[-22vh] left-[22vw] h-[clamp(280px,40vw,620px)] w-[clamp(280px,40vw,620px)] opacity-60" />
    </div>
  );
}
