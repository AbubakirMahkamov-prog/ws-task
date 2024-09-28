<!-- Modal.vue -->
<template>
    <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
        <slot name="content"></slot>
        <div class="mt-4 flex justify-end" v-show="props.closeBtn">
          <button @click="close" class="bg-blue-500 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  
  // Define props
  const props = defineProps({
    title: {
      type: String,
      default: 'Modal window',
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    closeBtn: {
        type: Boolean,
        required: false,
        default: true
    }
  })
  
  // Define emits
  const emit = defineEmits(['update:isOpen'])
  
  // Method to close the modal
  const close = () => {
    emit('update:isOpen', false)
  }
  </script>

  