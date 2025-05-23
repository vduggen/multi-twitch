<script setup lang="ts">
import { reactive, onMounted, onUnmounted, computed, ref } from "vue";
// @ts-ignore
import { GridLayout, GridItem } from "vue-grid-layout-v3";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const state = reactive({
  layout: [
    {
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      i: "0",
      name: "wastzera",
      showChat: true,
      chatWidth: 33,
    },
    {
      x: 2,
      y: 0,
      w: 2,
      h: 4,
      i: "1",
      name: "brunoballoni",
      showChat: true,
      chatWidth: 33,
    },
    {
      x: 4,
      y: 0,
      w: 2,
      h: 5,
      i: "2",
      name: "brucejok3r",
      showChat: true,
      chatWidth: 33,
    },
    {
      x: 6,
      y: 0,
      w: 2,
      h: 3,
      i: "3",
      name: "matteafrodisiaco",
      showChat: true,
      chatWidth: 33,
    },
  ],
  draggable: true,
  resizable: true,
  margin: [10, 10],
  colNum: 12,
  rowHeight: 30,
  showConfig: false,
});

const marginY = state.margin[1];
const getTotalRows = computed(() => {
  const availableHeight = window.innerHeight;
  return Math.floor((availableHeight + marginY) / (state.rowHeight + marginY));
});
const gridBgHeight = computed(() => {
  const rows = getTotalRows.value;
  return rows * state.rowHeight + (rows + 1) * marginY;
});

function handleResize() {
  state.colNum = state.colNum;
}
onMounted(() => window.addEventListener("resize", handleResize));
onUnmounted(() => window.removeEventListener("resize", handleResize));

onMounted(() => {
  const savedLayout = localStorage.getItem("layout");
  if (savedLayout) {
    // Corrige layouts antigos
    let loaded = JSON.parse(savedLayout);
    loaded.forEach((item: any) => {
      if (item.showChat === undefined) item.showChat = true;
      if (item.chatWidth === undefined) item.chatWidth = 33;
    });
    state.layout = loaded;
  }
});
function saveLayout() {
  localStorage.setItem("layout", JSON.stringify(state.layout));
}
function abrirConfig() {
  state.showConfig = !state.showConfig;
}

const newStream = ref("");
function addStream() {
  const name = newStream.value.trim().toLowerCase();
  if (!name || state.layout.some((item) => item.name === name)) {
    newStream.value = "";
    return;
  }
  const nextIndex = state.layout.length
    ? String(Math.max(...state.layout.map((item) => parseInt(item.i))) + 1)
    : "0";
  state.layout.push({
    x: (state.layout.length * 2) % state.colNum,
    y: Math.floor((state.layout.length * 2) / state.colNum),
    w: 2,
    h: 3,
    i: nextIndex,
    name,
    showChat: false,
    chatWidth: 33,
  });
  newStream.value = "";
  saveLayout();
}
function removeStream(i: any) {
  const idx = state.layout.findIndex((item) => item.i === i);
  if (idx !== -1) {
    state.layout.splice(idx, 1);
    saveLayout();
  }
}
function toggleChat(i: any) {
  const idx = state.layout.findIndex((item) => item.i === i);
  if (idx !== -1) {
    state.layout[idx].showChat = !state.layout[idx].showChat;
    saveLayout();
  }
}
</script>

