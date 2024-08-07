<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';
  import { onMount } from 'svelte';
  import OtpForm from '$lib/components/custom/otp-form.svelte';
  import type { ActionData, PageServerData } from './$types';
  import { browser } from '$app/environment';

  export let data: PageServerData;
  export let form: ActionData;

  $: {
    if (browser && !$authStore.authenticating) {
      goto('/auth/login');
    }

    if (form?.success) {
      goto('/');
    }
  }
</script>

<OtpForm data={data.form} {...$authStore} />
