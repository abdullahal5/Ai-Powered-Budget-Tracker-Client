// hooks/useAccounts.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { FieldValues } from "react-hook-form";
import { apiFetch } from "../lib/api";
import type { ApiResponse, TAccount } from "../types";

// Fetch accounts
async function fetchAccounts(token: string): Promise<ApiResponse<TAccount[]>> {
  const result = await apiFetch<ApiResponse<TAccount[]>>("/accounts/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return result;
}

// Fetch accounts with transactions
async function fetchAccountsWithTransactions(
  token: string,
  id: string
): Promise<ApiResponse<TAccount>> {
  const result = await apiFetch<ApiResponse<TAccount>>(
    `/accounts/my-transaction/${id}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return result;
}

// Create account
async function postAccount(
  data: FieldValues,
  token: string
): Promise<ApiResponse<TAccount>> {
  const result = await apiFetch<ApiResponse<TAccount>>("/accounts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return result;
}

// Update isDefault status
async function updateIsDefaultStatus(
  id: string,
  data: FieldValues,
  token: string
): Promise<ApiResponse<TAccount>> {
  const result = await apiFetch<ApiResponse<TAccount>>(
    `/accounts/default-status/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  return result;
}

async function bulkDeleteTransactions(
  accountId: string,
  data: FieldValues,
  token: string
) {
  const result = await apiFetch<ApiResponse<TAccount>>(
    `/accounts/bulk-delete/${accountId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  return result;
}

// React Query hook to fetch accounts
export function useAccounts(
  token: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<TAccount[]>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: ["accounts", token],
    queryFn: () => fetchAccounts(token),
    ...options,
  });
}

// React Query hook to create account
export function useCreateAccount(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FieldValues) => postAccount(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts", token] });
    },
  });
}

// React Query hook to update isDefault status
export function useChangeIsDefaultStatus(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FieldValues }) =>
      updateIsDefaultStatus(id, data, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts", token] });
    },
  });
}

// React Query hook to fetch accounts with transaction
export function useAccountsWithTransactions(
  token: string,
  id: string,
  options?: Omit<UseQueryOptions<ApiResponse<TAccount>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: ["accounts", token, id],
    queryFn: () => fetchAccountsWithTransactions(token, id),
    enabled: !!token && !!id,
    ...options,
  });
}

// React Query hook to bulk delete transactions
export function useBulkDeleteTransactions(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FieldValues }) =>
      bulkDeleteTransactions(id, data, token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts", token] });
    },
  });
}
