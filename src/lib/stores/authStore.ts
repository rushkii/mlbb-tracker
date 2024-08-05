import { writable } from 'svelte/store';

export const authStore = writable<boolean>(false);
