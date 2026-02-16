import { useState, useRef } from "react";
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from "react-icons/fa";

type ToastType = "success" | "error" | "invalid";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export default function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [centerMessage, setCenterMessage] = useState<Toast | null>(null);
  const toastIdRef = useRef(0);

  const addToast = (type: ToastType) => {
    toastIdRef.current += 1;
    const id = toastIdRef.current;

    const messages: Record<ToastType, string> = {
      success: "Successfully submitted",
      error: "Please fix the error!",
      invalid: "Invalid input, check again",
    };

    const message = messages[type];
    const newToast: Toast = { id, message, type };

    // Add toasts stack
    setToasts((prev) => [...prev, newToast]);

    // Show latest center message
    setCenterMessage(newToast);

    // Remove toast after 6s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);

    // Remove center message after 1.5s
    setTimeout(() => {
      setCenterMessage((prev) => (prev?.id === id ? null : prev));
    }, 1500);
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-green-500 w-8 h-8 mr-4" />;
      case "error":
        return <FaTimesCircle className="text-red-500 w-8 h-8 mr-4" />;
      case "invalid":
        return <FaExclamationCircle className="text-orange-500 w-8 h-8 mr-4" />;
    }
  };

  const getProgressColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "invalid":
        return "bg-orange-500";
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 font-poppins p-10 relative">
      {/* Buttons */}
      <div className="mb-10 space-x-4">
        <button
          className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
          onClick={() => addToast("success")}
        >
          Success
        </button>
        <button
          className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
          onClick={() => addToast("error")}
        >
          Error
        </button>
        <button
          className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
          onClick={() => addToast("invalid")}
        >
          Invalid
        </button>
      </div>

      {/* Center overlay (latest only) */}
      {centerMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="bg-white text-black px-6 py-4 rounded shadow-xl text-2xl font-bold animate-fade-in">
            {centerMessage.message}
          </div>
        </div>
      )}

      {/* Toast stack top-left */}
      <div className="fixed top-5 left-5 flex flex-col items-start space-y-4 z-50">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{ animationDelay: `${index * 0.1}s` }}
            className={`w-96 h-20 bg-white shadow-lg rounded flex items-center p-4 transform -translate-x-full animate-slide-in-left relative`}
          >
            {getIcon(toast.type)}
            <span className="font-medium">{toast.message}</span>
            <div
              className={`absolute left-0 bottom-0 h-1 ${getProgressColor(
                toast.type
              )} animate-progress`}
            />
          </div>
        ))}
      </div>

      {/* Tailwind Animations */}
      <style>{`
        @keyframes slide-in-left {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.5s forwards;
        }

        @keyframes progress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        .animate-progress {
          animation: progress 6s linear forwards;
        }

        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
