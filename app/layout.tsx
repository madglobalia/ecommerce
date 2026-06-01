import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Toast from "../components/Toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toast />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}