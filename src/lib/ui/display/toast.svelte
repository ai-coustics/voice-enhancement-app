<script context="module" lang="ts">
  export type ToastType = 'info' | 'warning' | 'error' | 'success';
</script>

<script lang="ts">
  import CloseButton from '../buttons/close-button.svelte';
  import InformationCircleIcon from '$lib/ui/icons/information.svelte';
  import { createEventDispatcher } from 'svelte';

  const fgColorMap = {
    info: 'text-info-blue-fg',
    success: 'text-success-green-fg',
    warning: 'text-warning-orange-fg',
    error: 'text-error-red-fg'
  };

  const bgColorMap = {
    info: 'bg-info-blue-bg',
    success: 'bg-success-green-bg',
    warning: 'bg-warning-orange-bg',
    error: 'bg-error-red-bg'
  };

  export let type: ToastType = 'info';
  export let message: string;
  export let description: string = '';

  const dispatch = createEventDispatcher<{
    close: void;
  }>();
</script>

<div
  class="toast-frame border-cloud pointer-events-auto max-w-[500px] cursor-pointer overflow-hidden rounded-lg border bg-white"
>
  <div class="flex justify-between p-4 {description ? 'items-start' : 'items-center'} ">
    <div
      class="{bgColorMap[type]} {fgColorMap[type]} 
        bg-opacity-80 mr-4 h-8 w-8 rounded-lg p-1"
    >
      <InformationCircleIcon />
    </div>
    <div class="mr-2 grow [word-break:break-word]">
      <h4>{message}</h4>
      <p>{description}</p>
    </div>
    <CloseButton
      class="shrink-0 grow-0 self-start"
      size="sm"
      on:click={() => {
        dispatch('close');
      }}
    />
  </div>

  <div class="timer-bar {bgColorMap[type]} -top-2 h-[4px]"></div>
</div>

<style lang="postcss">
  .toast-frame {
    box-shadow: 5px 10px 15px 3px rgb(0 0 0 / 0.5);
  }

  .timer-bar {
    animation: shrink 8s linear forwards;
  }

  @keyframes shrink {
    from {
      width: 100%;
    }

    to {
      width: 0%;
    }
  }
</style>
