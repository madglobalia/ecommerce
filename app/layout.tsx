 import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import ConditionalLayout from "../components/ConditionalLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toast />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
