import { Inter } from "next/font/google";
import "./style.css" ;

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DataWise AI",
  description: "UI for Elastic Search",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div className="logo">DataWise AI</div>
            <button className="exploreButton">User</button>
          </header>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
