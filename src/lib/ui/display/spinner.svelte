<script lang="ts">
  import preset from '$lib/ui/tailwind-preset';

  interface Props {
    color?: any;
    unit?: string;
    duration?: string;
    size?: number;
    pause?: boolean;
  }

  const {
    color = preset.theme.colors['salmon'],
    unit = 'px',
    duration = '0.75s',
    size = 60,
    pause = false
  }: Props = $props();
</script>

<div
  class="circle"
  class:pause-animation={pause}
  style="--size: {size}{unit}; --color: {color}; --duration: {duration}"
></div>

<style>
  .circle {
    height: var(--size);
    width: var(--size);
    border-color: var(--color) transparent var(--color) var(--color);
    border-width: calc(var(--size) / 15);
    border-style: solid;
    border-image: initial;
    border-radius: 50%;
    animation: var(--duration) linear 0s infinite normal none running rotate;
    flex-shrink: 0;
    flex-grow: 0;
  }
  .pause-animation {
    animation-play-state: paused;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
