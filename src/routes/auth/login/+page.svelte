<script lang="ts">
  import type { ActionData, PageServerData } from './$types';
  import LoginForm from '$lib/components/custom/login-form.svelte';
  import { goto } from '$app/navigation';

  export let data: PageServerData;
  export let form: ActionData;

  $: if (form?.success) {
    goto('/auth/otp');
  }
</script>

<LoginForm data={data.form} />
