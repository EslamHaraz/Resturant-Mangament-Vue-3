import { createStore } from "vuex";
import router from "../router/index";
import axios from "axios";
const state = {
  isuserLoggedIn: "",
  loggedInUserId: "",
  numOfCategories: "",
  listOfCategories: [],
  listOfLocations: [],
  listOfitems: [],
};
const getters = {};
const mutations = {
  redirectTo(state, payload) {
    router.push({ name: payload });
  },
  isLoggedInUser(state) {
    let user = localStorage.getItem("user-detail")
    if(user){
      state.isuserLoggedIn = true
      state.loggedInUserId = JSON.parse(user).id
    }else {
      state.isuserLoggedIn = false
    }
  },
  async displayAllCategories(state,payload) {
    let result = await axios.get(`http://localhost:3000/Categorires?userId=${payload.userIdIS}&locationId=${payload.locationId}`)  
    if(result.status == 200){
      state.listOfCategories = result.data
      state.numOfCategories = state.listOfCategories.length
    } 
  },
  async canUserAccessThisLocation(state,payload){
    let result = await axios.get(`http://localhost:3000/locations?userId=${payload.userIdIS}&id=${payload.locationIdIs}`)
    if(result.status == 200){
        state.listOfLocations = result.data
        if(state.listOfLocations.length !==1){
          this.commit("redirectTo",payload.redirectToPage)
        }
    }
  },
  async canUserAccessThisCategory(state,payload){
    let result = await axios.get(`http://localhost:3000/Categorires?userId=${payload.userIdIS}&locationId=${payload.locationIdIs}&id=${payload.catIdIs}`)
    if(result.status == 200){
        state.listOfCategories = result.data
        if(state.listOfCategories.length !==1){
          this.commit("redirectTo",payload.redirectToPage)
        }
    }
  },
  async canUserAccessThisitem(state,payload){
    let result = await axios.get(`http://localhost:3000/items?userId=${payload.userIdIS}&locationId=${payload.locationIdIs}&id=${payload.itemIdIs }`)
    if(result.status == 200){
        state.listOfitems = result.data
        console.log(state.listOfitems)
        if(state.listOfitems.length < 1){
          this.commit("redirectTo",payload.redirectToPage)
        }
    }
  }
};
const actions = {
  redirectTo({ commit }, payload) {
    commit("redirectTo", payload.val);
  },
};
export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {},
});
