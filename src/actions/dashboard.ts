import { apiFetch } from "../lib/api";

export async function getDashboardData() {
  return apiFetch("/dashboard");
}
