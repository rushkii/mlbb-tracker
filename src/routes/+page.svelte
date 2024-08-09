<script lang="ts">
  import { ProfileCard, WinrateTab } from '$lib/components/custom';
  import { onMount } from 'svelte';
  import type { PageServerData } from './$types';
  import { invalidateAll } from '$app/navigation';

  export let data: PageServerData;

  onMount(() => invalidateAll());
</script>

<div class="space-y-5">
  <ProfileCard {data} />
  <WinrateTab {data} />
</div>
