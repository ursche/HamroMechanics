import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import BASE_API_URL from "./baseApi";
import saveTokens from "./saveTokens";


export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refresh = await SecureStore.getItemAsync("refresh_token");
    if (!refresh) return null;

    const res = await axios.post(`${BASE_API_URL}/api/users/token/refresh/`, { refresh });

    if (res.status === 200) {
      const newAccess = res.data.access;
      const newRefresh = res.data.refresh;

			saveTokens(newAccess, newRefresh);
      return newAccess;
    }
  } catch (error) {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");

		router.replace("/LoginChoice"); // adjust path as per your app

    return null;
  }

  return null;
}
