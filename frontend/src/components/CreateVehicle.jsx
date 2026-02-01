import { useState } from "react";
import { getVehicleHistoryContract } from "../contract/vehicleHistoryContract";

export default function CreateVehicle() {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateVehicle() {
    if (!vin) return alert("Nhập VIN");

    try {
      setLoading(true);
      const contract = await getVehicleHistoryContract();
      const tx = await contract.createVehicle(vin);
      await tx.wait();
      alert("✅ Tạo xe thành công!");
      setVin("");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi tạo xe");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-gray-800 rounded-xl mt-6">
      <h2 className="text-white text-xl font-bold mb-4">
        🚗 Tạo xe mới
      </h2>

      <input
        value={vin}
        onChange={(e) => setVin(e.target.value)}
        placeholder="Nhập VIN"
        className="w-full p-3 rounded mb-4"
      />

      <button
        onClick={handleCreateVehicle}
        disabled={loading}
        className="w-full py-3 bg-green-500 rounded text-white font-semibold"
      >
        {loading ? "Đang xử lý..." : "Tạo xe"}
      </button>
    </div>
  );
}
