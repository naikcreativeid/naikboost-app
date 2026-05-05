import { track } from "@vercel/analytics/server";

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

export async function trackServerEvent(eventName: string, payload?: AnalyticsPayload) {
  try {
    await track(eventName, payload);
  } catch (error) {
    console.error("[Analytics:server] track failed", { eventName, payload, error });
  }
}
