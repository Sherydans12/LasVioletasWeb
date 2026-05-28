import type { ContactFormData, ApiResponse } from "@/types";
import { apiClient } from "./api.client";

interface ContactResponse {
  id: string;
  createdAt: string;
}

export async function submitContact(
  data: ContactFormData
): Promise<ApiResponse<ContactResponse>> {
  return apiClient.post<ContactResponse>("/api/contact", data, {
    revalidate: false,
  });
}
