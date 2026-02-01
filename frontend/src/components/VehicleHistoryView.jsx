export default function VehicleHistoryView({ records }) {
  if (!records || records.length === 0) {
    return (
      <div className="mt-8 text-gray-400">
        Chưa có dữ liệu lịch sử để hiển thị
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white/5 p-6 rounded-2xl border border-white/10">
      <h2 className="text-2xl font-bold mb-4">📜 Lịch sử xe</h2>

      <div className="space-y-4">
        {records.map((r, i) => (
          <div
            key={i}
            className="bg-black/30 p-4 rounded-xl border border-white/10"
          >
            <p><b>🕒 Thời gian:</b> {r.timestamp}</p>
            <p><b>📌 Loại:</b> {r.dataType}</p>
            <p><b>🚗 ODO:</b> {r.odometer} km</p>
            <p><b>📝 Mô tả:</b> {r.description}</p>
            <p className="text-xs text-gray-400 break-all">
              <b>👤 Ghi bởi:</b> {r.recorder}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
