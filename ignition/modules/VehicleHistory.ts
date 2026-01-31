import buildModule from "@nomicfoundation/hardhat-ignition";

const bm = buildModule as unknown as (
  name: string,
  fn: (m: any) => any
) => any;

export default bm("VehicleHistoryModule", (m) => {
  const vehicleHistory = m.contract("VehicleHistory");
  return { vehicleHistory };
});
