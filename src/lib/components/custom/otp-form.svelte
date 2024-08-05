<script lang="ts">
  import { OTPInput, OTPRoot } from '@jimmyverburgt/svelte-input-otp';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';
  import { onMount } from 'svelte';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import { otpSchema, type OTPSchema } from '$lib/schemas';
  import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  export let data: SuperValidated<Infer<OTPSchema>>;

  let otpRootRef: any;
  let otpInputsRef: HTMLDivElement;
  let isComplete: boolean = false;

  // Set start value
  let value = '';

  const delay = ['delay-0', 'delay-100', 'delay-200', 'delay-300'];

  const handleOtpComplete = (otp: string) => {
    isComplete = true;
    Array.from(otpInputsRef.children).forEach((el, i) => {
      if (i === otpInputsRef.children.length - 1) {
        el.classList.remove('ring-2', 'ring-ring', 'ring-offset-background');
      }

      el.classList.add('border-2', 'border-green-500', 'text-5xl', delay[i]);

      setTimeout(() => {
        el.classList.remove('border-2', 'border-green-500', 'text-5xl');

        setTimeout(() => {
          el.classList.add('border-2', 'border-green-500');
        }, 400);
      }, 600);
    });
  };

  const form = superForm(data, {
    validators: zodClient(otpSchema),
    resetForm: false,
    delayMs: 0
  });

  const { form: formData, enhance, delayed, allErrors } = form;

  onMount(() => {
    if (!$authStore) goto('/auth/login');
  });
</script>

<div class="flex h-full w-full items-center justify-center">
  <Card.Root class="w-[30rem] p-6">
    <Card.Header class="mb-10 gap-y-2 p-0 text-center">
      <Card.Title class="font-beaufort-bold text-5xl uppercase">Verify OTP</Card.Title>
      <Card.Description class="text-base">
        Please check your in-game mail to get the verification code
      </Card.Description>
    </Card.Header>

    <form method="POST" use:enhance>
      <Card.Content>
        <Form.Field {form} name="otp">
          <Form.Control>
            <OTPRoot
              bind:this={otpRootRef}
              bind:value
              maxLength={4}
              autoFocus={true}
              onComplete={handleOtpComplete}
              className="flex justify-center items-center gap-2"
            >
              <div bind:this={otpInputsRef} class="flex items-center">
                <OTPInput
                  index={0}
                  className="relative flex h-20 w-16 items-center justify-center border-y border-r text-3xl
                  transition-all duration-300 first:rounded-l-md first:border-l last:rounded-r-md"
                  focusClassName="z-10 ring-2 ring-ring ring-offset-background"
                />
                <OTPInput
                  index={1}
                  className="relative flex h-20 w-16 items-center justify-center border-y border-r text-3xl
                  transition-all duration-300 first:rounded-l-md first:border-l last:rounded-r-md"
                  focusClassName="z-10 ring-2 ring-ring ring-offset-background"
                />
                <OTPInput
                  index={2}
                  className="relative flex h-20 w-16 items-center justify-center border-y border-r text-3xl
                  transition-all duration-300 first:rounded-l-md first:border-l last:rounded-r-md"
                  focusClassName="z-10 ring-2 ring-ring ring-offset-background"
                />
                <OTPInput
                  index={3}
                  className="relative flex h-20 w-16 items-center justify-center border-y border-r text-3xl
                  transition-all duration-300 first:rounded-l-md first:border-l last:rounded-r-md"
                  focusClassName="z-10 ring-2 ring-ring ring-offset-background"
                />
              </div>
            </OTPRoot>
          </Form.Control>
        </Form.Field>

        <div class="pt-3">
          <ul class="space-y-1 text-sm text-red-500">
            {#each $allErrors as err}
              {#each err.messages as msg}
                <li class="list-inside list-disc">{msg}</li>
              {/each}
            {/each}
          </ul>
        </div>
      </Card.Content>
    </form>
  </Card.Root>
</div>
