"use client";

import Tenant from "@/lib/tenant/tenant";
import Proposals from "@/components/Proposals/Proposals/Proposals";
import Hero from "@/components/Hero/Hero";
import { BitteWidgetChat } from "@bitte-ai/chat";
import '@bitte-ai/chat/styles.css';
import { useNear } from "@/contexts/NearContext";
import { useEffect, useState } from "react";
import { NetworkId, setupWalletSelector, Wallet, WalletModuleFactory } from "@near-wallet-selector/core";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";

export default function ProposalsHome() {
  const { ui } = Tenant.current();
  const { signedAccountId } = useNear();
  const [wallet, setWallet] = useState<Wallet>();

  if (!ui.toggle("proposals")) {
    return <div>Route not supported for namespace</div>;
  }
  useEffect(() => {
    const initWallet = async () => {
      const networkId = "mainnet" as NetworkId;
      const selector = await setupWalletSelector({
        network: networkId,
        modules: [setupMeteorWallet() as WalletModuleFactory],
      });

      const fetchWallet = async () => {
        const walletInstance = await selector.wallet();
        setWallet(walletInstance);
      };
      if (selector) fetchWallet();
    };
    
    initWallet();
  }, []);

  return (
    <div className="flex flex-col">
      <Hero page="proposals" />
      <Proposals />
      <BitteWidgetChat  
        agentId="hos-agent.vercel.app"
        apiUrl="https://hos-bitte-ui.vercel.app/api/chat"
        format="markdown"
        wallet={{ 
          near: { 
            wallet,
            accountId: signedAccountId || "",
            nearWalletId: wallet?.metadata?.name || ""
          }
        }}
        widget={{
          widgetWelcomePrompts: {
            questions: [
              'What is proposal 1?',
            ],
            actions: ['Vote propsoal', 'Create proposal'],
          },
        }}
      />
    </div>
  );
}
