import { auth } from "@clerk/nextjs/server";
import { apiFetch } from "../lib/api";

export async function registerUserIntoDB() {
  const { userId } = await auth();
  console.log(userId);
//   return apiFetch("/user");
}
