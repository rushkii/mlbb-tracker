import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schemas';
import { useHttp } from '$lib/http';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) redirect(307, '/');
  return { form: await superValidate(zod(loginSchema)) };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(loginSchema));

    let response = {
      form,
      success: false,
      msg: ''
    };

    if (!form.valid) {
      return fail(400, response);
    }

    const res = useHttp({
      url: 'https://api.mobilelegends.com/base/sendVc',
      method: 'POST',
      useFormData: true,
      variables: form.data,

      onComplete() {
        event.cookies.set('tmp', JSON.stringify(form.data), {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24,
          path: '/'
        });
        response = { form, success: true, msg: 'success' };
      },

      onError(_, msg) {
        response = { form, success: false, msg: msg! };
      }
    });

    await res.execute();

    return response;
  }
};
