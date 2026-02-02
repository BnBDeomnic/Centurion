// Mock Payment Service untuk Demo
// Tidak memerlukan API key - simulasi pembayaran untuk portfolio

export interface MockPaymentChannel {
    code: string;
    name: string;
    group: string;
    icon: string;
    fee: number;
}

export interface MockTransaction {
    reference: string;
    merchant_ref: string;
    payment_method: string;
    payment_name: string;
    amount: number;
    fee: number;
    total: number;
    pay_code: string;
    expired_time: number;
    status: "PENDING" | "PAID" | "EXPIRED";
    created_at: number;
}

// Daftar metode pembayaran (simulasi)
export const PAYMENT_CHANNELS: MockPaymentChannel[] = [
    { code: "QRIS", name: "QRIS (Semua E-Wallet)", group: "E-Wallet", icon: "📱", fee: 750 },
    { code: "BRIVA", name: "BRI Virtual Account", group: "Virtual Account", icon: "🏦", fee: 2500 },
    { code: "BCAVA", name: "BCA Virtual Account", group: "Virtual Account", icon: "🏦", fee: 2500 },
    { code: "MANDIRIVA", name: "Mandiri Virtual Account", group: "Virtual Account", icon: "🏦", fee: 2500 },
    { code: "OVO", name: "OVO", group: "E-Wallet", icon: "💜", fee: 1500 },
    { code: "DANA", name: "DANA", group: "E-Wallet", icon: "💙", fee: 1500 },
    { code: "GOPAY", name: "GoPay", group: "E-Wallet", icon: "💚", fee: 1500 },
    { code: "SHOPEEPAY", name: "ShopeePay", group: "E-Wallet", icon: "🧡", fee: 1500 },
];

// Generate virtual account / pay code
function generatePayCode(method: string): string {
    const prefix: Record<string, string> = {
        BRIVA: "1089",
        BCAVA: "7770",
        MANDIRIVA: "8892",
        OVO: "0812",
        DANA: "0813",
        GOPAY: "0814",
        SHOPEEPAY: "0815",
        QRIS: "",
    };

    const randomDigits = Math.floor(Math.random() * 10000000000).toString().padStart(10, "0");
    return (prefix[method] || "") + randomDigits;
}

// Generate reference number
function generateReference(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "DEV";
    for (let i = 0; i < 12; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Simpan transaksi di localStorage (untuk demo)
const STORAGE_KEY = "mock_transactions";

function getStoredTransactions(): Record<string, MockTransaction> {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
}

function saveTransaction(transaction: MockTransaction): void {
    if (typeof window === "undefined") return;
    const transactions = getStoredTransactions();
    transactions[transaction.reference] = transaction;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

/**
 * Buat transaksi baru (simulasi)
 */
export function createMockTransaction(
    method: string,
    amount: number,
    merchantRef?: string
): MockTransaction {
    const channel = PAYMENT_CHANNELS.find((c) => c.code === method);
    const fee = channel?.fee || 2500;

    const transaction: MockTransaction = {
        reference: generateReference(),
        merchant_ref: merchantRef || `INV-${Date.now()}`,
        payment_method: method,
        payment_name: channel?.name || method,
        amount: amount,
        fee: fee,
        total: amount + fee,
        pay_code: generatePayCode(method),
        expired_time: Date.now() + 24 * 60 * 60 * 1000, // 24 jam
        status: "PENDING",
        created_at: Date.now(),
    };

    saveTransaction(transaction);
    return transaction;
}

/**
 * Ambil detail transaksi
 */
export function getMockTransaction(reference: string): MockTransaction | null {
    const transactions = getStoredTransactions();
    const transaction = transactions[reference];

    if (!transaction) return null;

    // Cek apakah sudah expired
    if (transaction.status === "PENDING" && Date.now() > transaction.expired_time) {
        transaction.status = "EXPIRED";
        saveTransaction(transaction);
    }

    return transaction;
}

/**
 * Simulasi pembayaran berhasil (untuk testing)
 */
export function simulatePayment(reference: string): MockTransaction | null {
    const transactions = getStoredTransactions();
    const transaction = transactions[reference];

    if (!transaction) return null;

    if (transaction.status === "PENDING") {
        transaction.status = "PAID";
        saveTransaction(transaction);
    }

    return transaction;
}

/**
 * Get payment channels grouped
 */
export function getPaymentChannelsGrouped(): Record<string, MockPaymentChannel[]> {
    return PAYMENT_CHANNELS.reduce((acc, channel) => {
        if (!acc[channel.group]) {
            acc[channel.group] = [];
        }
        acc[channel.group].push(channel);
        return acc;
    }, {} as Record<string, MockPaymentChannel[]>);
}
