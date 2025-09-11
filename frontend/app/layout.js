import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "ImobiliaMarket",
  description: "Platformă anunțuri imobiliare",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body className="bg-gray-100">
        <Navbar />
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
