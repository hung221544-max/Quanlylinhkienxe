import { useState } from "react";
import { getVehicleHistoryContract } from "../contract/vehicleHistoryContract";

export default function AddRecord() {
  const [vin, setVin] = useState("");
  const [dataType, setDataType] = useState("Bao duong");
  const [odometer, setOdometer] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddRecord() {
    if (!vin || !odometer || !description) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const contract = await getVehicleHistoryContract();
      const tx = await contract.addRecord(
        vin,
        dataType,
        Number(odometer),
        description
      );

      await tx.wait();

      alert("✅ Ghi lịch sử xe thành công!");
      setVin("");
      setOdometer("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi ghi lịch sử (kiểm tra VIN)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10">
      <h3 className="text-xl font-semibold mb-4">🛠 Ghi lịch sử xe</h3>

      <input
        value={vin}
        onChange={(e) => setVin(e.target.value)}
        placeholder="VIN xe"
        className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/20 mb-3"
      />

      <select
        value={dataType}
        onChange={(e) => setDataType(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/20 mb-3"
      >
        <option>Bao duong</option>
        <option>Thay linh kien</option>
        <option>Tai nan</option>
      </select>

      <input
        type="number"
        value={odometer}
        onChange={(e) => setOdometer(e.target.value)}
        placeholder="Số km (ODO)"
        className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/20 mb-3"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Mô tả chi tiết"
        className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/20 mb-4"
      />

      <button
        onClick={handleAddRecord}
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
      >
        {loading ? "⏳ Đang ghi..." : "📝 Ghi lịch sử"}
      </button>
    </div>
  );
}
