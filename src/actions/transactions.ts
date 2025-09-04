import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FieldValues } from "react-hook-form";
import { apiFetch } from "../lib/api";
import type { ApiResponse, TTransaction } from "../types";

// API call to create a transaction
async function createTransaction(
  data: FieldValues,
  token: string
): Promise<ApiResponse<TTransaction>> {
  const result = await apiFetch<ApiResponse<TTransaction>>("/transactions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return result;
}

// React Query hook for creating a transaction
export function useCreateTransaction(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FieldValues) => createTransaction(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", token] });
      queryClient.invalidateQueries({ queryKey: ["accounts", token] });
      queryClient.invalidateQueries({ queryKey: ["budget", token] });
    },
  });
}
