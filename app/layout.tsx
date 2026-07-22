import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Barlow_Condensed({ variable: "--font-display", subsets: ["latin"], weight: ["600", "700", "800", "900"] });
const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://eu-quero-que-voc-crie-o-4.vercel.app"),
  title: "Futebol em Jogo VIP — +250 dinâmicas e bônus",
  description: "+250 atividades visuais, bônus exclusivos e área VIP para criar treinos infantis inesquecíveis.",
  icons: { icon: "/favicon.svg" },
  openGraph: { title: "+250 dinâmicas. Zero treino parado.", description: "A caixa de ferramentas visual do treinador de futebol infantil." },
  twitter: { card: "summary", title: "+250 dinâmicas. Zero treino parado.", description: "A caixa de ferramentas visual do treinador de futebol infantil." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
