import React from "react";
import Navbar from "../NavBar/NavBar";
import Tabs from "../Tabs/Tabs";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  children: React.ReactNode;
  showTabs?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showTabs = false,
}) => {
  return (
    <div className={styles.page}>
      <Navbar />
      {showTabs && <Tabs />}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default PageLayout;
