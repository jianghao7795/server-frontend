<template>
  <div class="view-content">
    <div v-if="userStore.currentUser.user.ID !== 0">
      <h4>介绍: {{ userStore.currentUser.user.nickName }}</h4>
      <div class="about-content">
        <Content :imgUrl="userStore.currentUser.user.introduction" />
      </div>
    </div>
    <div v-else>请登录！</div>
  </div>
</template>

<script lang="ts" name="About" setup>
import Content from "./content.vue";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
</script>
