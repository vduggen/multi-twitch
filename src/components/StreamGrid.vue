<script setup lang="ts">
import { computed } from 'vue';
import { useStreamStore } from '../stores/streamStore';
import StreamWindow from './StreamWindow.vue';
import type { Stream } from '../types/stream';

const store = useStreamStore();

const gridStyle = computed(() => {
  const { rows, columns } = store.currentLayout;
  return {
    display: 'grid',
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '1rem',
    height: '100%',
  };
});
</script>

<template>
  <div class="h-full" :style="gridStyle">
    <StreamWindow
      v-for="stream in store.streams"
      :key="stream.id"
      :stream="stream"
    />
  </div>
</template>