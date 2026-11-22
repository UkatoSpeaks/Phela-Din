/**
 * Shared SVG filter defs, rendered once in the root layout.
 *   #pd-ink: roughens edges and makes ink patchy, like a rubber stamp.
 * Use via `filter: url(#pd-ink)` (see Stamp).
 */
export function InkFilters() {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" className="pointer-events-none absolute">
      <defs>
        <filter id="pd-ink" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="11" result="speck" />
          <feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 2.05" result="mask" />
          <feComposite in="rough" in2="mask" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}
