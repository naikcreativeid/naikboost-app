const faqs = [
  {
    question: "Followers-nya beneran orang atau bot?",
    answer:
      "Layanan kami diarahkan untuk kualitas yang lebih meyakinkan, bukan akun kosong yang gampang kelihatan aneh. Fokusnya supaya tampilan akun kamu lebih siap dilihat orang baru.",
  },
  {
    question: "Akun saya bisa kena banned nggak?",
    answer:
      "Sejauh ini alur kami dibuat bertahap dan lebih natural. Kami juga tidak pernah minta password akun untuk order biasa.",
  },
  {
    question: "Kalau followers-nya turun, gimana?",
    answer:
      "Tenang, banyak paket kami punya garansi refill. Kalau turun di masa garansi, tinggal hubungi CS kami untuk bantu cek dan isi ulang.",
  },
  {
    question: "Bayar dulu atau dikirim dulu?",
    answer:
      "Untuk MVP ini pembayaran dilakukan dulu lewat transfer. Setelah bukti masuk dan diverifikasi, pesanan langsung diproses.",
  },
  {
    question: "Bisa buat akun pribadi atau cuma bisnis?",
    answer:
      "Bisa keduanya. Banyak juga yang pakai buat akun personal biar lebih percaya diri saat mulai aktif posting konten.",
  },
  {
    question: "Berapa lama pengirimannya?",
    answer:
      "Tergantung paketnya. Ada yang mulai cepat dalam beberapa jam, ada juga yang bertahap sampai 24-48 jam supaya tetap lebih aman.",
  },
  {
    question: "Kalau saya punya banyak akun, ada harga khusus?",
    answer:
      "Bisa. Untuk kebutuhan rutin atau banyak akun, paling enak langsung hubungi tim kami supaya dibantu pilih skema yang pas.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-20 sm:py-24">
      <div className="container">
        <div className="mb-14 text-center">
          <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.15] tracking-[-0.025em] text-[#0a1330]">
            Pertanyaan yang{" "}
            <span className="font-serif font-normal italic text-brand">
              Sering Ditanya
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[17px] text-[#4a5680]">
            Belum nemu jawaban? Chat CS kami, nanti dibantu dengan bahasa yang gampang
            dipahami.
          </p>
        </div>

        <div className="mx-auto max-w-[760px] space-y-[10px]">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="overflow-hidden rounded-xl border border-[#e6ecf7] bg-white open:border-brand"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-[22px] py-[18px] text-[15px] font-semibold text-[#0a1330] marker:content-none">
                <span>{faq.question}</span>
                <span className="text-[22px] font-light text-[#8590b0] transition-transform details-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-[22px] pb-5 text-[14px] leading-[1.65] text-[#4a5680]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
