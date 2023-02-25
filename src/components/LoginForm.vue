<template>
<form @click.prevent>
  <div class="row g-3 align-items-center">
      <div  class="col-auto d-block mx-auto" >
         <h1>Login</h1>
     <input type="Email " class="form-control" placeholder="Enter Your Email" v-model="state.email"/>
            <span class="error-feedback" v-if="v$.email.$error">{{v$.email.$errors[0].$message}}</span>
      </div>
  </div>
  <br/>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        
        <input type="password" class="form-control" placeholder="Enter Your Password" v-model="state.pass" />
          <span class="error-feedback" v-if="v$.pass.$error">{{v$.pass.$errors[0].$message}}</span>
      </div>
  </div>
  <br/>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <button type="submit" @click="userLogin()" class="btn btn-primary">Login</button> &nbsp;&nbsp;&nbsp;
        <button type="submit" @click="redirectTo({val:'ForgetPassword'})" class="btn btn-danger">Forget Your Password</button> &nbsp;&nbsp;&nbsp;
        <button type="submit" @click="redirectTo({val:'signUpView'})" class="btn btn-link">SignUp</button> &nbsp;&nbsp;&nbsp;
      </div> 
  </div>

      <div style="margin-top:5px;font-weight: 600;" class="row g-3 align-items-center">
              <div class="col-auto d-block mx-auto error-feedback">
        <img class="img" v-if="userNotFoundError" src="@/assets/imgs/warning-sign-svgrepo-com.svg">   {{userNotFoundError}}
              </div>
      </div>
  <br/>
  </form>
</template>
<script>

import axios from "axios"
import {mapActions} from"vuex"
import useValidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import {reactive , computed} from "vue"
export default {
  name:"LoginForm",
  // Compisition Api
  setup(){
    // State Data
    const state = reactive({
        email:"",
        pass:"",
    })
    // Validations
    const rules = computed(()=>{
      // must return object
      return {
        email:{required,email},
        pass:{required},
      }
    })
    const v$ = useValidate(rules,state)
    return {
      state,v$
    }
  },
    data(){
      return {
        userNotFoundError:""
      }
    },
      mounted() {
      let user = localStorage.getItem("user-detail");
      if (user) {
        this.redirectTo({ val: "home" });
      }
    },
    methods :{
        ...mapActions(['redirectTo']),
      async  userLogin() {
          this.v$.$validate();
            if (!this.v$.$error) {
              console.log("from is valid");
          let result = await axios.get(`http://localhost:3000/users/?Email=${this.state.email}&Password=${this.state.pass}`)
          if(result.status == 200 && result.data.length > 0){
            console.log("logged in")
            localStorage.setItem("user-detail", JSON.stringify(result.data[0]))
            this.redirectTo({val:"home"})
          }else {
            this.userNotFoundError = "user Not Found"
          }
        } else {
          console.log("from is Not valid");
        }
        }
    }
}
</script>

<style>
.img {
width: 16px;
    margin-bottom: 3px;
    margin: 0 3px 1px 0;
    }
</style>