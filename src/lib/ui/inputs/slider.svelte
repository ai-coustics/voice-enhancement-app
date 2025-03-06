<script lang="ts">
  import preset from '$lib/ui/tailwind-preset';

  interface Props {
    class?: string;
    value?: number;
    oninput?: (value: number) => void;
  }

  let { class: className = '', value = $bindable(0.5), oninput }: Props = $props();

  function handleInput(e: Event) {
    const inputEl = e.target as HTMLInputElement;
    const v = Number(inputEl.value);
    oninput?.(v);
  }

  // It's not possible to style the left side of the track separately from the right in Webkit,
  // so we fake it with a dynamically updating gradient.
  const inputStyles = $derived(
    `background: linear-gradient(
      to right, 
      ${preset.theme.colors.flamingo} ${100 * value}%,
      ${preset.theme.colors.sleet} ${100 * value}%
    )`
  );
</script>

<input
  class={className}
  type="range"
  min="0"
  max="1"
  step="any"
  bind:value
  oninput={handleInput}
  style={inputStyles}
/>

<style lang="postcss">
  /* Reset */
  input[type='range'] {
    appearance: none;
    -webkit-appearance: none;
    border-radius: 0.5rem;
    height: 0.6rem;
    cursor: pointer;
  }

  /* Webkit */
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    margin-top: 0rem;
    border-radius: 0.75rem;
    box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.1);
    @apply bg-white;
  }

  input[type='range']::-webkit-slider-thumb:hover {
    @apply bg-royal-blue;
  }

  /* Firefox */
  input[type='range']::-moz-range-thumb {
    width: 1.5rem;
    height: 1.5rem;
    margin-top: 0rem;
    border-color: transparent;
    border-radius: 0.75rem;
    box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.1);
    @apply bg-white;
  }

  input[type='range']::-webkit-slider-thumb:hover {
    @apply bg-royal-blue;
  }
</style>
