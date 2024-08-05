import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { otpSchema } from '$lib/schemas';
import { useHttp } from '$lib/http';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(otpSchema))
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(otpSchema));

    let response = {
      form,
      success: false,
      msg: ''
    };

    if (!form.valid) {
      return fail(400, response);
    }

    console.log(form.data);

    const res = useHttp({
      url: 'https://api.mobilelegends.com/base/login',
      method: 'POST',
      useFormData: true,
      variables: {
        roleId: 57241008,
        zoneId: 2091,
        vc: form.data.otp
      },

      onComplete() {
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
