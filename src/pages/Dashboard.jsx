// src/components/dashboard.jsx
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000"); // Change if your API is on a different IP or port

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket Server");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_order') {
        console.log("📢 New Order Received", data);
        setOrders(prev => [...prev, data]);
      }
    };

    ws.onclose = () => {
      console.log("⚪ Disconnected from WebSocket");
    };

    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen p-8 space-y-4">
      <h1 className="text-2xl font-bold">Frontdesk Dashboard</h1>
      <div className="space-y-4">
        {orders.length === 0 && <p>No orders yet</p>}
        {orders.map((order, idx) => (
          <div key={idx} className="p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Order #{idx + 1}</h2>
            <ul className="list-disc ml-4">
              {order.order.items.map((item, i) => (
                <li key={i}>
                  {item.name} x {item.quantity}
                  {item.spiciness && ` (${item.spiciness})`}
                  {item.brand && ` - ${item.brand}`}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mt-2">Order ID: {order.orderId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
