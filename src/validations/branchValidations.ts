import { extractDigits } from "../utils/utils.js";

export function isBranch(cnpj: string): boolean {
  const clean = extractDigits(cnpj);

  if (clean.length !== 14) return false;

  const branchCode = clean.substring(8, 12);

  return branchCode !== "0001";
}