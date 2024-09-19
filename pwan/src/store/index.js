import { createStore } from 'vuex';

const store = createStore({
  state: {
    userEmail: ''
  },
  mutations: {
    setUserEmail(state, email) {
      state.userEmail = email;
    }
  }
});

export default store;