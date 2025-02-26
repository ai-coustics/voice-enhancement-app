<script context="module" lang="ts">
  export interface ToastOptions {
    message: string;
    description?: string;
    type?: ToastType;
  }

  export function triggerToast(options: ToastOptions) {
    dispatchEvent(
      new CustomEvent<ToastOptions>('trigger-toast', {
        detail: { ...options }
      })
    );
  }

  export function triggerSuccessToast(options: ToastOptions) {
    dispatchEvent(
      new CustomEvent<ToastOptions>('trigger-toast', {
        detail: { ...options, type: 'success' }
      })
    );
  }

  export function triggerErrorToast(options: ToastOptions) {
    dispatchEvent(
      new CustomEvent<ToastOptions>('trigger-toast', {
        detail: { ...options, type: 'error' }
      })
    );
  }
</script>

<script lang="ts">
  import Toast, { type ToastType } from './toast.svelte';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  let toasts: Array<ToastOptions & { id: string }> = [];

  function handleTrigger(e: Event) {
    const event = e as CustomEvent<ToastOptions>;
    const detail = event.detail;

    const id = new Date().toISOString();
    toasts = [{ ...detail, id }, ...toasts];

    const timeout = 8000;
    setTimeout(() => {
      closeToast(id);
    }, timeout);
  }

  function closeToast(id: string) {
    toasts = toasts.filter(existingToast => existingToast.id !== id);
  }

  onMount(() => {
    window.addEventListener('trigger-toast', handleTrigger);
    return () => {
      window.removeEventListener('trigger-toast', handleTrigger);
    };
  });
</script>

<!-- 
  It's important to keep both the padding (otherwise toast box shadows will be cut off), and the
  overflow-hidden (otherwise the out transition will cause a jank when a horizontal scrollbar
  briefly appears). 
-->
<div
  class="absolute p-10 left-4 right-4 top-0 z-[60] flex flex-col items-end gap-4 overflow-hidden pointer-events-none"
>
  {#each toasts as toast (toast.id)}
    <div in:fly={{ y: -30, duration: 200 }} out:fly={{ x: 300, duration: 300 }}>
      <Toast
        type={toast.type}
        message={toast.message}
        description={toast.description}
        on:close={() => closeToast(toast.id)}
      />
    </div>
  {/each}
</div>
