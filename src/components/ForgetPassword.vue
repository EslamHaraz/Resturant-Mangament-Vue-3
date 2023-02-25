<template>
    <div style="text-align: center;" class="container">
        <div style="margin-bottom: 20px;" class="row g-3 align-items-center">
            <h1 style="margin: 40px 0;">Reset Your Password</h1>
        <div class="col-auto d-block mx-auto">
         <input type="Email " class="form-control" placeholder="Write Your Email" v-model="email" />
         <span class="error-feedback" v-if="v$.email.$error">{{
          v$.email.$errors[0].$message
        }}</span>
          </div>
          </div>
        <div style="margin-bottom: 20px;" class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
         <input type="text " class="form-control" placeholder="Write Your Name" v-model="Name" />
         <span class="error-feedback" v-if="v$.Name.$error">{{
          v$.Name.$errors[0].$message
        }}</span>
          </div>
          </div>
          <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
         <input type="password" class="form-control" placeholder="Write A New Password" v-model="pass"/>
         <span class="error-feedback" v-if="v$.pass.$error">{{
          v$.pass.$errors[0].$message
        }}</span>
          </div>
          </div>
          <button style="margin-top: 25px;" type="submit" @click="resetPassword()" class="btn btn-primary">Forget Your Password</button> &nbsp;&nbsp;&nbsp;
          <button style="margin-top: 25px;" type="submit" @click="redirectTo({val:'Login'})" class="btn btn-warning">Back</button> &nbsp;&nbsp;&nbsp;
          <div style="margin-top:5px;font-weight: 600;" class="row g-3 align-items-center">
              <div class="col-auto d-block mx-auto error-feedback">
        <img class="img" v-if="errorMessage" src="@/assets/imgs/warning-sign-svgrepo-com.svg">   {{errorMessage}}
              </div>
      </div>
    </div>
</template>

<script>
import useValidate from '@vuelidate/core';
import { required, email, minLength } from "@vuelidate/validators";
import axios  from 'axios';
import { mapActions } from 'vuex';
export default {
    name:"ForgetPassword",
    data(){
        return {
            v$:useValidate(),
            pass:"",
            email:"",
            userid:"",
            Name:"",
            errorMessage:""
        }
    },
    validations(){
        return {
            pass:{required,minLength:minLength(10)},
            Name:{required,minLength: minLength(10) },
            email:{required,email}
        }
    },
    methods:{
        ...mapActions(["redirectTo"]),
       async resetPassword(){
        this.v$.$validate();
        if (!this.v$.$error) {
          console.log("from is valid");
          let result = await axios.get(`http://localhost:3000/users/?Email=${this.email}&Name=${this.Name}`)
          if(result.status==200) {
            console.log(result.data[0].id)
            let set = await axios.put(`http://localhost:3000/users/${result.data[0].id}`,{ Name:this.Name, Email:this.email,Password:this.pass})
            if(set.status==200) {
                localStorage.setItem("user-detail",JSON.stringify(set.data))
                this.redirectTo({val:"Login"})
                console.log(set)
            }else {
                this.errorMessage="Please check the data"
            }
          }

        }else {
            console.log("from is Not valid");
            this.errorMessage="Please write the required data"

        }
       }
    }
}
</script>