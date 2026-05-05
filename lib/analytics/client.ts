"use client";

import { track } from "@vercel/analytics/react";

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

export function trackClientEvent(eventName: string, payload?: AnalyticsPayload) {
  try {
    track(eventName, payload);
  } catch (error) {
    console.error("[Analytics:client] track failed", { eventName, payload, error });
  }
}
