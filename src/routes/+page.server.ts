import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, locals }) => {
  if (!locals.user) redirect(307, '/auth/login');

  const res = await fetch('/api/hero/winrate');
  if (!res.ok) return { success: false };

  const data = await res.json();
  return {
    success: true,
    ...data.data
  };
};
