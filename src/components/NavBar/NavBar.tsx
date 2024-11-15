"use client";

import { usePathname, useRouter } from "next/navigation";
import styles from "./NavBar.module.css";
import { NavBarButtonList } from "./NavBarButtonConfig";
import Button from "../Button/Button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useWallet } from "../Wallet";
import { WalletConnectModal } from "../Wallet";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { account } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleAccountClick = () => {
    if (account) {
      // If user is logged in, navigate to profile
      router.push("/profile");
    } else {
      // If not logged in, show the wallet connect modal
      setShowWalletModal(true);
    }
  };

  const handleWalletSuccess = () => {
    setShowWalletModal(false); // Close the modal on successful wallet connection
  };

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
        <div className={styles.navbar_container_right}>
          <button onClick={handleAccountClick} className={styles.accountButton}>
            <Image
              src={account ? "/user-avatar.png" : "/account-icon.png"}
              alt="Account"
              width={30}
              height={30}
            />
          </button>
        </div>
      </div>
      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSuccess={handleWalletSuccess}
      />
    </nav>
  );
};

export default Navbar;
