<script lang="ts">
  export let color: string = 'text-black';
  export let backgroundColor: string = 'bg-sleet';
</script>

<span class="inline-block rounded-md {color} {backgroundColor} font-medium text-sm px-2 py-1">
  <slot />
</span>
