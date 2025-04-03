import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx"; // for conditional classes (optional but helpful)

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [highlightedOrders, setHighlightedOrders] = useState(new Set());
  const [activeTab, setActiveTab] = useState("new");
  const wsRef = useRef(null); // 🟣 keep ws instance across renders

  const API_URL = process.env.REACT_APP_API_BASE;
  const WS_URL = process.env.REACT_APP_WS_BASE;

  // Load existing orders
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

  // -------------------
  // WebSocket Handler
  // -------------------
  useEffect(() => {
    fetchOrders();

    let isMounted = true;

    // Only connect once
    const connectWS = async () => {
      await fetch(`${API_URL}/health`); // optional wakeup
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMounted) return;
        console.log("✅ Connected to WebSocket Server");
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        const data = JSON.parse(event.data);

        if (data.type === "new_order") {
          console.log("📢 New Order Received", data);
          const newOrder = { ...data.order, _id: data.orderId };
          setOrders(prev => [newOrder, ...prev]);
          setHighlightedOrders(prev => new Set(prev).add(data.orderId));
        }

        if (data.type === "order_status_updated") {
          console.log("🟣 Order Status Updated", data);
          setOrders(prev =>
            prev.map(o => o._id === data.orderId ? { ...o, status: data.status } : o)
          );
        }
      };

      ws.onclose = () => {
        if (!isMounted) return;
        console.log("⚪ Disconnected from WebSocket");
      };
    };

    connectWS();

    // 🟣 Cleanup
    return () => {
      isMounted = false;
      if (wsRef.current) {
        console.log("🟣 Cleaning up ws");
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [API_URL, WS_URL, fetchOrders]);

  // PATCH order status
  const handleOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${API_URL}/order/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        console.log(`✅ Order ${orderId} marked as ${status}`);
        setOrders(prev =>
          prev.map(o => o._id === orderId ? { ...o, status } : o)
        );
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

  // Filter & Sort
  const filteredOrders = orders
    .filter(o => o.status === activeTab)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // newest on top

  return (
    <div className="min-h-screen p-4 space-y-4">
      <h1 className="text-2xl font-bold">Frontdesk Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        {["new", "served", "canceled"].map(status => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={clsx(
              "px-4 py-2 rounded border",
              activeTab === status ? "bg-black text-white" : "bg-white"
            )}
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
            className={clsx(
              "p-4 rounded-lg shadow space-y-2 border transition-all",
              highlightedOrders.has(order._id) && "border-2 border-yellow-400"
            )}
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
                    <td className="py-1">{item.brand ? `(${item.brand || '-'}) ` : ""}{item.name}</td>
                    <td className="py-1">{item.spiciness || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-xs text-gray-400">({order._id}, #{idx + 1})</p>

            <div className="flex space-x-2 mt-2">
              {order.status === "new" && (
                <>
                  <button onClick={() => handleOrderStatus(order._id, "served")} className="px-4 py-2 rounded-lg bg-blue-600 text-white">주문 입력 완료</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

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
