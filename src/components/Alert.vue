<template>
    <div v-if="props.isVisible" class="fixed top-0 m-4 bg-red-600 text-white p-4 rounded-lg shadow-lg transition-all duration-300">
      <span>{{ message }}</span>
      <button @click="close" class="ml-4 text-white font-bold">X</button>
    </div>
  </template>
  
  <script setup lang="ts">
  const emits = defineEmits(['close'])
  const props = defineProps({
    message: {
      type: String,
      required: true,
    },
    isVisible: {
        type: Boolean,
        required: true
    }
  });
    
  const close = () => {
    emits('close')
  };
  </script>
  
  <style scoped>
  /* Optional: Add any additional styles here */
  </style>
  