<template>
  <div
    class="relative w-full h-screen bg-gradient-to-br from-slate-800 to-slate-900 overflow-y-auto"
  >
    <!-- Botão fixo para abrir menu (sempre visível) -->
    <button
      @click="abrirConfig"
      class="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-full shadow-lg w-12 h-12 flex items-center justify-center transition"
      aria-label="Abrir config"
    >
      <svg
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3"
        />
      </svg>
    </button>

    <!-- Sidebar/config -->
    <transition name="slide">
      <div
        v-if="state.showConfig"
        class="fixed top-0 left-0 h-full bg-white/95 shadow-2xl z-40 px-8 py-6 flex flex-col gap-3 border-r border-slate-200"
      >
        <div class="relative">
          <header
            class="absolute flex items-center justify-between w-full top-0"
          >
            <div class="font-bold text-slate-700 text-lg w-full text-center">
              Configurações
            </div>
            <button
              @click="abrirConfig"
              class="self-end text-slate-500 hover:text-red-600 text-xl focus:outline-none"
              aria-label="Fechar"
            >
              ✕
            </button>
          </header>

          <form @submit.prevent="addStream" class="flex gap-2 mb-4 mt-16">
            <input
              v-model="newStream"
              type="text"
              placeholder="Adicionar canal ex: streamer"
              class="flex-1 px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-purple-500 text-sm"
              autocomplete="off"
            />
            <button
              type="submit"
              class="px-3 py-2 bg-purple-600 text-white font-bold rounded shadow hover:bg-purple-700 active:bg-purple-800 transition text-sm"
            >
              Adicionar
            </button>
          </form>

          <div class="flex-1 overflow-y-auto">
            <div v-if="state.layout.length" class="space-y-2">
              <div
                v-for="item in state.layout"
                :key="item.i"
                class="flex items-center justify-between bg-slate-100 rounded p-2"
              >
                <div class="flex items-center justify-center gap-2">
                  <span class="text-purple-500 text-xs font-bold">●</span>
                  <span
                    class="text-slate-700 text-sm font-medium truncate max-w-[90px]"
                  >
                    {{ item.name }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <label
                    class="flex items-center text-xs text-slate-600 select-none"
                  >
                    <input
                      type="checkbox"
                      class="accent-purple-600 mr-1"
                      :checked="item.showChat"
                      @change="toggleChat(item.i)"
                    />
                    Chat
                  </label>
                  <button
                    @click="removeStream(item.i)"
                    class="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
                    aria-label="Excluir"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-slate-400 text-xs py-8 text-center">
              Nenhuma stream aberta.
            </div>
          </div>

          <button
            @click="saveLayout"
            class="px-3 py-2 mt-4 bg-purple-600 text-white font-bold rounded shadow hover:bg-purple-700 active:bg-purple-800 transition text-sm"
          >
            Salvar Layout
          </button>

          <div class="mt-4 text-xs text-slate-500 text-center">
            Arraste e redimensione as streams livremente.
          </div>
        </div>
      </div>
    </transition>

    <!-- Grid background overlay -->
    <div
      class="grid-bg pointer-events-none absolute top-0 left-0 z-0 rounded-2xl"
      :style="{
        width: 'calc(100% - 20px)',
        height: gridBgHeight + 'px',
        backgroundSize: `calc((100% - 20px) / ${state.colNum}) ${state.rowHeight}px`,
        margin: '10px',
      }"
    />

    <!-- GridLayout -->
    <GridLayout
      v-model:layout="state.layout"
      :margin="state.margin"
      :col-num="state.colNum"
      :row-height="state.rowHeight"
      :is-draggable="state.draggable"
      :is-resizable="state.resizable"
      :vertical-compact="true"
    >
      <GridItem
        v-for="item in state.layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        drag-allow-from=".header-item"
        drag-ignore-from=".chat-player-flex, .resizable-handle"
        resize-ignore-from=".chat-player-flex, .resizable-handle"
      >
        <div
          class="w-full h-full bg-gradient-to-br from-slate-700 to-slate-600 rounded-2xl shadow-xl transition hover:ring-2 hover:ring-purple-400 ring-offset-2 overflow-hidden flex flex-col"
        >
          <div
            class="flex items-center justify-center gap-2 px-2 p-1 bg-slate-800/80 header-item"
          >
            <span class="text-xs font-semibold text-purple-400">●</span>
            <span class="text-slate-100 font-medium text-sm tracking-wide">
              {{ item.name }}
            </span>
            <Dialog>
              <DialogTrigger as-child>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 fill-white cursor-pointer hover:fill-purple-400 transition"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"
                  />
                </svg>
              </DialogTrigger>
              <DialogContent class="w-full h-full max-w-screen">
                <div
                  v-if="item.showChat === false"
                  class="chat-player-flex flex-1 flex flex-col md:flex-row gap-0 relative select-none"
                >
                  <div
                    class="w-full h-72 md:h-full transition-all duration-150"
                  >
                    <iframe
                      :src="`https://player.twitch.tv/?channel=${item.name}&parent=localhost`"
                      frameborder="0"
                      allowfullscreen="true"
                      scrolling="no"
                      class="w-full h-full"
                    />
                  </div>
                </div>
                <ResizablePanelGroup
                  v-else
                  direction="horizontal"
                  class="w-full resizable-handle"
                >
                  <ResizablePanel :default-size="75">
                    <iframe
                      :src="`https://player.twitch.tv/?channel=${item.name}&parent=localhost`"
                      frameborder="0"
                      allowfullscreen="true"
                      scrolling="no"
                      class="w-full h-full"
                    />
                  </ResizablePanel>
                  <ResizableHandle class="resizable-handle" with-handle />
                  <ResizablePanel :default-size="25">
                    <iframe
                      :src="`https://www.twitch.tv/embed/${item.name}/chat?parent=localhost`"
                      frameborder="0"
                      scrolling="no"
                      class="w-full h-full rounded-b-xl"
                    />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </DialogContent>
            </Dialog>
          </div>
          <div
            v-if="item.showChat === false"
            class="chat-player-flex flex-1 flex flex-col md:flex-row gap-0 relative select-none"
          >
            <div class="w-full h-72 md:h-full transition-all duration-150">
              <iframe
                :src="`https://player.twitch.tv/?channel=${item.name}&parent=localhost`"
                frameborder="0"
                allowfullscreen="true"
                scrolling="no"
                class="w-full h-full"
              />
            </div>
          </div>
          <ResizablePanelGroup
            v-else
            direction="horizontal"
            class="w-full resizable-handle"
          >
            <ResizablePanel :default-size="75">
              <iframe
                :src="`https://player.twitch.tv/?channel=${item.name}&parent=localhost`"
                frameborder="0"
                allowfullscreen="true"
                scrolling="no"
                class="w-full h-full"
              />
            </ResizablePanel>
            <ResizableHandle class="resizable-handle" with-handle />
            <ResizablePanel :default-size="25">
              <iframe
                :src="`https://www.twitch.tv/embed/${item.name}/chat?parent=localhost`"
                frameborder="0"
                scrolling="no"
                class="w-full h-full rounded-b-xl"
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </GridItem>
    </GridLayout>
  </div>
</template>

<style scoped>
.grid-bg {
  background-image: linear-gradient(to right, #47556933 1px, transparent 1px),
    linear-gradient(to bottom, #47556933 1px, transparent 1px);
  background-repeat: repeat;
  left: 0;
  top: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s, opacity 0.2s;
}
.slide-enter-from {
  transform: translateX(-120%);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0%);
  opacity: 1;
}
.slide-leave-from {
  transform: translateX(0%);
  opacity: 1;
}
.slide-leave-to {
  transform: translateX(-120%);
  opacity: 0;
}
</style>
