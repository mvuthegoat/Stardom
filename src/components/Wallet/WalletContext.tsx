import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  account: string | null;
  connectMetaMask: () => Promise<void>;
  connectPhantom: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectMetaMask = async () => {
    setIsConnecting(true);
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        console.log("ACCOUNT METAMASK: ", accounts[0]);

        return accounts[0];
      } else {
        throw new Error("MetaMask is not installed");
      }
    } catch (error) {
      console.error("MetaMask connection error:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const connectPhantom = async () => {
    setIsConnecting(true);
    try {
      if ("solana" in window) {
        const provider = window.solana;
        await provider.connect();
        const publicKey = provider.publicKey?.toString();
        if (publicKey) {
          setAccount(publicKey);
          console.log("ACCOUNT SOLANA: ", publicKey);
          return publicKey;
        }
      } else {
        throw new Error("Phantom wallet is not installed");
      }
    } catch (error) {
      console.error("Phantom connection error:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        connectMetaMask,
        connectPhantom,
        disconnect,
        isConnecting,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
