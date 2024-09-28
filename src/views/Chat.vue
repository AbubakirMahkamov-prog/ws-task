<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-6">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
      <!-- Chat Header -->
      <h1 class="text-3xl font-semibold text-gray-700 text-center mb-6">Real-time Chat</h1>

      <!-- Chat Messages -->
      <div class="border border-gray-300 rounded-lg overflow-y-auto h-96 mb-4 p-4 bg-gray-50" ref="chatContainer">
        <div v-for="(message, index) in messages" :key="index" class="mb-2">
          <div :class="{'text-right': message.me}">
            <span class="font-semibold" :class="{'text-blue-600': message.me, 'text-gray-600': !message.me}">
              {{ message.sender }}:
            </span>
            <span class="ml-2">{{ message.text }}</span>
          </div>
          <!-- Displaying the message creation timestamp -->
          <div class="text-sm text-gray-400" :class="{'text-right': message.me}">
            {{ new Date(message.created_date).toLocaleDateString() }}
            {{ new Date(message.created_date).toLocaleTimeString() }}
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
    <Modal :is-open="showSelectChat" title="" :close-btn="false" @update:is-open="showSelectChat = false">
        <template #content>
          <div class="bg-gray-100 p-4" style="min-height: calc(100vh - 100px);">
            <div class="max-w-lg mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
              <div  v-for="chat in chatList" @click="selectChat(chat.id)" :key="chat.id" class="relative cursor-pointer flex items-start p-4 space-x-4 border-b border-gray-200">
                
                <!-- Profile Image -->
                <img :src="chat.member.image ?? 'https://i.pravatar.cc/151?img=12'" alt="Profile Image" class="w-14 h-14 rounded-full object-cover" />

                <!-- Chat Info -->
                <div class="flex-1">
                  <!-- Full Name and Last Message -->
                  <div class="flex justify-between items-start">
                    <!-- Full Name -->
                    <h4 class="font-semibold text-gray-800">{{ chat.member.full_name }}</h4>
                  </div>

                  <!-- Last Message and Date -->
                  <div class="flex justify-between mt-2">
                    <!-- Last Message -->
                    <p class="text-sm text-gray-600">{{ chat.last_message.message }}</p>

                    <!-- Last Message Time -->
                    <div class="text-xs text-gray-400">
                      {{ new Date(chat.last_message.created_date).toLocaleString() }}
                    </div>
                  </div>
                </div>

                <!-- Online Status (Top Right) -->
                <div v-if="chat.member.is_online" class="absolute top-2 right-4 flex items-center space-x-1">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span class="text-xs text-green-600">Online</span>
                </div>
                <div v-else class="absolute top-2 right-4 text-xs text-gray-500">Offline</div>

              </div>
            </div>
          </div>

        </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Modal from '../components/Modal.vue'
import WebSocketService from '../service/webSocketService'; // Your WebSocket service class
import ActionTypes from '../service/utils/actionType.utils'
const messages = ref<Array<{ sender: string; text: string, me?: boolean, created_date: Date }>>([]);
const message = ref<string>('');
const chatContainer = ref<HTMLElement | null>(null);
const wsService = ref<WebSocketService | null>();
const chatList = ref<any>([])

onMounted(() => {
  const user = JSON.parse(localStorage.getItem("user") as string);
  const users = JSON.parse(localStorage.getItem("users") as string);
  const token = user.token;
  const wsUrl = `ws://5.182.26.58:4321/ws/web?token=${token}`;
  wsService.value = new WebSocketService(wsUrl);
  wsService.value.connect();
  setTimeout(() => {
    if (wsService.value) {
      wsService.value.sendMessage({
        action: ActionTypes.GET_PRIVATE_CHAT_LIST,
      })
    }
  }, 500);

  //socket logic here
  if (wsService.value.socket) {
    wsService.value.socket.onmessage = (event: MessageEvent) => {
      const serverMessage = JSON.parse(event.data);
      switch (serverMessage.action) {
        case ActionTypes.GET_PRIVATE_CHAT_LIST:
          chatList.value = serverMessage.results as any;
          break;
        case ActionTypes.GET_PRIVATE_CHAT_MESSAGE:
          const results = serverMessage.results.reverse();
          for (const element of results) {
            const usr = users.find((val: any) => val.id == element.sender_id);
            if (element.sender_id == user.id) {
              messages.value.push({
                sender: usr.name,
                me: true,
                created_date: element.created_date,
                text: element.message
              })
            } else if (element.sender_id) {
              messages.value.push({
                sender: usr.name,
                created_date: element.created_date,
                text: element.message
              })
            }
          }
          scrollToBottom();
          break;
        case ActionTypes.SEND_MESSAGE_TO_CHAT:
          const data = serverMessage.data;
          messages.value.push({
            sender: data.sender_name,
            text: data.message,
            created_date: data.created_date,
            me: user.name == data.sender_name
          })
        default:
          break;
      }
    };
  }
  //socket logic here
});

const sendMessage = () => {
  if (message.value.trim() && wsService.value) {
    wsService.value.sendMessage({
      action: ActionTypes.SEND_MESSAGE_TO_CHAT,
      payload: {
        chat_room_id: selectedChat.value,
        message: message.value,
      }
    });
    message.value = ''
  }
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};
//show select chat
const showSelectChat = ref<boolean>(true);
const selectChat = (chatId: string) => {
  selectedChat.value = chatId;
  showSelectChat.value = false;
  if (wsService.value) {
    wsService.value.sendMessage({
    action: ActionTypes.GET_PRIVATE_CHAT_MESSAGE,
    query: {
      chat_room_id: chatId
    }
  })
  }
  
}
//show select chat
const selectedChat = ref('');
</script>

<style scoped>
</style>
