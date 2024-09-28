<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-6">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
      <!-- Chat Header -->
      <h1 class="text-3xl font-semibold text-gray-700 text-center mb-6">Real-time Chat</h1>

      <!-- Chat Messages -->
      <div class="border border-gray-300 rounded-lg overflow-y-auto h-96 mb-4 p-4 bg-gray-50" ref="chatContainer">
        <div v-for="(message, index) in messages" :key="index" class="mb-2">
          <div :class="{'text-right': message.sender === 'You'}">
            <span class="font-semibold" :class="{'text-blue-600': message.sender === 'You', 'text-gray-600': message.sender !== 'You'}">
              {{ message.sender }}:
            </span>
            <span class="ml-2">{{ message.text }}</span>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="flex">
        <input
          v-model="message"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type your message..."
          class="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-indigo-500"
        />
        <button
          @click="sendMessage"
          class="bg-indigo-500 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-600 focus:outline-none"
        >
          Send
        </button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import WebSocketService from '../service/webSocketService'; // Your WebSocket service class
const messages = ref<Array<{ sender: string; text: string }>>([]);
const message = ref<string>('');
const chatContainer = ref<HTMLElement | null>(null);
const wsService = ref<WebSocketService | null>();
onMounted(() => {
  const user = JSON.parse(localStorage.getItem("user") as string);
  const token = user.id;
  const wsUrl = `ws://5.182.26.58:4321/ws/web?token=${token}`;
  wsService.value = new WebSocketService(wsUrl);
  wsService.value.connect();
  if (wsService.value.socket) {
    wsService.value.socket.onmessage = (event: MessageEvent) => {
      const serverMessage = JSON.parse(event.data);
      messages.value.push({ sender: 'Server', text: serverMessage });
      scrollToBottom();
    };
  }
});

const sendMessage = () => {
  if (message.value.trim() && wsService.value) {
    wsService.value.sendMessage(message.value);
    messages.value.push({ sender: 'You', text: message.value });
    message.value = '';
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

</script>

<style scoped>
/* You can add any custom styles here */
</style>
