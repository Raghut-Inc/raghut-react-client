import { useState, useRef } from "react";
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

    const [audioFile, setAudioFile] = useState(null);
    const [transcript, setTranscript] = useState("");
    const audioRef = useRef(null);

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

    const handleSTTUpload = async () => {
        if (!audioFile) return setError("Please select a .wav file first.");
        setError(null);
        setTranscript("");

        try {
            const formData = new FormData();
            formData.append("file", audioFile);

            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/stt`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setTranscript(res.data.transcript);
            // Load the selected audio file for playback
            const audioURL = URL.createObjectURL(audioFile);
            if (audioRef.current) {
                audioRef.current.src = audioURL;
                audioRef.current.load();
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "STT upload failed");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8 space-y-6">
            <h1 className="text-2xl font-bold">🧪 Order Tester</h1>

            {/* === Order Sender === */}
            <section className="space-y-2">
                <h2 className="text-lg font-semibold">📦 Send Order JSON</h2>
                <textarea
                    className="w-full p-2 text-black rounded"
                    rows={10}
                    value={orderInput}
                    onChange={(e) => setOrderInput(e.target.value)}
                />
                <button
                    className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                    onClick={handleSubmit}
                >
                    Send Order
                </button>
                {response && (
                    <div className="p-3 bg-green-800 rounded mt-2">
                        ✅ API Response:
                        <pre>{JSON.stringify(response, null, 2)}</pre>
                    </div>
                )}
            </section>

            {/* === STT Upload === */}
            <section className="space-y-2">
                <h2 className="text-lg font-semibold">🎤 Upload Audio (.wav)</h2>
                <input
                    type="file"
                    accept=".wav"
                    onChange={(e) => setAudioFile(e.target.files[0])}
                    className="text-black"
                />
                <button
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 mt-2"
                    onClick={handleSTTUpload}
                >
                    Upload and Transcribe
                </button>

                {transcript && (
                    <div className="p-3 bg-blue-800 rounded mt-2">
                        📝 Transcript:
                        <pre>{transcript}</pre>
                    </div>
                )}

                {audioFile && (
                    <audio ref={audioRef} controls className="mt-2 w-full" />
                )}
            </section>

            {/* === Error Box === */}
            {error && (
                <div className="p-3 bg-red-800 rounded">
                    ❌ Error:
                    <pre>{error}</pre>
                </div>
            )}
        </div>
    );
}
