"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet, polygon, sepolia } from "wagmi/chains";
import Web3AuthConnectorInstance from "./web3authConnector";

type Props = {
  children: ReactNode;
};

const config = createConfig({
  chains: [mainnet, sepolia, polygon],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
  connectors: [Web3AuthConnectorInstance([mainnet, sepolia, polygon])],
});

export function Providers({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config as any}>
      <QueryClientProvider client={queryClient}>
        <div className="container">{children}</div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
