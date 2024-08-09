import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { otpSchema } from '$lib/schemas';
import { jsonToFormData } from '$lib/utils.js';

export const load: PageServerLoad = async () => {
  return { form: await superValidate(zod(otpSchema)) };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(otpSchema));
    const data = JSON.parse(event.cookies.get('mlbb-tracker-tmp')!);

    const structuredData = {
      roleId: data.roleId,
      zoneId: data.zoneId,
      vc: form.data.otp,
      type: 'web'
    } as Record<string, unknown>;

    const body = jsonToFormData(structuredData);

    const response = {
      form,
      success: false,
      msg: ''
    };

    if (!form.valid) {
      return fail(400, response);
    }

    const res = await fetch('https://api.mobilelegends.com/base/login', {
      method: 'POST',
      body: body
    });

    if (!res.ok) return fail(400, response);

    const json: BaseResponse<LoginData> = await res.json();
    if (json.code !== 0) return fail(400, response);

    event.cookies.delete('mlbb-tracker-tmp', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/'
    });

    event.cookies.set('mlbb-tracker-tkn', `Bearer ${json.data?.jwt}`, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/'
    });

    response.success = true;
    response.msg = 'success';

    return response;
  }
};
