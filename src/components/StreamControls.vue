<script setup lang="ts">
import { ref } from 'vue';
import { useStreamStore } from '../stores/streamStore';
import type { Layout } from '../types/stream';

const store = useStreamStore();
const newStreamUrl = ref('');

const layouts: Layout[] = [
  { id: '1x1', name: 'Single', rows: 1, columns: 1 },
  { id: '2x2', name: '2x2 Grid', rows: 2, columns: 2 },
  { id: '3x3', name: '3x3 Grid', rows: 3, columns: 3 }
];

const addStream = () => {
  const channelName = newStreamUrl.value.trim();
  if (!channelName) return;

  store.addStream({
    id: crypto.randomUUID(),
    platform: 'twitch',
    channelName
  });
  
  newStreamUrl.value = '';
};

const changeLayout = (layout: Layout) => {
  store.setLayout(layout);
};
</script>

<template>
  <div class="bg-gray-800 p-4 rounded-lg">
    <div class="flex gap-4 mb-4">
      <input
        v-model="newStreamUrl"
        placeholder="Enter Twitch channel name"
        class="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white"
        @keyup.enter="addStream"
      />
      <button
        @click="addStream"
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
      >
        Add Stream
      </button>
    </div>
    
    <div class="flex gap-2">
      <button
        v-for="layout in layouts"
        :key="layout.id"
        @click="changeLayout(layout)"
        :class="[
          'px-4 py-2 rounded-lg',
          store.currentLayout.id === layout.id
            ? 'bg-purple-600'
            : 'bg-gray-700 hover:bg-gray-600'
        ]"
      >
        {{ layout.name }}
      </button>
    </div>
  </div>
</template>