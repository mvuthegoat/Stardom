"use client";

import { usePathname } from "next/navigation";
import styles from "./NavBar.module.css";
import { NavBarButtonList } from "./NavBarButtonConfig";
import Button from "../Button/Button";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_container}>
        <div className={styles.navbar_container_left}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={30}
              height={30}
              priority
            />
          </Link>
          {NavBarButtonList.map((button) => (
            <Button
              key={button.path}
              btnName={button.name}
              path={button.path}
              active={pathname.startsWith(`${button.path}`)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
