<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Dropzone from 'svelte-file-dropzone';
  import Icon from '$lib/ui/display/icon.svelte';
  import Button from '$lib/ui/buttons/button.svelte';
  import { formatDuration } from '$lib/utils/format';
  import Upload from '$lib/ui/icons/upload.svelte';
  import { ALLOWED_FILE_TYPES, MAX_UPLOAD_DURATION } from '../../../constants';

  // --- Exports ---

  export let isDraggingOver = false;

  const dispatch = createEventDispatcher<{
    accepted: File;
    rejected: string;
  }>();

  async function getTotalDuration(files: File[]) {
    const promises = Array.from(files).map((file) => {
      return new Promise<number>((resolve) => {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
        audio.load();
        audio.onloadedmetadata = () => {
          resolve(audio.duration);
        };
        audio.onerror = (error) => {
          console.log('Error loading audio file', file.name, error);
          resolve(0);
        };
      });
    });
    const durations = await Promise.all(promises);
    const totalSeconds = durations.reduce((acc, duration) => acc + duration, 0);
    return totalSeconds;
  }

  async function onDrop(event: any) {
    const { acceptedFiles } = event.detail;

    if (acceptedFiles.length === 0) {
      return;
    }
    const file = acceptedFiles[0];

    const totalDuration = await getTotalDuration(file);
    if (totalDuration > MAX_UPLOAD_DURATION) {
      dispatch(
        'rejected',
        `The duration of the selected file is ${formatDuration(totalDuration, 'h:m:s')}, ` +
          `which exceeds the maximum upload limit of ${formatDuration(MAX_UPLOAD_DURATION, 'h:m:s')}.`
      );
      return;
    }

    dispatch('accepted', file);
  }
</script>

<!-- Important that Dropzone covers entire parent for drop handling -->
<Dropzone
  disableDefaultStyles
  containerClasses="w-full h-full p-9 flex flex-col items-center gap-12"
  accept={ALLOWED_FILE_TYPES.join(',')}
  multiple={false}
  on:drop={onDrop}
  on:dragenter={() => (isDraggingOver = true)}
  on:dragleave={() => (isDraggingOver = false)}
>
  <Icon size="lg" class="mt-2 text-flamingo">
    <Upload />
  </Icon>

  <div class="flex flex-col items-center gap-3">
    <h2 class="text-center">2. Drop file here</h2>
    <p class="text-mineshaft">Select an audio file to enhance.</p>
  </div>

  <Button size="sm">Select file</Button>
</Dropzone>
