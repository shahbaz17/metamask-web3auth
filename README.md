# MetaMask SDK + Web3Auth SDK integration

This project demonstrates the integration of [MetaMask SDK](https://docs.metamask.io/) with [Web3Auth SDK](https://docs.web3auth.io/) in a Next.js application. It provides a seamless wallet connection experience for both desktop and mobile users.

## Features

- _Dual SDK integration_ - Seamlessly combine MetaMask and Web3Auth SDKs.
- _Web3Auth Social login_ - Sign in with email/password or social providers.
- _MetaMask Wallet connection_ - Connect to MetaMask wallet with enhanced features.
- _Ethereum interactions_ - Send transactions, interact with contracts, and more.
- _Mobile-friendly_ - Optimized for both desktop and mobile devices.
- _Next.js integration_ - Built with Next.js 15 and App Router.
- _React 19_ - Latest React version with TypeScript support.
- _Tailwind CSS_ - Beautiful UI components with Tailwind CSS.
- _Wagmi_ - Ethereum interaction library.

## Set up using a template

1. Download the template from the [SDK examples repository](https://github.com/metamask/metamask-sdk-examples):
   ```bash
   git clone https://github.com/metamask/metamask-sdk-examples.git
   ```
2. Navigate into the quickstart example:
   ```bash
   cd metamask-sdk-examples/examples/metamask-web3auth
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a `.env.local` file with your environment variables:
   ```
   NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
   ```
5. Start the development server:

   ```bash
   pnpm dev
   ```

   You've successfully set up MetaMask SDK with Web3Auth SDK.

## Set up manually

### 1. Install dependencies

Install the SDK and the required dependencies to an existing project:

```bash
npm install viem wagmi @tanstack/react-query @web3auth/modal@10.0.0-beta.6
```

### 2. Configure providers

Set up your providers in `app/providers.tsx`:

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState, useEffect } from "react";

import { Web3AuthProvider } from "@web3auth/modal/react";
import { WagmiProvider } from "@web3auth/modal/react/wagmi";

import { MetaMaskSDK } from "@metamask/sdk";

type Props = {
  children: ReactNode;
};

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
```

### 3. Set up environment variables

Create a `.env.local` file with your environment variables:

```bash
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
```

## Usage

### 1. Connect Wallet or Sign in

```tsx
"use client";

import { useWeb3AuthConnect } from "@web3auth/modal/react";

export const Navbar = () => {
  const { connect } = useWeb3AuthConnect();

  return (
    <nav>
      <button onClick={() => connect()}>Connect or Sign in</button>;
    </nav>
  );
};
```

### 2. Check wallet status

Use the `useAccount` hook from Wagmi:

```tsx
"use client";

import { useAccount } from "wagmi";

export const Hero = () => {
  const { address, isConnected } = useAccount();

  return (
    <div>
      {isConnected ? <p>Connected: {address}</p> : <p>Not connected</p>}
    </div>
  );
};
```

### 3. Send a transaction

Use the `useSendTransaction` hook from Wagmi:

```tsx
"use client";

import { useSendTransaction } from "wagmi";
import { parseEther } from "viem";

export const SendTransaction = () => {
  const { sendTransaction } = useSendTransaction();

  return (
    <button
      onClick={() =>
        sendTransaction({
          to: "0xd2135CfB216b74109775236E36d4b433F1DF507B",
          value: parseEther("0.001"),
        })
      }
    >
      Send transaction
    </button>
  );
};
```
