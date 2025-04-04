import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [highlightedOrders, setHighlightedOrders] = useState(new Set());
  const [activeTab, setActiveTab] = useState("new");
  const [view, setView] = useState("orders");
  const [unassignedDevices, setUnassignedDevices] = useState([]);
  const [assignedDevices, setAssignedDevices] = useState([]);

  const wsRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const WS_URL = process.env.REACT_APP_WS_URL;

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      if (data.success) {
        const sorted = data.orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setOrders(sorted);
      }
    } catch (err) {
      console.error("❌ Failed to load orders", err);
    }
  }, [API_URL]);

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

  useEffect(() => {
    fetchOrders();
    fetchDevices();
  }, [fetchOrders, fetchDevices]);

  useEffect(() => {
    let isMounted = true;
    let reconnectTimeout;
    const reconnectDelay = 3000;

    const connectWS = async () => {
      await fetch(`${API_URL}/health`).catch(() => { });
      if (isMounted) fetchOrders();
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => isMounted && console.log("✅ WebSocket connected");
      ws.onmessage = (event) => {
        if (!isMounted) return;
        const data = JSON.parse(event.data);
        if (data.type === "new_order") {
          const newOrder = { ...data.order, _id: data.orderId };
          setOrders(prev => [newOrder, ...prev]);
          setHighlightedOrders(prev => new Set(prev).add(data.orderId));
        }
        if (data.type === "order_status_updated") {
          setOrders(prev => prev.map(o => o._id === data.orderId ? { ...o, status: data.status } : o));
        }
      };

      ws.onclose = () => {
        if (!isMounted) return;
        console.warn("⚪ WebSocket closed, retrying in 3s...");
        reconnectTimeout = setTimeout(connectWS, reconnectDelay);
      };

      ws.onerror = (err) => {
        console.error("❌ WebSocket error", err);
        ws.close();
      };
    };

    connectWS();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimeout);
      wsRef.current?.close();
    };
  }, [API_URL, WS_URL, fetchOrders]);

  const handleOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${API_URL}/order/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
        setHighlightedOrders(prev => {
          const updated = new Set(prev);
          updated.delete(orderId);
          return updated;
        });
      }
    } catch (err) {
      console.error("❌ Failed to update order status", err);
    }
  };

  const filteredOrders = orders.filter(o => o.status === activeTab);

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* View Tabs */}
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setView("orders")} className={clsx("px-4 py-2 rounded border", view === "orders" ? "bg-black text-white" : "bg-white")}>Orders</button>
        <button onClick={() => setView("devices")} className={clsx("px-4 py-2 rounded border", view === "devices" ? "bg-black text-white" : "bg-white")}>Devices</button>
      </div>

      {/* Orders View */}
      {view === "orders" && (
        <>
          {/* Tabs */}
          <div className="flex space-x-4 mb-4">
            {["new", "served"].map(status => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={clsx("px-4 py-2 rounded border", activeTab === status ? "bg-black text-white" : "bg-white")}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Orders */}
          <div className="space-y-4">
            {filteredOrders.length === 0 && <p>No orders in this category</p>}
            {filteredOrders.map((order, idx) => (
              <div
                key={order._id}
                className={clsx("p-4 rounded-lg shadow space-y-2 border transition-all", highlightedOrders.has(order._id) && "border-2 border-yellow-400")}
              >
                <div className="mb-2 text-xl flex space-x-2">
                  <div className="font-semibold"><b>{order.tableNumber || "?"}</b> 번 테이블</div>
                  <div className={clsx("text-xs flex items-center justify-center px-2 text-white", order.status === "new" ? "bg-red-500 " : "bg-gray-300")}>{order.status}- {timeAgo(order.timestamp)}</div>
                </div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-xs bg-gray-200">
                      <th className="text-center py-1 w-16">수량</th>
                      <th className="text-left py-1">메뉴</th>
                      <th className="text-left py-1">맵기</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="text-center py-1">{item.quantity}</td>
                        <td className="py-1">{item.brand ? `(${item.brand}) ` : ""}{item.name}</td>
                        <td className="py-1">{item.spiciness || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-400">({order._id}, #{idx + 1})</p>
                {order.status === "new" && (
                  <div className="flex space-x-2 mt-2">
                    <button onClick={() => handleOrderStatus(order._id, "served")} className="px-4 py-2 rounded-lg bg-blue-600 text-white">주문 입력 완료</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Devices View */}
      {view === "devices" && (
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
                    <span className="text-sm">Table {device.tableNumber}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}