<script setup lang="ts">

interface SolutionList {
  lineOne: string;
  lineTwo: string;
  lineThree: string;
  lineFour: string;
}

const solutionMap: Record<string, SolutionList> = {
  project:{
    lineOne: 'One1 advantuge',
    lineTwo: 'Two1 advantuge',
    lineThree: 'Three1 advantuge',
    lineFour: 'Four1 advantuge',
  },
  manager:{
    lineOne: 'One2 advantuge',
    lineTwo: 'Two2 advantuge',
    lineThree: 'Three2 advantuge',
    lineFour: 'Four2 advantuge',
  },
  worker:{
    lineOne: 'One3 advantuge',
    lineTwo: 'Two3 advantuge',
    lineThree: 'Three3 advantuge',
    lineFour: 'Four3 advantuge',
  },
  workPlace:{
    lineOne: 'One4 advantuge',
    lineTwo: 'Two4 advantuge',
    lineThree: 'Three4 advantuge',
    lineFour: 'Four4 advantuge',
  }
}

const activeTab = ref('project')

const currentContent = computed(() => solutionMap[activeTab.value])

</script>

<template>
  <div class="p-8 border border-2 border-[black]  bg-white flex-grow m-10">
    <div class="bannerText text-center border border-2 border-[black] w-[90%] p-10 m-auto">
      <img src="./banner.png" alt="">
      <h1 class="text-[90px] text-blue-600">Grid</h1>
      <p>Instrument for planning and assigning development tasks.</p>
    </div>
    <h2 class="text-center mt-5">There you can find many solutions for your IT project</h2>
    <div class="flex gap-3 p-2 justify-center">
      <button 
        v-for="(content, key) in solutionMap" 
        :key="key"
        @click="activeTab = key"
        :class="['px-4 py-2 rounded', activeTab === key ? 'bg-blue-600 text-white' : 'bg-white']"
        class="p-3 border border-[#262626] rounded-[5px]">
          {{ key }}
        </button>
    </div>
    <div class="w-[70%] m-auto">
      <Transition
        mode="out-in"
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-2 opacity-0"
      >
        <ul :key="currentContent?.lineOne" class="list-disc space-y-2">
          <li>{{ currentContent?.lineOne }}</li>
          <li>{{ currentContent?.lineTwo }}</li>
          <li>{{ currentContent?.lineThree }}</li>
          <li>{{ currentContent?.lineFour }}</li>
        </ul>
      </Transition>
    </div>
  </div>
</template>