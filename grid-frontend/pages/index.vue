<script setup lang="ts">


</script>

<template>
  <div class="p-8 w-[80%] mt-10 mb-10 m-auto flex-grow shadow-regular bg-[#FFF8F8] border-2 border-[black]">
    <div class="banner text-center border-b-2 border-[black] h-max w-[90%] p-40 m-auto">

      <div class="p-2 m-auto">
        <h1 class="font-boldonse text-[90px] text-[#1B56FD]">Grid</h1>
        <p class="font-saira">Set and assign your tasks using a grid</p>
      </div>

    </div>
    <h2 class="font-boldonse text-center text-[50px] mt-20 underline">Why we are better?</h2>
    <div class="flex flex-col w-[70%] m-auto">
        <h3 class="font-boldonse text-[50px] text-[#1B56FD] mt-[100px]">Our badass things:</h3>
        <div class="flex flex-col font-saira mt-2 text-[50px]">
          <button class="p-2 m-2 text-left">Kanban-dashboard</button>
          <button class="p-2 m-2 text-right">Deadline</button>
          <button class="p-2 m-2 text-left">Design</button>
          <button class="p-2 m-2 text-right">Comments</button>
          <button class="p-2 m-2 text-left">Drag & drop</button>
          <button class="p-2 m-2 text-right">Priorities</button>
        </div>
    </div>
  </div>
</template>

<style>
.banner{
  background-image: url('../public/banner.png');
  background-size: contain;
  background-repeat: no-repeat;
}
</style>