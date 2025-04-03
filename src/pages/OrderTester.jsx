// src/pages/OrderTester.jsx (or src/components/OrderTester.jsx if you prefer)
import { useState } from "react";
import axios from "axios";

export default function OrderTester() {
    const [orderInput, setOrderInput] = useState(`{
    "restaurant": "jungwon-soondubu",
    "tableNumber": 3,
    "items": [
        {
            "name": "차돌순두부",
            "quantity": 2,
            "spiciness": "기본",
            "brand": ""
        }
    ]
}`);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setError(null);
        try {
            const parsedOrder = JSON.parse(orderInput);
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/order`,
                parsedOrder
            );
            setResponse(res.data);
        } catch (err) {
            console.error(err);
            setError(err.message || "Unknown error");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8">
            <h1 className="text-2xl font-bold mb-4">🧪 Order Tester</h1>

            <textarea
                className="w-full p-2 text-black rounded"
                rows={12}
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
            />

            <button
                className="mt-4 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                onClick={handleSubmit}
            >
                Send Order
            </button>

            {response && (
                <div className="mt-4 p-3 bg-green-800 rounded">
                    ✅ API Response:
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-800 rounded">
                    ❌ Error:
                    <pre>{error}</pre>
                </div>
            )}
        </div>
    );
}
