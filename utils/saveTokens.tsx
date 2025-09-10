import * as SecureStore from "expo-secure-store";

async function saveTokens(access: string, refresh: string) {
  await SecureStore.setItemAsync("access_token", access);
  await SecureStore.setItemAsync("refresh_token", refresh);
}

export default saveTokens;