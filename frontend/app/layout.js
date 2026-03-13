import "../styles/globals.css";
import { AuthProvider } from "../hooks/useAuth";

export const metadata = {
  title: "NeoConnect — Staff Feedback Platform",
  description: "Transparent complaint management for modern organizations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
