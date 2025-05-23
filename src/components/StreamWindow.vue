<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Stream } from '../types/stream';
import { useStreamStore } from '../stores/streamStore';

const props = defineProps<{
  stream: Stream;
}>();

const store = useStreamStore();
const iframeContainer = ref<HTMLDivElement | null>(null);
const isResizing = ref(false);
const startX = ref(0);
const startY = ref(0);
const startWidth = ref(0);
const startHeight = ref(0);

const removeStream = () => {
  store.removeStream(props.stream.id);
};

const toggleFavorite = () => {
  store.toggleFavorite(props.stream.channelName);
};

const isFavorite = computed(() => {
  return store.favorites.includes(props.stream.channelName);
});

const iframeSrc = computed(() => {
  if (props.stream.platform === 'twitch' && typeof window !== 'undefined') {
    return `https://player.twitch.tv/?channel=${props.stream.channelName}&parent=${window.location.hostname}`;
  }
  return '';
});

const startResize = (e: MouseEvent) => {
  isResizing.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
  if (iframeContainer.value) {
    startWidth.value = iframeContainer.value.offsetWidth;
    startHeight.value = iframeContainer.value.offsetHeight;
  }
  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);
};

const resize = (e: MouseEvent) => {
  if (!isResizing.value || !iframeContainer.value) return;
  
  const deltaX = e.clientX - startX.value;
  const deltaY = e.clientY - startY.value;
  
  const newWidth = startWidth.value + deltaX;
  const newHeight = startHeight.value + deltaY;
  
  iframeContainer.value.style.width = `${newWidth}px`;
  iframeContainer.value.style.height = `${newHeight}px`;
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', resize);
  document.removeEventListener('mouseup', stopResize);
};

onMounted(() => {
  if (iframeContainer.value) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    iframeContainer.value.appendChild(resizeHandle);
    resizeHandle.addEventListener('mousedown', startResize);
  }
});
</script>

<template>
  <div
    ref="iframeContainer"
    class="relative rounded-lg overflow-hidden bg-gray-900"
  >
    <div class="absolute top-2 right-2 z-10 flex gap-2">
      <button
        @click="toggleFavorite"
        class="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
      >
        <span v-if="isFavorite">⭐</span>
        <span v-else>☆</span>
      </button>
      <button
        @click="removeStream"
        class="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
      >
        ✕
      </button>
    </div>
    <iframe
      v-if="stream.platform === 'twitch' && iframeSrc"
      :src="iframeSrc"
      class="w-full h-full"
      allowfullscreen
    ></iframe>
    <div class="resize-handle"></div>
  </div>
</template>

<style scoped>
.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: rgba(128, 128, 128, 0.5);
  cursor: se-resize;
  border-radius: 0 0 4px 0;
}

.resize-handle:hover {
  background: rgba(128, 128, 128, 0.8);
}
</style>