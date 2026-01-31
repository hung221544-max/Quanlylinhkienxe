import { useState } from "react";
import { ethers } from "ethers";

const CRONOS_TESTNET = {
  chainId: "0x152", // 338
  chainName: "Cronos Testnet",
  nativeCurrency: {
    name: "TCRO",
    symbol: "TCRO",
    decimals: 18,
  },
  rpcUrls: ["https://evm-t3.cronos.org"],
  blockExplorerUrls: ["https://testnet.cronoscan.com"],
};

export default function ConnectWallet() {
  const [account, setAccount] = useState("");

  async function connectWallet() {
    if (!window.ethereum) {
      alert("❌ Vui lòng cài đặt MetaMask!");
      return;
    }

    try {
      // Xin kết nối ví
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Kiểm tra network
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      // Nếu chưa phải Cronos Testnet
      if (chainId !== CRONOS_TESTNET.chainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: CRONOS_TESTNET.chainId }],
          });
        } catch (switchError) {
          // Nếu chưa add network
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [CRONOS_TESTNET],
            });
          } else {
            throw switchError;
          }
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
    } catch (err) {
      console.error(err);
      alert("⚠️ Không thể kết nối MetaMask");
    }
  }

  return (
    <div>
      {account ? (
        <div className="mt-4">
          <p className="text-white font-medium text-lg">Ví đã kết nối:</p>
          <p className="text-yellow-300 font-bold mt-1 text-xl">
            {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 text-white font-semibold text-lg"
        >
          🔗 Kết nối MetaMask
        </button>
      )}
    </div>
  );
}

