<template>
  <ul id="nav">
    <router-link
      tag="li"
      :to="{ name: 'home',  }"
      exact
    >
    <!-- params: { pageTitle: 'Home Page' } -->
      <a>Home</a>
    </router-link>
    <a href="#" @click="logMeOut()">Log Out</a>
  </ul>
</template>

<script>
import {mapActions} from "vuex"

  export default {
    name: "NavBar",
  methods: {
      ...mapActions(['redirectTo']),
    logMeOut(){
        localStorage.clear()
        this.redirectTo({val:"Login"})
    }   
  }
  };
</script>

<style scoped lang="scss">
    $fontColor:darkcyan;
    $navColor:#525a5a;
    ul {
        display: flex;
        justify-content: center;
        list-style: none;
        margin-bottom: 50px;
        a {
            text-decoration: none;
            font-weight: bold;
            color:$fontColor;
            padding: 10px;

        }
    }
    a.router-link-exact-active a , ul a  a:hover {
        color: $navColor;
        box-shadow: 2px 2px 4px 0px $navColor;
    }
</style>
