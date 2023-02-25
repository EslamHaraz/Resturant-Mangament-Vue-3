<template>
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
      <h1>Sign Up</h1>
        <input
          type="text "
          class="form-control"
          placeholder="Enter Your Name"
          v-model.trim="name"
        />
        <span class="error-feedback" v-if="v$.name.$error">{{
          v$.name.$errors[0].$message
        }}</span>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          type="email "
          class="form-control"
          placeholder="Enter Your Email"
          v-model.trim="email"
        />
        <span class="error-feedback" v-if="v$.email.$error">{{
          v$.email.$errors[0].$message
        }}</span>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          type="password"
          class="form-control"
          placeholder="Enter Your Password"
          v-model.trim="pass"
        />
        <span class="error-feedback" v-if="v$.pass.$error">{{
          v$.pass.$errors[0].$message
        }}</span>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <button type="submit" @click="signUpNow()" class="btn btn-primary">
          SignUp Now</button
        >&nbsp;&nbsp;&nbsp;
        <button
          type="submit"
          @click="redirectTo({ val: 'Login' })"
          class="btn btn-link"
        >
          Login
        </button>
        &nbsp;&nbsp;&nbsp;
      </div>
    </div>
    <br />
  </form>
</template>
<script>
  import axios from "axios";
  import { mapActions } from "vuex";
  import useValidate from "@vuelidate/core";
  import { required, email, minLength } from "@vuelidate/validators";
  export default {
    name: "sign-up",
    data() {
      return {
        v$: useValidate(),
        name: "",
        pass: "",
        email: "",
      };
    },
    validations() {
      return {
        name: { required, minLength: minLength(10) },
        pass: { required, minLength: minLength(10) },
        email: { required, email },
      };
    },
      mounted() {
      let user = localStorage.getItem("user-detail");
      if (user) {
        this.redirectTo({ val: "home" });
      }
    },
    methods: {
      ...mapActions(["redirectTo"]),
      async signUpNow() {
        this.v$.$validate();
        if (!this.v$.$error) {
          console.log("from is valid");
          console.log(this.v$.$errors[0]);
          console.log(this.v$);
          // axios post used to  add data tp json Server 
          let result = await axios.post("http://localhost:3000/users", {
            Name: this.name,
            Password: this.pass,
            Email: this.email,
          });
          if (result.status == 201) {
            console.log("Add new user succses");
            //  Save data in local storage
            localStorage.setItem("user-detail", JSON.stringify(result.data));
            // redirect Home Page
            this.redirectTo({ val: "home" });
          } else {
            console.log("Erro on Add new user succses");
          }
        } else {
          console.log("from is Not valid");
          // For edit in message error in useValidate object
          // console.log(this.v$.$errors[0].$message="Please Enter A Valid Value || Value is Required");
          // console.log(this.v$);
        }
      },
    },
  };
</script>

<style>
  .error-feedback {
    color: red;
    font-size: 0.85em;
    text-transform: capitalize;
  }
</style>
