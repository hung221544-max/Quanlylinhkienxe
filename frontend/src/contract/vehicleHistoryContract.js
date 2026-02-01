import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./vehicleHistory";

export async function getVehicleHistoryContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask chưa được cài");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  );
}
