import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    return Promise.resolve(window.localStorage.getItem(key));
  } else {
    return SecureStore.getItemAsync(key);
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    window.localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export async function deleteItem(key: string): Promise<void> {
  if (isWeb) {
    window.localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

