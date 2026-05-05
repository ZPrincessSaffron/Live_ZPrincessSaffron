import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingActions from "./FloatingActions";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col max-w-full overflow-x-hidden">
      <Header />
      <main className="flex-grow px-4 md:px-6 lg:px-0">
        {children}
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Layout;
