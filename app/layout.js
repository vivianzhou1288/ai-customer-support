import "./globals.css";
import { UserProvider } from "./context/UserContext";

export const metadata = {
  title: "AI Travel Assistant",
  description: "AI Travel Assistant created with next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
