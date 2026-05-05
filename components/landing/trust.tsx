import {
  BadgeCheck,
  LockKeyhole,
  MessageCircleMore,
  ShieldCheck,
  TimerReset,
  Wallet,
} from "lucide-react";

const trustItems = [
  {
    title: "Nggak Perlu Password",
    text: "Kami cuma butuh link akun atau postingan kamu. Data login aman 100%.",
    icon: LockKeyhole,
  },
  {
    title: "Pengiriman Bertahap",
    text: "Masuk pelan-pelan biar kelihatan lebih natural dan nggak bikin akun tegang.",
    icon: TimerReset,
  },
  {
    title: "Garansi Refill 30-90 Hari",
    text: "Followers turun? Chat CS, kami isi ulang sesuai masa garansi layanan.",
    icon: ShieldCheck,
  },
  {
    title: "CS WhatsApp Cepat",
    text: "Kalau ada masalah atau bingung, kamu bisa langsung chat tim kami.",
    icon: MessageCircleMore,
  },
  {
    title: "Pembayaran Aman",
    text: "Transfer bank dan bukti pembayaran dicek dengan alur yang rapi.",
    icon: Wallet,
  },
  {
    title: "Dipakai Banyak Customer",
    text: "Sudah dipakai bisnis dan creator dari banyak kota di Indonesia.",
    icon: BadgeCheck,
  },
];

export function Trust() {
  return (
    <section className="bg-[#f5f8ff] py-20 sm:py-24">
      <div className="container">
        <div className="mb-14 text-center">
          <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.15] tracking-[-0.025em] text-[#0a1330]">
            Tenang, Akun Kamu{" "}
            <span className="font-serif font-normal italic text-brand">Aman</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[17px] text-[#4a5680]">
            Kami tahu akun sosial media itu aset berharga. Itu kenapa kami serius soal
            keamanan dan proses yang nyaman.
          </p>
        </div>

        <div className="mx-auto grid max-w-[760px] gap-3 md:grid-cols-2">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3.5 rounded-xl border border-[#e6ecf7] bg-white px-[18px] py-4"
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#d1fae5] text-[#10b981]">
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#0a1330]">{item.title}</h4>
                <p className="mt-1 text-[13px] leading-[1.5] text-[#4a5680]">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
