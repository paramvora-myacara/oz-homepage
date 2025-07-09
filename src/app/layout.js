import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "OZ Listings | Opportunity Zone Listings for Investors and Developers",
  description: "Homepage for OZ Listings, the premier platform for Opportunity Zone listings.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
