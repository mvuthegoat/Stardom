"use client";

import { useWallet } from "@/components/Wallet/WalletContext";
import { useState, useEffect } from "react";
import { WalletConnectModal } from "@/components/Wallet";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();
  const { account } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    if (!account) {
      setShowWalletModal(true);
    }
  }, [account]);

  const handleWalletClose = () => {
    // If user closes modal without connecting, redirect to home
    if (!account) {
      router.push("/have-fun");
    }
    setShowWalletModal(false);
  };

  return (
    <div>
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={handleWalletClose}
        onSuccess={() => {
          setShowWalletModal(false);
        }}
      />

      <h1>Your Profile</h1>
      <p>Wallet Address: {account}</p>
      {/* Add other profile information here */}
    </div>
  );
};

export default ProfilePage;
