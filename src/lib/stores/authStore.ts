import { writable } from 'svelte/store';

interface AuthStore {
  roleId: string;
  zoneId: string;
  authenticating: boolean;
}

export const authStore = writable<AuthStore>({
  roleId: '',
  zoneId: '',
  authenticating: false
});
