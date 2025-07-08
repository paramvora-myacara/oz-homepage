import "./globals.css";
import ThemeLogo from "./components/ThemeLogo";

export const metadata = {
  title: "OZ Listings | Opportunity Zone Listings for Investors and Developers",
  description: "Homepage for OZ Listings, the premier platform for Opportunity Zone listings.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="absolute top-0 left-0 z-50 p-8">
          <ThemeLogo />
        </header>
        {children}
      </body>
    </html>
  );
}
