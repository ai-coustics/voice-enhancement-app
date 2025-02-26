<script lang="ts">
  export let steps: string[];
  export let current: number = 0;
  export let stepWidth: number = 200;

  const circleRadius = 10;
</script>

<div class="flex flex-row">
  {#each steps as step, i}
    <div style="width: {stepWidth}px">
      <svg viewBox="0 0 {stepWidth} {2 * circleRadius}">
        {#if i > 0}
          <line
            class:text-flamingo={i <= current}
            class:text-misty-rose={i > current}
            x1="0"
            x2={stepWidth / 2 - circleRadius}
            y1={circleRadius}
            y2={circleRadius}
            stroke="currentColor"
            stroke-width="2"
          />
        {/if}
        <circle
          class:text-flamingo={i <= current}
          class:text-misty-rose={i > current}
          cx={stepWidth / 2}
          cy={circleRadius}
          r={circleRadius}
          fill="currentColor"
        />
        {#if i < steps.length - 1}
          <line
            class:text-flamingo={i < current}
            class:text-misty-rose={i >= current}
            x1={stepWidth / 2 + circleRadius}
            x2={stepWidth}
            y1={circleRadius}
            y2={circleRadius}
            stroke="currentColor"
            stroke-width="2"
          />
        {/if}
      </svg>
      <div
        class="mt-5 text-center"
        class:text-black={i <= current}
        class:text-sand={i > current}
        class:font-semibold={i == current}
      >
        {step}
      </div>
    </div>
  {/each}
</div>
