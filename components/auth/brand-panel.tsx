export function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden lg:flex">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_35%),linear-gradient(160deg,#2d5cf6_0%,#1939a8_55%,#0f172a_100%)]" />
      <div className="absolute -left-16 top-24 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-16 right-0 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-black">
            NB
          </div>
          <div>
            <p className="text-lg font-bold">NaikBoost</p>
            <p className="text-sm text-white/80">Bagian dari NaikGroup</p>
          </div>
        </div>

        <div className="max-w-md space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/75">
            Algorithm Boost Service untuk Bisnis & Creator Serius
          </p>
          <h2 className="text-4xl font-black leading-tight">
            Bantu akun kamu terlihat lebih siap, lebih ramai, dan lebih meyakinkan.
          </h2>
          <p className="text-lg leading-8 text-white/80">
            NaikBoost dibuat untuk orang yang ingin proses cepat, jelas, dan gampang
            dipahami tanpa bahasa yang ribet.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur">
          <p className="text-sm text-white/75">Kenapa banyak yang pilih NaikBoost?</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-2xl font-bold">Cepat</p>
              <p className="text-sm text-white/75">Mulai proses tanpa bikin bingung.</p>
            </div>
            <div>
              <p className="text-2xl font-bold">Aman</p>
              <p className="text-sm text-white/75">Alur rapi untuk bisnis dan creator.</p>
            </div>
            <div>
              <p className="text-2xl font-bold">Ramah</p>
              <p className="text-sm text-white/75">Bahasa support mudah dimengerti.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
