import {
  BarChart3,
  Clock3,
  Flame,
  ImageIcon,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
} from "lucide-react";

const features = [
  {
    title: "Instagram",
    text: "Followers, likes, views Reels, story views, komentar dengan kualitas yang lebih meyakinkan.",
    icon: ImageIcon,
    tag: "POPULER",
  },
  {
    title: "TikTok",
    text: "Followers, likes, views, dan shares untuk bantu konten kamu masuk FYP lebih cepat.",
    icon: Sparkles,
  },
  {
    title: "YouTube",
    text: "Subscribers, views, likes, dan watch time untuk bantu channel terlihat lebih siap monetisasi.",
    icon: PlayCircle,
  },
  {
    title: "Facebook",
    text: "Page likes, followers, dan reactions buat bisnis yang masih aktif jualan lewat Facebook.",
    icon: ThumbsUp,
  },
  {
    title: "Engagement Boost",
    text: "Komentar custom, mention, dan interaksi tambahan biar postingan terasa lebih hidup.",
    icon: BarChart3,
  },
  {
    title: "Launching Booster",
    text: "Paket khusus untuk hari pertama promo atau launching biar momentum awalnya nggak kebuang.",
    icon: Flame,
  },
  {
    title: "Garansi Refill",
    text: "Kalau layanan tertentu turun dalam masa garansi, tinggal hubungi kami untuk isi ulang.",
    icon: ShieldCheck,
    tag: "FREE",
  },
  {
    title: "Pengiriman Cepat",
    text: "Mulai diproses dalam hitungan menit, lalu dikirim bertahap biar kelihatan lebih natural.",
    icon: Clock3,
  },
];

export function Features() {
  return (
    <section id="layanan" className="bg-[#f5f8ff] py-20 sm:py-24">
      <div className="container">
        <div className="mb-14 text-center">
          <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.15] tracking-[-0.025em] text-[#0a1330]">
            Semua yang Kamu Butuhin{" "}
            <span className="font-serif font-normal italic text-brand">
              dalam Satu Tempat
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[17px] text-[#4a5680]">
            Layanan lengkap untuk Instagram, TikTok, YouTube, dan Facebook dengan
            tampilan yang simpel dan gampang dipilih.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-[#e6ecf7] bg-white p-[22px] transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_4px_16px_rgba(10,19,48,0.06)]"
            >
              <div className="grid h-[38px] w-[38px] place-items-center rounded-[9px] bg-brand-50 text-brand">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 flex items-center gap-2 text-[15px] font-bold text-[#0a1330]">
                {feature.title}
                {feature.tag ? (
                  <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold tracking-[0.04em] text-white">
                    {feature.tag}
                  </span>
                ) : null}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.55] text-[#4a5680]">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
