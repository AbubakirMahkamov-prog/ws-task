<template>
  <div class="flex flex-col justify-center h-screen items-center border p-6 bg-gray-50 rounded-lg shadow-md">
    <h1 class="text-xl font-semibold mb-4 text-gray-700">Foydalanuvchini tanlang!</h1>
    <div class="relative inline-block w-full max-w-xs mb-4">
      <!-- Dropdown button -->
      <button
        @click="toggleDropdown"
        class="w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-4 pr-10 py-3 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-base"
      >
        <span class="block truncate">{{ selectedOption ? selectedOption[labelField] : 'Tanlang' }}</span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </span>
      </button>

      <!-- Dropdown list -->
      <div
        v-if="isOpen"
        class="absolute mt-2 w-full bg-white rounded-lg shadow-lg z-10 ring-1 ring-black ring-opacity-5"
      >
        <ul
          class="max-h-60 overflow-auto rounded-lg py-1 text-base focus:outline-none sm:text-sm"
        >
          <li
            v-for="(option, index) in options"
            :key="option[valueField]"
            @click="selectOption(option)"
            :class="[
              'cursor-pointer select-none relative py-2 pl-4 pr-9',
              selectedOption === option ? 'bg-indigo-600 text-white' : 'text-gray-900',
              'hover:bg-indigo-100'
            ]"
          >
            <span :class="selectedOption === option ? 'font-semibold' : 'font-normal'" class="block truncate">
              {{ option[labelField] }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <button
      @click="clickEnter"
      class="w-full max-w-xs bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
    >
      Kirish
    </button>

    <!-- Alert Component -->
    <Alert :is-visible="showAlert" @close="showAlert = false" :message="alertMessage" />
  </div>
</template>

<script setup lang="ts">
import Alert from '../components/Alert.vue'; // Import your Alert component
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
// Define the types for the option object
interface IOption {
  name: string;
  id: string;
  token: string;
  [key: string]: string; // Allow string indexing
}

const showAlert = ref(false);
const alertMessage = ref('');
// Dropdown state
const isOpen = ref(false);

// Selected option can be null or of type IOption
const selectedOption = ref<IOption | null>(null);

// Fields for labeling and values
const labelField = ref('name'); // Define the label field key
const valueField = ref('id');   // Define the value field key

// Options array with type safety
const options = ref<IOption[]>([
  { name: 'Fozil', id: '34', token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNCwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzI3NDE4Nzc4LCJleHAiOjE3NTYyMTg3NzgsImp0aSI6Ijk5ZmU3MGM2YmVkYzRmNDdiY2RlYTBjZWJkOTM2ODFmIiwidG9rZW5fdHlwZSI6ImFjY2VzcyJ9.ty9aJY6K4xNm9uNTj7hhmGfvcP4nXJUyCjVx_7gPNqY` },
  { name: 'Mirmux', id: '33', token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozMywicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzI3NDE4ODA0LCJleHAiOjE3NTYyMTg4MDQsImp0aSI6IjhjMDg0YTE1N2M2YTRiZWRhZDM2Njk1ZjllNTU2ZWM4IiwidG9rZW5fdHlwZSI6ImFjY2VzcyJ9.iGGslcVbaOPPwsOyuzGNjig0gqwteM_2GtV5ofmoIj0` },
]);
onMounted(() => {
  localStorage.setItem('users', JSON.stringify(options.value));
})
// Toggle dropdown open/close
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
}

// Select option and close dropdown
const selectOption = (option: IOption) => {
  selectedOption.value = option;
  isOpen.value = false; // Close dropdown
}

// Handle the "Kirish" button click
const clickEnter = () => {
  if (selectedOption.value) {    
    localStorage.setItem('user', JSON.stringify(selectedOption.value))
    router.push({ name: 'chat' })
  } else {
    alertMessage.value = 'Foydalanuvchini tanlang!';
    showAlert.value = true; // Show the alert
  }
}
</script>

<style scoped>
/* Optional: Add styles to better control dropdown behavior */
</style>
