"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, Clock, CheckCircle, Copy, Check } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useCart } from "@/store/cartStore";
import {
    PAYMENT_CHANNELS,
    createMockTransaction,
    getMockTransaction,
    simulatePayment,
    type MockTransaction
} from "@/lib/mockPayment";
import Header from "../../../components/header";
import Footer from "../../../components/footer";

type CheckoutStep = "cart" | "payment" | "waiting" | "success";

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { darkMode } = useTheme();
    const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();

    const [step, setStep] = useState<CheckoutStep>("cart");
    const [selectedMethod, setSelectedMethod] = useState("");
    const [transaction, setTransaction] = useState<MockTransaction | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [copied, setCopied] = useState(false);

    // Check for existing transaction from URL
    useEffect(() => {
        const ref = searchParams.get("ref");
        if (ref) {
            const existingTx = getMockTransaction(ref);
            if (existingTx) {
                setTransaction(existingTx);
                if (existingTx.status === "PAID") {
                    setStep("success");
                } else if (existingTx.status === "EXPIRED") {
                    setStep("cart");
                } else {
                    setStep("waiting");
                }
            }
        }
    }, [searchParams]);

    // Countdown timer
    useEffect(() => {
        if (transaction && transaction.status === "PENDING") {
            const interval = setInterval(() => {
                const remaining = Math.max(0, transaction.expired_time - Date.now());
                setTimeLeft(remaining);

                if (remaining <= 0) {
                    const updated = getMockTransaction(transaction.reference);
                    if (updated) setTransaction(updated);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [transaction]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatTime = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleCreatePayment = () => {
        if (!selectedMethod) {
            alert("Pilih metode pembayaran terlebih dahulu");
            return;
        }

        const tx = createMockTransaction(selectedMethod, getTotalPrice());
        setTransaction(tx);
        setStep("waiting");

        // Update URL with reference
        router.push(`/checkout?ref=${tx.reference}`);
    };

    const handleSimulatePayment = () => {
        if (transaction) {
            const updated = simulatePayment(transaction.reference);
            if (updated) {
                setTransaction(updated);
                setStep("success");
                clearCart();
            }
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Empty cart view
    if (items.length === 0 && step === "cart") {
        return (
            <>
                <Header />
                <main className="container mx-auto px-4 py-8 pt-28 min-h-[60vh] flex flex-col items-center justify-center">
                    <div className={`text-center p-8 rounded-2xl ${darkMode ? "bg-white/5" : "bg-white shadow-lg"}`}>
                        <p className="text-6xl mb-4">🛒</p>
                        <h2 className="text-2xl font-bold mb-2">Keranjang Kosong</h2>
                        <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Belum ada buku di keranjang Anda
                        </p>
                        <button
                            onClick={() => router.push("/")}
                            className={`px-6 py-3 rounded-xl font-semibold ${darkMode ? "bg-yellow-400 text-black" : "bg-purple-700 text-white"
                                }`}
                        >
                            Jelajahi Buku
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Success view
    if (step === "success") {
        return (
            <>
                <Header />
                <main className="container mx-auto px-4 py-8 pt-28 min-h-[60vh] flex flex-col items-center justify-center">
                    <div className={`text-center p-8 rounded-2xl max-w-md ${darkMode ? "bg-white/5" : "bg-white shadow-lg"}`}>
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle size={48} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h2>
                        <p className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Terima kasih atas pembelian Anda
                        </p>
                        {transaction && (
                            <div className={`text-left p-4 rounded-lg mb-6 ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                                <p className="text-sm"><strong>Reference:</strong> {transaction.reference}</p>
                                <p className="text-sm"><strong>Total:</strong> {formatPrice(transaction.total)}</p>
                            </div>
                        )}
                        <button
                            onClick={() => router.push("/")}
                            className={`w-full px-6 py-3 rounded-xl font-semibold ${darkMode ? "bg-yellow-400 text-black" : "bg-purple-700 text-white"
                                }`}
                        >
                            Kembali ke Beranda
                        </button>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Waiting for payment view
    if (step === "waiting" && transaction) {
        const channel = PAYMENT_CHANNELS.find(c => c.code === transaction.payment_method);

        return (
            <>
                <Header />
                <main className="container mx-auto px-4 py-8 pt-28">
                    <div className="max-w-lg mx-auto">
                        <div className={`p-6 rounded-2xl ${darkMode ? "bg-white/5" : "bg-white shadow-lg"}`}>
                            {/* Timer */}
                            <div className="text-center mb-6">
                                <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    Selesaikan pembayaran dalam
                                </p>
                                <div className={`flex items-center justify-center gap-2 text-3xl font-bold ${timeLeft < 300000 ? "text-red-500" : darkMode ? "text-yellow-400" : "text-purple-700"
                                    }`}>
                                    <Clock size={28} />
                                    {formatTime(timeLeft)}
                                </div>
                            </div>

                            {/* Payment details */}
                            <div className={`p-4 rounded-xl mb-6 ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">{channel?.icon}</span>
                                    <div>
                                        <p className="font-semibold">{transaction.payment_name}</p>
                                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                            {transaction.payment_method}
                                        </p>
                                    </div>
                                </div>

                                {transaction.payment_method !== "QRIS" && (
                                    <div className="mb-4">
                                        <p className={`text-sm mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                            Nomor Virtual Account / Kode Bayar
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <code className={`flex-1 text-xl font-mono font-bold tracking-wider ${darkMode ? "text-white" : "text-gray-900"
                                                }`}>
                                                {transaction.pay_code}
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(transaction.pay_code)}
                                                className={`p-2 rounded-lg ${darkMode ? "bg-white/10" : "bg-gray-200"}`}
                                            >
                                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {transaction.payment_method === "QRIS" && (
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-white p-4 rounded-lg">
                                            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                                [QRIS Code Placeholder]
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(transaction.amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Biaya Admin</span>
                                        <span>{formatPrice(transaction.fee)}</span>
                                    </div>
                                    <div className={`flex justify-between pt-2 border-t font-bold text-lg ${darkMode ? "border-gray-700" : "border-gray-200"
                                        }`}>
                                        <span>Total</span>
                                        <span className={darkMode ? "text-yellow-400" : "text-purple-700"}>
                                            {formatPrice(transaction.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Simulate payment button (for demo) */}
                            <div className={`p-4 rounded-xl mb-4 border-2 border-dashed ${darkMode ? "border-yellow-400/30 bg-yellow-400/5" : "border-purple-300 bg-purple-50"
                                }`}>
                                <p className={`text-sm text-center mb-3 ${darkMode ? "text-yellow-300" : "text-purple-700"}`}>
                                    🎮 Mode Demo - Klik tombol di bawah untuk simulasi pembayaran
                                </p>
                                <button
                                    onClick={handleSimulatePayment}
                                    className={`w-full py-3 rounded-xl font-bold transition-all ${darkMode
                                        ? "bg-green-500 text-white hover:bg-green-400"
                                        : "bg-green-600 text-white hover:bg-green-500"
                                        }`}
                                >
                                    ✅ Simulasi Pembayaran Berhasil
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    setStep("cart");
                                    router.push("/checkout");
                                }}
                                className={`w-full py-3 rounded-xl font-semibold ${darkMode ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                Batalkan Transaksi
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Cart and payment selection view
    return (
        <>
            <Header />

            <main className="container mx-auto px-4 py-8 pt-28">
                <button
                    onClick={() => router.back()}
                    className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-all ${darkMode ? "bg-white/10 hover:bg-white/20" : "bg-white hover:bg-gray-100 shadow-sm"
                        }`}
                >
                    <ArrowLeft size={18} />
                    Kembali
                </button>

                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Keranjang Belanja ({items.length} item)</h2>

                        {items.map((item) => (
                            <div key={item.id} className={`flex gap-4 p-4 rounded-xl ${darkMode ? "bg-white/5" : "bg-white shadow-sm"}`}>
                                <div className="relative w-20 h-28 rounded-lg overflow-hidden shrink-0">
                                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate">{item.title}</h3>
                                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{item.author}</p>
                                    <p className={`font-bold mt-2 ${darkMode ? "text-yellow-400" : "text-purple-700"}`}>
                                        {formatPrice(item.price || 75000)}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end justify-between">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className={`p-2 rounded-lg ${darkMode ? "text-red-400 hover:bg-red-400/20" : "text-red-500 hover:bg-red-50"}`}
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className={`p-1 rounded ${darkMode ? "bg-white/10" : "bg-gray-100"}`}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className={`p-1 rounded ${darkMode ? "bg-white/10" : "bg-gray-100"}`}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment Selection */}
                    <div className="lg:col-span-1">
                        <div className={`sticky top-28 p-6 rounded-xl ${darkMode ? "bg-white/5" : "bg-white shadow-lg"}`}>
                            <h2 className="text-xl font-semibold mb-4">Metode Pembayaran</h2>

                            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                                {PAYMENT_CHANNELS.map((channel) => (
                                    <button
                                        key={channel.code}
                                        onClick={() => setSelectedMethod(channel.code)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${selectedMethod === channel.code
                                            ? darkMode
                                                ? "bg-purple-600 ring-2 ring-purple-400"
                                                : "bg-yellow-100 ring-2 ring-yellow-400"
                                            : darkMode
                                                ? "bg-white/5 hover:bg-white/10"
                                                : "bg-gray-50 hover:bg-gray-100"
                                            }`}
                                    >
                                        <span className="text-xl">{channel.icon}</span>
                                        <div className="flex-1 text-left">
                                            <span className="font-medium block">{channel.name}</span>
                                            <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                +{formatPrice(channel.fee)}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-gray-600/30 pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(getTotalPrice())}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Biaya Admin</span>
                                    <span>{formatPrice(PAYMENT_CHANNELS.find(c => c.code === selectedMethod)?.fee || 0)}</span>
                                </div>
                                <div className={`flex justify-between text-lg font-bold pt-2 border-t ${darkMode ? "border-gray-600/30" : "border-gray-200"}`}>
                                    <span>Total</span>
                                    <span className={darkMode ? "text-yellow-400" : "text-purple-700"}>
                                        {formatPrice(getTotalPrice() + (PAYMENT_CHANNELS.find(c => c.code === selectedMethod)?.fee || 0))}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleCreatePayment}
                                disabled={!selectedMethod}
                                className={`w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${!selectedMethod
                                    ? "opacity-50 cursor-not-allowed bg-gray-400 text-gray-200"
                                    : darkMode
                                        ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:opacity-90"
                                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                                    }`}
                            >
                                <CreditCard size={20} />
                                Lanjut Bayar
                            </button>

                            <p className={`text-xs text-center mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                🎮 Mode Demo - Tidak ada pembayaran asli
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

// Loading component for Suspense fallback
function CheckoutLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );
}

export default function CheckoutPage() {
    const { darkMode } = useTheme();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode
            ? "bg-gradient-to-b from-gray-900 via-[#2C034A] to-[#4B1C6B] text-white"
            : "bg-gradient-to-t from-white to-yellow-100 text-gray-900"
            }`}>
            <Suspense fallback={<CheckoutLoading />}>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}
