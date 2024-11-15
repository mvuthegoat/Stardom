import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "./WalletContext";
import { useEffect, useState } from "react";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const WalletConnectModal = ({
  isOpen,
  onClose,
  onSuccess,
}: WalletConnectModalProps) => {
  const { account, connectMetaMask, connectPhantom, isConnecting } =
    useWallet();
  const [isConnected, setIsConnected] = useState(false); // Track when a connection is attempted

  const handleConnect = async (walletType: "metamask" | "phantom") => {
    try {
      if (walletType === "metamask") {
        await connectMetaMask();
      } else {
        await connectPhantom();
      }
      setIsConnected(true); // Set to true when the connection attempt completes
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      // You might want to show an error message to the user here
    }
  };

  // Watch for `account` to update after `isConnected` is set to true
  useEffect(() => {
    if (isConnected && account) {
      onSuccess(); // Trigger onSuccess when account is updated
      onClose(); // Close the modal
      setIsConnected(false); // Reset connection state
    }
  }, [account, isConnected, onSuccess, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect to Stardom</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={() => handleConnect("metamask")}
            disabled={isConnecting}
            className="flex items-center justify-center gap-2"
          >
            <img src="/metamask-logo.svg" alt="MetaMask" className="w-6 h-6" />
            Connect with MetaMask
          </Button>
          <Button
            onClick={() => handleConnect("phantom")}
            disabled={isConnecting}
            className="flex items-center justify-center gap-2"
          >
            <img src="/phantom-logo.svg" alt="Phantom" className="w-6 h-6" />
            Connect with Phantom
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
