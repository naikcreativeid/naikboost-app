const steps = [
  {
    number: "01",
    title: "Pilih Layanan",
    text: "Mau tambah followers, likes, views, atau komentar? Tinggal pilih sesuai kebutuhan akun kamu.",
  },
  {
    number: "02",
    title: "Masukin Link Akun",
    text: "Cuma butuh link akun atau postingan, nggak perlu password. Akun kamu tetap aman karena kami nggak pernah minta data login.",
  },
  {
    number: "03",
    title: "Tunggu Hasilnya",
    text: "Pesanan masuk bertahap biar aman dan natural. Biasanya dalam 1-24 jam hasilnya mulai kelihatan di akun kamu.",
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="py-20 sm:py-24">
      <div className="container">
        <div className="mb-14 text-center">
          <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.15] tracking-[-0.025em] text-[#0a1330]">
            Cara Kerjanya{" "}
            <span className="font-serif font-normal italic text-brand">
              Simpel Banget
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[17px] text-[#4a5680]">
            Cuma 3 langkah dari daftar sampai hasilnya kelihatan di akun kamu.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-[18px] border border-[#e6ecf7] bg-white p-7"
            >
              <div className="font-serif text-[56px] italic leading-none text-brand">
                {step.number}
              </div>
              <h3 className="mt-4 text-[18px] font-bold tracking-[-0.01em] text-[#0a1330]">
                {step.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-[#4a5680]">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
