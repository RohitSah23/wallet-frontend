"use client";

import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [refLink, setRefLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const connectWallet = async () => {
    if (!(window as any).ethereum) return alert("Please install MetaMask");
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const walletAddress = accounts[0];
      setWallet(walletAddress);
      setLoading(true);

      const params = new URLSearchParams(window.location.search);
      const referralCode = params.get("ref");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/save-wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, referralCode }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) setRefLink(data.referralLink);
      else alert(data.error || "Something went wrong");
    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet");
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">💰 Wallet Connect</h1>
        <p className="mb-6 text-gray-600">Connect your wallet and get your referral link</p>

        {!wallet ? (
          <button
            onClick={connectWallet}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <>
            <p className="mt-4 text-gray-700">Connected: {wallet}</p>
            {refLink && (
              <div className="mt-6">
                <p className="font-semibold text-gray-700">Your referral link:</p>
                <a
                  href={refLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline break-all"
                >
                  {refLink}
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
