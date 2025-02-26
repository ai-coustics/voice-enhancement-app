<script>
  import preset from '$lib/ui/tailwind-preset';

  export let color = preset.theme.colors['salmon'];
  export let unit = 'px';
  export let duration = '0.75s';
  export let size = 60;
  export let pause = false;
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
