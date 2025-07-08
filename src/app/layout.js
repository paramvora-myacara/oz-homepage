import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "OZ Listings | Opportunity Zone Listings for Investors and Developers",
  description: "Homepage for OZ Listings, the premier platform for Opportunity Zone listings.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
