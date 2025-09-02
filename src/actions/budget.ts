// hooks/useBudget.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { FieldValues } from "react-hook-form";
import { apiFetch } from "../lib/api";
import type { ApiResponse } from "../types";

export type TBudget = {
  budget: {
    id: string;
    amount: number;
    lastAlertSent?: Date | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  currentExpenses: number;
};

// Fetch current budget by accountId
async function fetchMyCurrentBudget(
  token: string,
  accountId: string
): Promise<ApiResponse<TBudget>> {
  const result = await apiFetch<ApiResponse<TBudget>>(`/budget/${accountId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return result;
}

// Update budget
async function updateBudget(
  data: FieldValues,
  token: string
): Promise<ApiResponse<TBudget>> {
  const result = await apiFetch<ApiResponse<TBudget>>("/budget/update", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return result;
}

// React Query hook to fetch budget
export function useMyCurrentBudget(
  token: string,
  accountId: string,
  options?: Omit<UseQueryOptions<ApiResponse<TBudget>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: ["budget", token, accountId],
    queryFn: () => fetchMyCurrentBudget(token, accountId),
    enabled: !!token && !!accountId,
    ...options,
  });
}

// React Query hook to update budget
export function useUpdateBudget(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FieldValues) => updateBudget(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", token] });
    },
  });
}
