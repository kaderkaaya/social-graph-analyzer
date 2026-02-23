import "./globals.css";

export const metadata = {
  title: "Social Graph Analyzer — GitHub Takip Analizi",
  description:
    "GitHub hesabınızı analiz edin: sizi geri takip etmeyenleri ve sizin takip etmediklerinizi keşfedin.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
