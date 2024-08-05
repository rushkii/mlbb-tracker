import { writable } from 'svelte/store';

interface AuthStore {
  roleId: string | number;
  zoneId: string | number;
  authenticating: boolean;
}

export const authStore = writable<AuthStore>({
  roleId: '',
  zoneId: '',
  authenticating: false
});
