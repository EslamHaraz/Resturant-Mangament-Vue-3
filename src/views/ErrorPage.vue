<template>
  <div class="parent">
    <img src="../assets/imgs/PageNotFound.jpg"> 
    <button @click="goBack()" class="btn btn-warning button">Go Back</button>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
  export default {
    name: "ErrorPage",
    methods:{
      ...mapActions(["redirectTo"]),
      goBack(){
        this.redirectTo({val:"home"})
      }
    }
  };
</script>
<style scoped>
.parent {
    width: 600px;
    margin: 30px auto;
    text-align: center

}
.parent img {
  max-width: 100%;  
}
button {
  color: white;
  font-weight: 800
}
</style>