<template>
  <div>
  <nav-bar></nav-bar>
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <h1 style="font-size: 26px">Update Your Profile</h1>
        <input
          type="text "
          class="form-control"
          placeholder="Enter Your Name"
          v-model="name"
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
          v-model="email"
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
          :type="filedType"
          class="form-control"
          placeholder="Enter Your Password"
          v-model="pass"
        />
        <span class="error-feedback" v-if="v$.pass.$error">{{
          v$.pass.$errors[0].$message
        }}</span>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <button
          type="submit"
          @click="updateProfileNow()"
          class="btn btn-primary"
        >
          Update Profile Now</button
        >&nbsp;&nbsp;&nbsp;
        <button class="btn btn-warning" id="but" @click="showAndHide">
          {{ show }}
        </button>
        &nbsp;&nbsp;&nbsp;
      </div>
    </div>
    <br />
     <div style="margin-top:5px;font-weight: 600;" class="row g-3 align-items-center">
              <div class="col-auto d-block mx-auto error-feedback">
        <img class="img" v-if="updateError" src="@/assets/imgs/warning-sign-svgrepo-com.svg">   {{updateError}}
              </div>
      </div>
  <br/>
  <button @click="prin">print</button>
  </form>
</div>
</template>

<script>
  import axios from "axios";
  import { mapActions } from "vuex";
  import useValidate from "@vuelidate/core";
  import { required, email, minLength } from "@vuelidate/validators";
  import NavBar from "@/components/NavBar";
  export default {
    components: { NavBar },
    name: "UpdateProfile",
    data() {
      return {
        v$: useValidate(),
        name: "",
        email: "",
        pass: "",
        userId: "",
        filedType: "password",
        show: "show",
        updateError:""
      };
    },
    validations() {
      return {
        name: { required, minLength: minLength(10) },
        email: { email, required },
        pass: { required, minLength: minLength(10) },
      };
    },
    methods: {
      ...mapActions(["redirectTo"]),
      showAndHide() {
        // This is Toggle
        this.filedType = this.filedType === "password" ? "text" : "password";
        this.show = this.show === "show" ? "hide" : "show";
      },
      async updateProfileNow() {
        this.v$.$validate();
        if (!this.v$.$error) {
          console.log("validated");
          // put used to make update
          let result = await axios.put(
            `http://localhost:3000/users/${this.userId}`,
            {
              Name: this.name,
              Email: this.email,
              Password: this.pass,
            }
          );
          if (result.status == 200) {
              localStorage.setItem("user-detail",JSON.stringify(result.data))
              this.redirectTo({val:"home"})

          } else {
             this.updateError="SomeThing went wrong , please try Again"
          }
        } else {
          console.log("Not Validated");
        this.updateError="Modification failed due to a data error"
        }
      },
    },
    mounted() {
      let user = localStorage.getItem("user-detail");
      if (user) {
        (this.name = JSON.parse(user).Name),
          (this.pass = JSON.parse(user).Password),
          (this.email = JSON.parse(user).Email);
        (this.userId = JSON.parse(user).id);
      }else {
        this.redirectTo({val:"signUpView"})
      }
    },
  };
</script>

<style></style>
