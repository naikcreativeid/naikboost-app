export type BankOption = {
  code: "BCA" | "BRI" | "Mandiri";
  name: string;
  accountNumber: string;
  accountName: string;
};

export const BANK_OPTIONS: BankOption[] = [
  {
    code: "BCA",
    name: "BCA",
    accountNumber: "1234567890",
    accountName: "NaikBoost Indonesia",
  },
  {
    code: "BRI",
    name: "BRI",
    accountNumber: "1234567890",
    accountName: "NaikBoost Indonesia",
  },
  {
    code: "Mandiri",
    name: "Mandiri",
    accountNumber: "1234567890",
    accountName: "NaikBoost Indonesia",
  },
];
