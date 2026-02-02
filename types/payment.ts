// Types for Tripay Payment Gateway
export interface PaymentChannel {
    group: string;
    code: string;
    name: string;
    type: string;
    fee_merchant: {
        flat: number;
        percent: number;
    };
    fee_customer: {
        flat: number;
        percent: number;
    };
    total_fee: {
        flat: number;
        percent: number;
    };
    icon_url: string;
    active: boolean;
}

export interface TripayOrderItem {
    sku?: string;
    name: string;
    price: number;
    quantity: number;
    product_url?: string;
    image_url?: string;
}

export interface CreateTransactionRequest {
    method: string;
    merchant_ref: string;
    amount: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    order_items: TripayOrderItem[];
    callback_url?: string;
    return_url?: string;
    expired_time?: number;
}

export interface TripayTransaction {
    reference: string;
    merchant_ref: string;
    payment_selection_type: string;
    payment_method: string;
    payment_name: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    callback_url: string;
    return_url: string;
    amount: number;
    fee_merchant: number;
    fee_customer: number;
    total_fee: number;
    amount_received: number;
    pay_code?: string;
    pay_url?: string;
    checkout_url: string;
    status: string;
    expired_time: number;
    order_items: TripayOrderItem[];
    instructions?: {
        title: string;
        steps: string[];
    }[];
    qr_string?: string;
    qr_url?: string;
}

export interface TripayResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface TripayCallback {
    reference: string;
    merchant_ref: string;
    payment_method: string;
    payment_method_code: string;
    total_amount: number;
    fee_merchant: number;
    fee_customer: number;
    total_fee: number;
    amount_received: number;
    is_closed_payment: number;
    status: "PAID" | "EXPIRED" | "FAILED" | "REFUND";
    paid_at?: number;
    note?: string;
}
