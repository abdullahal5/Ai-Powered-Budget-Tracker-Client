/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import type { ApiResponse } from "../types";

async function postGeminiFile(
  file: File,
  token: string
): Promise<ApiResponse<any>> {
  const formData = new FormData();
  formData.append("file", file);

  const result = await apiFetch<ApiResponse<any>>("/gemini", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return result;
}

// React Query hook
export function useGeminiFileUpload(token: string) {
  return useMutation({
    mutationFn: (file: File) => postGeminiFile(file, token),
  });
}
