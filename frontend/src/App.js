import { useState } from "react";
import { ShieldCheck, Search, QrCode, Wrench, AlertTriangle } from "lucide-react";
import { ethers } from "ethers";

import ConnectWallet from "./ConnectWallet";
import CreateVehicle from "./components/CreateVehicle";

import AddRecord from "./components/AddRecord";
import VehicleHistoryView from "./components/VehicleHistoryView";

import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
} from "./contract/vehicleHistory";

export default function App() {
  const [vin, setVin] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      if (!window.ethereum) {
        alert("Vui lòng cài MetaMask");
        return;
      }

      if (!vin) {
        alert("Vui lòng nhập VIN");
        return;
      }

      setLoading(true);
      setRecords([]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      const count = await contract.getRecordCount(vin);
      const total = Number(count);

      if (total === 0) {
        alert("Xe chưa có lịch sử");
        setLoading(false);
        return;
      }

      const history = [];

      for (let i = 0; i < total; i++) {
        const r = await contract.getRecord(vin, i);
        history.push({
          timestamp: new Date(Number(r[0]) * 1000).toLocaleString(),
          dataType: r[1],
          odometer: r[2].toString(),
          description: r[3],
          recorder: r[4],
        });
      }

      setRecords(history);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi truy vấn Blockchain");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex flex-col items-center justify-start px-6 py-10 text-white">
      {/* Header */}
      <header className="w-full max-w-7xl flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-10 h-10 text-green-400" />
          <h1 className="text-3xl font-bold">
            Blockchain Vehicle Verification
          </h1>
        </div>
        <span className="text-green-400 text-sm font-medium">
          ✔ Blockchain Secured
        </span>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-7xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT */}
        <div>
          <h2 className="text-4xl font-bold mb-4">
            Xác thực lịch sử & chất lượng xe
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Kiểm tra lịch sử vận hành, bảo dưỡng và linh kiện xe dựa trên dữ liệu
            bất biến được lưu trữ trên Blockchain.
          </p>

          <label className="block mb-3 text-lg font-medium">
            Nhập VIN / VehicleID
          </label>

          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="VD: 1HGCM82633A004352"
            className="w-full px-6 py-4 text-lg rounded-xl bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
          />

          <div className="flex flex-wrap gap-4">
            <button
              onClick={fetchHistory}
              disabled={loading}
              className="flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <Search className="w-5 h-5" />
              {loading ? "Đang tra cứu..." : "Tra cứu Blockchain"}
            </button>

            <button className="flex items-center gap-2 px-8 py-4 text-lg rounded-xl bg-white/10 hover:bg-white/20 transition">
              <QrCode className="w-5 h-5" />
              Quét QR
            </button>
          </div>

          {/* Blockchain actions */}
          <div className="mt-8 space-y-4">
            <ConnectWallet />
            <CreateVehicle />
            <AddRecord />
            
          </div>

          {/* HISTORY VIEW */}
          <VehicleHistoryView records={records} />
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <Feature
            icon={<Search />}
            title="Lịch sử vận hành"
            desc="Số km, tai nạn, bảo dưỡng minh bạch"
          />
          <Feature
            icon={<Wrench />}
            title="Linh kiện chính hãng"
            desc="PIN, ECU, Serial Number xác thực"
          />
          <Feature
            icon={<ShieldCheck />}
            title="Dữ liệu bất biến"
            desc="Không thể sửa hoặc làm giả"
          />
          <Feature
            icon={<AlertTriangle />}
            title="Phát hiện gian lận"
            desc="Cảnh báo tua ODO, lịch sử thiếu"
          />
        </div>
      </main>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
      <div className="text-indigo-400">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-gray-300">{desc}</p>
      </div>
    </div>
  );
}
