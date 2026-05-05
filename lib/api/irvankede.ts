const IRVANKEDE_API_URL =
  process.env.IRVANKEDE_API_URL || "https://irvankedesmm.co.id/api";

type IrvanKedeApiEnvelope<T> = {
  status: boolean;
  message?: string;
  data: T;
};

export type IrvanKedeBalance = {
  balance: string | number;
  currency?: string;
};

export type IrvanKedeService = {
  id: number | string;
  name: string;
  category: string;
  type?: string;
  price?: string | number;
  rate?: string | number;
  min?: string | number;
  max?: string | number;
  refill?: string | number | boolean;
  refill_days?: string | number;
  description?: string;
  note?: string;
  status?: string | number;
};

export type CreateIrvanKedeOrderInput = {
  service_id: number;
  target: string;
  quantity: number;
};

export type IrvanKedeOrderResponse = {
  id: string | number;
  order_id?: string | number;
  status?: string;
  start_count?: string | number;
  remains?: string | number;
  charge?: string | number;
};

export type IrvanKedeOrderStatus = {
  id?: string | number;
  order_id?: string | number;
  status: string;
  start_count?: string | number;
  remains?: string | number;
  charge?: string | number;
};

export type IrvanKedeRefillResponse = {
  id: string | number;
  refill_id?: string | number;
  status?: string;
};

export type IrvanKedeRefillStatus = {
  id?: string | number;
  refill_id?: string | number;
  status: string;
};

function getCredentials() {
  const apiId = process.env.IRVANKEDE_API_ID;
  const apiKey = process.env.IRVANKEDE_API_KEY;

  if (!apiId || !apiKey) {
    throw new Error("Credential IrvanKede belum diisi di environment variable.");
  }

  return { apiId, apiKey };
}

async function postIrvanKede<T>(
  endpoint: string,
  payload: Record<string, string | number>,
) {
  const { apiId, apiKey } = getCredentials();
  const url = new URL(endpoint, IRVANKEDE_API_URL.endsWith("/") ? IRVANKEDE_API_URL : `${IRVANKEDE_API_URL}/`);
  const body = new URLSearchParams();

  body.set("api_id", apiId);
  body.set("api_key", apiKey);

  for (const [key, value] of Object.entries(payload)) {
    body.set(key, String(value));
  }

  console.log("[IrvanKede] POST", url.toString(), Object.fromEntries(body.entries()));

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = (await response.json()) as IrvanKedeApiEnvelope<T>;

    if (!json.status) {
      throw new Error(json.message || "Permintaan ke IrvanKede gagal.");
    }

    return json.data;
  } catch (error) {
    console.error("[IrvanKede] Request failed", endpoint, error);
    if (error instanceof Error) {
      throw new Error(error.message || "Koneksi ke IrvanKede sedang bermasalah.");
    }

    throw new Error("Koneksi ke IrvanKede sedang bermasalah.");
  }
}

export async function getBalance() {
  return postIrvanKede<IrvanKedeBalance>("profile", {});
}

export async function getServices() {
  return postIrvanKede<IrvanKedeService[]>("services", {});
}

export async function createOrder(input: CreateIrvanKedeOrderInput) {
  return postIrvanKede<IrvanKedeOrderResponse>("order", input);
}

export async function checkOrderStatus(orderIds: string | string[]) {
  const normalizedIds = Array.isArray(orderIds) ? orderIds : [orderIds];

  if (normalizedIds.length === 0 || normalizedIds.length > 5) {
    throw new Error("Maksimal 5 order ID per cek status.");
  }

  return postIrvanKede<IrvanKedeOrderStatus[] | IrvanKedeOrderStatus>("status", {
    order_id: normalizedIds.join(","),
  });
}

export async function requestRefill(orderId: string) {
  return postIrvanKede<IrvanKedeRefillResponse>("refill", {
    order_id: orderId,
  });
}

export async function checkRefillStatus(refillId: string) {
  return postIrvanKede<IrvanKedeRefillStatus>("refill-status", {
    refill_id: refillId,
  });
}
