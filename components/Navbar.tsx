"use client";

import Image from "next/image";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { useState } from "react";
import { walletServicesPlugin } from "@/app/web3authConnector";

export function Navbar() {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const showWalletUI = async () => {
    try {
      await walletServicesPlugin.showWalletUi({
        show: true,
      });
    } catch (error) {
      console.error("Wallet services error:", error);
    }
  };

  return (
    <nav className="flex w-full px-3 md:px-0 h-fit py-10 justify-between items-center">
      <Image
        src="/metamask-logo.svg"
        alt="Metamask Logo"
        width={180}
        height={180}
      />
      {!isConnected ? (
        connectors
          .filter((connector) => connector.name === "Web3Auth")
          .map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="bg-white text-black px-4 py-2 font-semibold font-sans rounded-md cursor-pointer hover:bg-gray-100 transition-all duration-200"
            >
              Login with Web3Auth
            </button>
          ))
      ) : (
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
            >
              <span className="text-white font-medium">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            {isCopied && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white/10 text-white px-3 py-1 rounded-md text-sm">
                Copied!
              </div>
            )}
          </div>
          <button
            onClick={showWalletUI}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
          >
            <span className="font-medium">Wallet</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </button>
          <button
            onClick={() => disconnect()}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
          >
            <span className="font-medium">Disconnect</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      )}
    </nav>
  );
}
