import { createStore } from 'vuex';

export default createStore({
  state: {
    user:{
      id:'',
      name:'',
    },
  },
  getters: {
  },
  mutations: {
    connect(state,data){
      //make api call to authenticate user
      state.user.id = data.id,
      state.user.name = data.name;
    },
    disconnect(state){
      state.user.id ='';
      state.user.name='';
    }

  },
  actions: {
  },
  modules: {
  },
});
