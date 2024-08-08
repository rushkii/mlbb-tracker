import { parseJwt } from '$lib/utils';
import type { Handle, HandleFetch } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
  const authorization = event.cookies.get('tkn');

  if (authorization) {
    const token = authorization.replace('Bearer ', '');

    try {
      const data = parseJwt(token);
      event.locals['user'] = {
        account: data.Ext,
        token
      };
    } catch {
      console.log('error JWT');
    }
  }

  return await resolve(event);
}) satisfies Handle;

export const handleFetch = (async ({ event, request, fetch }) => {
  if (event.url.pathname.startsWith('/api/auth')) return fetch(request);
  if (!event.url.pathname.startsWith('/api/hero')) return fetch(request);
  if (!event.locals?.user) return fetch(request);

  const token = event.locals?.user.token;
  const modified = new Request(request, {
    ...request,
    method: 'POST',
    headers: {
      authorization: token,
      'x-token': token
    }
  });

  return fetch(modified);
}) satisfies HandleFetch;
