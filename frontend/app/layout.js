import "./globals.css";

export const metadata = {
  title: "Social Graph Analyzer",
  description:
    "Analyze your GitHub account: discover who doesn't follow you back and who you don't follow back.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
