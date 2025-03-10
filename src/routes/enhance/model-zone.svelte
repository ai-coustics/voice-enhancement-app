<script lang="ts">
  import Icon from '$lib/ui/display/icon.svelte';
  import Bird from '$lib/ui/icons/bird.svelte';
  import ButtonGroup from '$lib/ui/inputs/button-group.svelte';
  import Badge from '$lib/ui/display/badge.svelte';
  import Zone from '$lib/ui/display/zone.svelte';

  interface Props {
    class?: string;
    model: string;
  }

  let { class: className = '', model = $bindable() }: Props = $props();

  const options = [
    {
      value: 'FINCH',
      label: 'Finch',
      tagLine: 'Robust and great for most tasks.',
      description:
        "Using advanced subtractive technology, Finch is best for eliminating intense background noise, whether it's from street scenes, lectures, or travel vlogs."
    },
    {
      value: 'LARK',
      label: 'Lark',
      tagLine: 'Makes good recordings sparkle.',
      description:
        'With its reconstructive AI technology, Lark is perfect for more complex audio enhancements like restoring missing frequencies, removing reverb and adding depth.'
    }
  ];

  function handleChange(change: string | string[]) {
    const value = Array.isArray(change) ? change[0] : change;
    model = value;
  }
</script>

<Zone class={className}>
  <div class="flex w-full flex-col items-center gap-2">
    <Icon size="xl" class="mt-2 text-flamingo">
      <Bird />
    </Icon>

    <h2 class="m-6 text-center font-semibold [word-break:break-word]">1. Select model</h2>

    <ButtonGroup class="w-full" {options} value={model} onChange={handleChange}>
      {#snippet children({ option })}
        <div class="flex flex-col text-left">
          <div class="mb-2 flex h-[24px] items-center gap-2">
            <div class="label">
              {option.label}
            </div>
            {#if option.isPressed}
              <Badge backgroundColor="bg-flamingo" color="text-white">Active</Badge>
            {/if}
          </div>
          <p class="tag-line">{option.tagLine}</p>
          <p class="description">{option.description}</p>
        </div>
      {/snippet}
    </ButtonGroup>
  </div>
</Zone>

<style lang="postcss">
  .label {
    @apply mr-1 text-lg font-bold text-black;
  }

  .tag-line {
    @apply font-medium text-mineshaft;
  }
  .description {
    @apply text-sm text-mineshaft;
  }
</style>
