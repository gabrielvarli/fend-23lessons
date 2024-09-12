import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import Navbar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Your App Title",
  description: "Your app description",
};

// En funktion som kontrollerar om Auth-komponenten ska visas eller int

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="bg-gray-200 min-h-screen">
          <AuthProvider>
            <Navbar />{" "}
            {/* AuthWrapper kommer att visa Auth-komponenten vid behov */}
            <div className="container mx-auto p-4">{children}</div>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
