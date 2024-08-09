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
  export let success: boolean | undefined = undefined;

  let otpRootRef: any;
  let otpInputsRef: HTMLDivElement;
  const otpLength = 4 as const;

  // Set start value
  let value = '';

  const delay = ['delay-0', 'delay-[50ms]', 'delay-100', 'delay-150'];

  const animateOtp = (elements: HTMLCollection, isSuccess: boolean, cb?: () => void) => {
    let borderColor: string;

    if (isSuccess) borderColor = 'border-green-500';
    else borderColor = 'border-red-500';

    Array.from(elements).forEach((el, i) => {
      if (i === otpInputsRef.children.length - 1) {
        el.classList.remove('ring-2', 'ring-ring', 'ring-offset-background');
      }

      el.classList.add('border-2', borderColor, delay[i]);
    });

    cb?.();
  };

  const handleOtpComplete = async (otp: string) => {
    $formData.otp = otp;

    Array.from(otpInputsRef.children).forEach((el, i) => {
      if (i === otpInputsRef.children.length - 1) {
        el.classList.remove('ring-2', 'ring-ring', 'ring-offset-background');
      }

      el.classList.add('border-2', 'border-neutral-500', 'text-5xl', delay[i]);

      setTimeout(() => {
        el.classList.remove('border-2', 'border-neutral-500', 'text-5xl');
        form.submit();
      }, 600);
    });
  };

  const handleOtpChange = () => {
    Array.from(otpInputsRef.children).forEach((el, _) => {
      el.classList.remove('border-2', 'border-neutral-500', 'border-red-500', 'border-green-500');
    });
  };

  const form = superForm(data, {
    validators: zodClient(otpSchema),
    resetForm: false,
    delayMs: 0
  });

  const { form: formData, enhance, allErrors } = form;

  onMount(() => {
    if (!$authStore) goto('/auth/login');
  });

  $: if (success) {
    animateOtp(otpInputsRef.children, success, () => {
      setTimeout(() => {
        goto('/');
      }, 500);
    });
  } else if (!success && success !== undefined) {
    animateOtp(otpInputsRef.children, success);
  }
</script>

{success}

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
        <OTPRoot
          bind:this={otpRootRef}
          bind:value
          maxLength={otpLength}
          autoFocus
          on:change={handleOtpChange}
          onComplete={handleOtpComplete}
          className="flex justify-center items-center gap-2"
        >
          <Form.Field {form} name="otp">
            <Form.Control let:attrs>
              <div bind:this={otpInputsRef} {...attrs} class="flex items-center">
                {#each Array(otpLength) as _, i}
                  <OTPInput
                    index={i}
                    className="relative flex h-20 w-16 items-center justify-center border-y border-r text-3xl
                  transition-all duration-300 first:rounded-l-md first:border-l last:rounded-r-md"
                    focusClassName="z-10 ring-2 ring-ring ring-offset-background"
                  />
                {/each}
              </div>
            </Form.Control>
          </Form.Field>
        </OTPRoot>

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
