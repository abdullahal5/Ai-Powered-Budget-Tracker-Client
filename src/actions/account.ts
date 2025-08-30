import { apiFetch } from "@/lib/api";

export async function getUserAccounts() {
  return apiFetch("/accounts");
}
