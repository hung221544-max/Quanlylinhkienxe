import { useState } from "react";
import { ethers } from "ethers";

export default function ConnectWallet() {
  const [account, setAccount] = useState("");

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Vui lòng cài ví MetaMask!");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    setAccount(address);
  }

  return (
    <div>
      {account ? (
        <div className="mt-4">
          <p className="text-white font-medium text-lg">
            Ví đã kết nối:
          </p>
          <p className="text-yellow-300 font-bold mt-1 text-xl">
            {account.substring(0, 6)}...{account.slice(-4)}
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
