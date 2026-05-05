const FONNTE_SEND_URL = "https://api.fonnte.com/send";

type SendWhatsAppInput = {
  target: string;
  message: string;
};

type FonnteSuccessResponse = {
  status: true;
  detail?: string;
  id?: string[] | string;
  requestid?: number;
  target?: string[] | string;
};

type FonnteErrorResponse = {
  status?: false;
  Status?: false;
  reason?: string;
  detail?: string;
  requestid?: number;
};

export function normalizeWhatsappForFonnte(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("62")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  return digits;
}

function getFonnteToken() {
  const token = process.env.FONNTE_TOKEN;

  if (!token) {
    throw new Error("FONNTE_TOKEN belum diisi di environment variable.");
  }

  return token;
}

async function postToFonnte(input: SendWhatsAppInput) {
  const token = getFonnteToken();
  const body = new URLSearchParams({
    target: normalizeWhatsappForFonnte(input.target),
    message: input.message,
  });

  console.log("[Fonnte] POST", FONNTE_SEND_URL, {
    target: body.get("target"),
    messagePreview: input.message.slice(0, 80),
  });

  const response = await fetch(FONNTE_SEND_URL, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const json = (await response.json()) as FonnteSuccessResponse | FonnteErrorResponse;
  const isSuccess = json.status === true;

  if (!isSuccess) {
    throw new Error(json.reason || json.detail || "Pengiriman WhatsApp gagal.");
  }

  return json;
}

export async function sendWhatsApp(input: SendWhatsAppInput) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const payload = await postToFonnte(input);

      console.log("[Fonnte] success", {
        attempt,
        target: normalizeWhatsappForFonnte(input.target),
        requestid: payload.requestid,
      });

      return payload;
    } catch (error) {
      lastError = error;
      console.error("[Fonnte] send failed", {
        attempt,
        target: normalizeWhatsappForFonnte(input.target),
        error,
      });
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error("Pengiriman WhatsApp gagal.");
}
