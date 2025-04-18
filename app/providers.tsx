"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

import { Web3AuthProvider } from "@web3auth/modal/react";
import { WagmiProvider } from "@web3auth/modal/react/wagmi";

// import { MetaMaskSDK } from "@metamask/sdk";

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   const MMSDK = new MetaMaskSDK({
  //     dappMetadata: {
  //       name: "MetaMask Web3Auth Integration",
  //       url: window.location.href,
  //     },
  //   });

  //   const ethereum = MMSDK.getProvider();
  //   if (ethereum) {
  //     window.ethereum = ethereum as unknown as IEthereum;
  //   }
  // }, []);

  return (
    <Web3AuthProvider
      config={{
        web3AuthOptions: {
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!, // Replace with your Client ID
          web3AuthNetwork: "sapphire_devnet",
          authBuildEnv: "testing", // Optional: Only for alpha/testing
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider>
          <div className="container">{children}</div>
        </WagmiProvider>
      </QueryClientProvider>
    </Web3AuthProvider>
  );
}
