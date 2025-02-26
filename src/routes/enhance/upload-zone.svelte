<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Dropzone from 'svelte-file-dropzone';

  import Icon from '$lib/ui/display/icon.svelte';
  import Button from '$lib/ui/buttons/button.svelte';
  import { formatDuration } from '$lib/utils/format';
  import Zone from '$lib/ui/display/zone.svelte';
  import Upload from '$lib/ui/icons/upload.svelte';

  export const ALLOWED_FILE_TYPES = [
    'audio/aac',
    'audio/aacp',
    'audio/aiff',
    'audio/m4a',
    'audio/mp3',
    'audio/mp4',
    'audio/mpa-robust',
    'audio/MPA',
    'audio/mpeg',
    'audio/ogg',
    'audio/opus',
    'audio/vnd.wave',
    'audio/wav',
    'audio/wave',
    'audio/x-aiff',
    'audio/x-m4a',
    'audio/x-wav'
  ];

  const MAX_UPLOAD_DURATION = 60 * 60; // in seconds

  const dispatch = createEventDispatcher<{
    accepted: File;
    rejected: string;
  }>();

  let isDragEnter: boolean;
  let filesInputElement: HTMLElement;
  let files: File[] = [];

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

  async function onFilesChanged(event: any) {
    const isDropzone = event.detail;
    files = Array.from(isDropzone ? event.detail.acceptedFiles : event.target.files);

    if (files.length === 0) {
      return;
    }

    const totalDuration = await getTotalDuration(files);
    if (totalDuration > MAX_UPLOAD_DURATION) {
      dispatch(
        'rejected',
        `The total duration of the selected files is ${formatDuration(totalDuration, 'h:m:s')}, ` +
          `which exceeds the maximum upload limit of ${formatDuration(MAX_UPLOAD_DURATION, 'h:m:s')}.`
      );
      return;
    }

    dispatch('accepted', files[0]);
  }
</script>

<Zone dashed class={isDragEnter ? 'border-royal-blue' : ''}>
  <Dropzone
    containerClasses="!border-transparent !bg-transparent"
    inputElement={filesInputElement}
    accept={ALLOWED_FILE_TYPES.join(',')}
    multiple={false}
    on:drop={onFilesChanged}
    on:dragenter={() => (isDragEnter = true)}
    on:dragleave={() => (isDragEnter = false)}
  >
    <input
      hidden
      multiple
      type="file"
      accept={ALLOWED_FILE_TYPES.join(',')}
      on:change={onFilesChanged}
      bind:this={filesInputElement}
    />

    <Icon size="lg" class="mt-6 text-flamingo">
      <Upload />
    </Icon>

    <h2 class="m-6 text-center">2. Drop audio files here</h2>

    <div class="px-24 sm:p-0">
      <Button>Select files</Button>
    </div>
  </Dropzone>
</Zone>
