const problems = [
  {
    title: "Konten Sepi Padahal Udah Niat",
    text: "Udah edit berjam-jam, caption udah panjang, hashtag udah lengkap. Tapi yang lihat cuma 30-50 orang. Capek, kan?",
  },
  {
    title: "Calon Customer Kabur Sebelum Beli",
    text: "Mereka cek IG kamu dulu sebelum transfer. Lihat followers cuma 200, mereka jadi ragu padahal produk kamu bagus.",
  },
  {
    title: "Mau Endorse Tapi Brand Nggak Lirik",
    text: "Brand pakai sistem otomatis buat cari influencer. Followers di bawah 5.000? Akun kamu nggak akan pernah muncul di radar mereka.",
  },
];

const solutions = [
  {
    title: "Konten Mulai Disebar ke Lebih Banyak Orang",
    text: "Akun kamu mulai dilihat sistem Instagram atau TikTok, lalu kontennya dibawa ke FYP atau Explore.",
  },
  {
    title: "Calon Customer Lebih Yakin & Cepat Closing",
    text: "Followers banyak bikin akun kelihatan lebih meyakinkan. Calon customer jadi nggak ragu buat lanjut beli.",
  },
  {
    title: "Akun Kamu Masuk Radar Brand & Sponsor",
    text: "Threshold followers terlewati. Brand mulai bisa nemuin akun kamu saat mereka cari creator yang cocok.",
  },
];

export function ProblemSolution() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container">
        <div className="mb-14 text-center">
          <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.15] tracking-[-0.025em] text-[#0a1330]">
            Pernah Ngalamin{" "}
            <span className="font-serif font-normal italic text-brand">Hal Ini?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[17px] text-[#4a5680]">
            Tiga masalah klasik yang bikin akun kamu jalan di tempat dan cara
            NaikBoost ngebantu.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {problems.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[#fecaca] bg-[#fee2e2] px-[22px] py-5"
            >
              <h3 className="text-[15px] font-bold text-[#7f1d1d]">
                <span className="mr-1.5 font-extrabold text-[#ef4444]">✗</span>
                {item.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-[#991b1b]">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {solutions.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[#a7f3d0] bg-[#d1fae5] px-[22px] py-5"
            >
              <h3 className="text-[15px] font-bold text-[#064e3b]">
                <span className="mr-1.5 font-extrabold text-[#10b981]">✓</span>
                {item.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-[#065f46]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
