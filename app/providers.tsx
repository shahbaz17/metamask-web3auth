"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet, sepolia, lineaSepolia } from "wagmi/chains";
import { MetaMaskSDK } from "@metamask/sdk";
import { useEffect } from "react";
import Web3AuthConnectorInstance from "./web3authConnector";
import { IEthereum } from "./types/ethereum";

type Props = {
  children: ReactNode;
};

const config = createConfig({
  chains: [mainnet, sepolia, lineaSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [lineaSepolia.id]: http(),
  },
  connectors: [Web3AuthConnectorInstance([mainnet, sepolia, lineaSepolia])],
});

export function Providers({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const MMSDK = new MetaMaskSDK({
      dappMetadata: {
        name: "MetaMask Web3Auth Integration",
        url: window.location.href,
      },
    });

    const ethereum = MMSDK.getProvider();
    if (ethereum) {
      window.ethereum = ethereum as unknown as IEthereum;
    }
  }, []);

  return (
    <WagmiProvider config={config as any}>
      <QueryClientProvider client={queryClient}>
        <div className="container">{children}</div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
