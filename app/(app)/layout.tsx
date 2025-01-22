"use client";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root min-h-screen flex flex-col">
      <div className="root-container flex-grow">
        <div className="wrapper">
          <Navbar />

          {children}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Layout;
