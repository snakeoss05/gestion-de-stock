import "./globals.css";
import { StockProvider } from "../contexts/stock-context";
import { AuthProvider } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";

import { Toaster } from "react-hot-toast";
export const metadata = {
  title: "Errayen Solution",
  description: "Errayen Solution",
  generator: "v0.dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <StockProvider>
            {" "}
            <div className="flex  h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 overflow-y-auto lg:ml-0">
                <div>{children}</div>
              </main>
            </div>
          </StockProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
