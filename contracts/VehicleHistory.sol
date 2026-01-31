// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VehicleHistory {

    struct Record {
        uint256 timestamp;
        string dataType;
        uint256 odometer;
        string description;
        address recorder;
    }

    struct Vehicle {
        bytes32 vin;
        Record[] records;
        bool exists;
    }

    mapping(bytes32 => Vehicle) private vehicles;

    event VehicleCreated(bytes32 vin);
    event RecordAdded(bytes32 vin, string dataType, uint256 odometer);

    modifier onlyAuthorized() {
        _;
    }

    function createVehicle(string memory _vin) public {
        bytes32 vinHash = keccak256(abi.encodePacked(_vin));
        require(!vehicles[vinHash].exists, "Vehicle already exists");

        vehicles[vinHash].vin = vinHash;
        vehicles[vinHash].exists = true;

        emit VehicleCreated(vinHash);
    }

    function addRecord(
        string memory _vin,
        string memory _dataType,
        uint256 _odometer,
        string memory _description
    ) public onlyAuthorized {
        bytes32 vinHash = keccak256(abi.encodePacked(_vin));
        require(vehicles[vinHash].exists, "Vehicle does not exist");

        vehicles[vinHash].records.push(
            Record({
                timestamp: block.timestamp,
                dataType: _dataType,
                odometer: _odometer,
                description: _description,
                recorder: msg.sender
            })
        );

        emit RecordAdded(vinHash, _dataType, _odometer);
    }

    function getRecordCount(string memory _vin) public view returns (uint256) {
        bytes32 vinHash = keccak256(abi.encodePacked(_vin));
        require(vehicles[vinHash].exists, "Vehicle does not exist");
        return vehicles[vinHash].records.length;
    }

    function getRecord(string memory _vin, uint256 _index)
        public
        view
        returns (
            uint256 timestamp,
            string memory dataType,
            uint256 odometer,
            string memory description,
            address recorder
        )
    {
        bytes32 vinHash = keccak256(abi.encodePacked(_vin));
        require(vehicles[vinHash].exists, "Vehicle does not exist");
        require(_index < vehicles[vinHash].records.length, "Index out of bounds");

        Record memory r = vehicles[vinHash].records[_index];
        return (r.timestamp, r.dataType, r.odometer, r.description, r.recorder);
    }
}
