import { defineStore } from "pinia";
import { ref } from "vue";
import type { Stream, Layout, StreamPosition } from "../types/stream";

export const useStreamStore = defineStore("stream", () => {
  const streams = ref<Stream[]>([]);
  const favorites = ref<string[]>([]);
  const currentLayout = ref<Layout>({
    id: "2x2",
    name: "2x2 Grid",
    rows: 2,
    columns: 2,
  });
  const customPositions = ref<StreamPosition[]>([]);

  const addStream = (stream: Stream) => {
    streams.value.push(stream);
  };

  const removeStream = (streamId: string) => {
    streams.value = streams.value.filter((s) => s.id !== streamId);
  };

  const toggleFavorite = (channelName: string) => {
    const index = favorites.value.indexOf(channelName);
    if (index === -1) {
      favorites.value.push(channelName);
    } else {
      favorites.value.splice(index, 1);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites.value));
  };

  const setLayout = (layout: Layout) => {
    currentLayout.value = layout;
  };

  const updateStreamPosition = (position: StreamPosition) => {
    const index = customPositions.value.findIndex(
      (p) => p.streamId === position.streamId
    );
    if (index === -1) {
      customPositions.value.push(position);
    } else {
      customPositions.value[index] = position;
    }
  };

  // Load favorites from localStorage on initialization
  const savedFavorites = localStorage.getItem("favorites");
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites);
  }

  return {
    streams,
    favorites,
    currentLayout,
    customPositions,
    addStream,
    removeStream,
    toggleFavorite,
    setLayout,
    updateStreamPosition,
  };
});
