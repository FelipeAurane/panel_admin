const app = Vue.createApp({
  data() {
    return {
      isModalOpen: false
    }
  },
  methods: {
    toggleModal() {
      this.isModalOpen = !this.isModalOpen
    },
    closeModal() {
      this.isModalOpen = false
    }
  }
})

window.addEventListener('DOMContentLoaded', () => {
  const modal = app.mount('#modal')
})
