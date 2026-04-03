export function HeroIllustration() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(44,184,242,0.22),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02)),#0c1623] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.3)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(242,201,76,0.12),transparent_26%)]" />
      <div className="relative grid h-full gap-4">
        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>

        <div className="grid flex-1 grid-cols-[1.1fr_0.9fr] gap-4">
          <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-5">
            <div className="mb-4 h-3 w-24 rounded-full bg-white/12" />
            <div className="mb-6 space-y-3">
              <div className="h-4 w-4/5 rounded-full bg-sky-300/30" />
              <div className="h-4 w-3/5 rounded-full bg-white/12" />
            </div>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <div className="mb-2 h-3 w-20 rounded-full bg-emerald-300/30" />
                <div className="h-8 w-24 rounded-2xl bg-emerald-300/18" />
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <div className="mb-2 h-3 w-16 rounded-full bg-amber-300/30" />
                <div className="h-8 w-28 rounded-2xl bg-amber-300/18" />
              </div>
            </div>
          </div>

          <div className="relative rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="absolute right-5 top-5 h-20 w-20 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f2c94c,rgba(242,201,76,0.1))]" />
            <div className="absolute bottom-0 left-1/2 h-36 w-32 -translate-x-1/2 rounded-t-[100px] bg-sky-300/18" />
            <div className="absolute bottom-24 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-slate-200/90" />
            <div className="absolute bottom-2 left-4 right-4 rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
              <div className="mb-2 h-3 w-28 rounded-full bg-white/15" />
              <div className="h-3 w-20 rounded-full bg-sky-300/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
