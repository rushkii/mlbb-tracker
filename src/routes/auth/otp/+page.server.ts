import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { otpSchema } from '$lib/schemas';
import { useHttp, type ResponseAPI } from '$lib/http';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) redirect(307, '/');
  return { form: await superValidate(zod(otpSchema)) };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(otpSchema));
    const data = JSON.parse(event.cookies.get('tmp')!);

    let response = {
      form,
      success: false,
      msg: ''
    };

    if (!form.valid) {
      return fail(400, response);
    }

    const res = useHttp<ResponseAPI<{ jwt: string }>, { jwt: string }>({
      url: 'https://api.mobilelegends.com/base/login',
      method: 'POST',
      useFormData: true,
      variables: {
        roleId: data.roleId,
        zoneId: data.zoneId,
        vc: form.data.otp,
        type: 'web'
      },

      onComplete(res) {
        if (res.data?.code !== 0) {
          return fail(400, response);
        }

        event.cookies.delete('tmp', {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24,
          path: '/'
        });
        event.cookies.set('tkn', `Bearer ${res.data.data?.jwt}`, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24,
          path: '/'
        });

        response = { form, success: true, msg: 'success' };
      },

      onError(_, msg) {
        return fail(400, { form, success: false, msg: msg! });
      }
    });

    await res.execute();

    return response;
  }
};
