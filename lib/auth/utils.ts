export function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("62")) {
    return `+${digits}`;
  }

  if (digits.startsWith("0")) {
    return `+62${digits.slice(1)}`;
  }

  return `+${digits}`;
}

export function isValidWhatsapp(value: string) {
  return /^(\+62|08)\d{8,13}$/.test(value.replace(/\s|-/g, ""));
}
