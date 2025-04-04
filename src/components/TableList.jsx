import React, { useCallback, useEffect, useState } from 'react'

const TableList = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [unassignedDevices, setUnassignedDevices] = useState([]);
    const [assignedDevices, setAssignedDevices] = useState([]);

    const fetchDevices = useCallback(async () => {
        try {
            const [unassignedRes, assignedRes] = await Promise.all([
                fetch(`${API_URL}/unassigned-devices`),
                fetch(`${API_URL}/assigned-devices`)
            ]);
            const [unassignedData, assignedData] = await Promise.all([
                unassignedRes.json(),
                assignedRes.json()
            ]);

            if (unassignedData.success) setUnassignedDevices(unassignedData.devices);
            if (assignedData.success) setAssignedDevices(assignedData.devices);
        } catch (err) {
            console.error("❌ Failed to load devices", err);
        }
    }, [API_URL]);


    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);


    const assignTable = async (mac, tableNumber) => {
        try {
            const res = await fetch(`${API_URL}/assign-device`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mac, tableNumber })
            });

            if (res.ok) {
                console.log(`✅ MAC ${mac} assigned to Table ${tableNumber}`);
                fetchDevices();
            }
        } catch (err) {
            console.error("❌ Failed to assign table", err);
        }
    };


    return (
        <>
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold mb-2">🟡 Unassigned Devices</h2>
                    <ul className="space-y-2">
                        {unassignedDevices.map(device => (
                            <li key={device.mac} className="flex items-center space-x-2">
                                <span className="font-mono">{device.mac}</span>
                                <input
                                    type="number"
                                    placeholder="Table #"
                                    className="border px-2 py-1 rounded w-24"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            assignTable(device.mac, parseInt(e.target.value, 10));
                                        }
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">✅ Assigned Devices</h2>
                    <ul className="space-y-2">
                        {assignedDevices.map(device => (
                            <li key={device.mac} className="flex items-center justify-between">
                                <span className="font-mono">{device.mac}</span>
                                <input
                                    type="number"
                                    defaultValue={device.tableNumber}
                                    className="border px-2 py-1 rounded w-24"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            assignTable(device.mac, parseInt(e.target.value, 10));
                                        }
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default TableList