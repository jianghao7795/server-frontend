import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    counter: 0,
    list: [] as { a: number }[],
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async increment() {
      this.counter++;
      this.list.push({ a: 1 });
    },
  },
});
