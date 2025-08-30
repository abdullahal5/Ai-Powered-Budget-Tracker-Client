import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return <div className="container mx-auto px-5 my-24">{children}</div>;
};

export default MainLayout;
