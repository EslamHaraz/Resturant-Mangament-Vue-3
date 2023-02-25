<template>
  <nav-bar></nav-bar>
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <h1 style="font-size: 26px">Update Your Profile</h1>
        <input
          type="text "
          class="form-control"
          disabled
          placeholder="Enter Your Name"
          v-model="name"
        />
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          type="email "
          class="form-control"
          disabled
          placeholder="Enter Your Email"
          v-model="email"
        />
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          :type="filedType"
          disabled
          class="form-control"
          placeholder="Enter Your Password"
          v-model="pass"
        />
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <button type="submit" @click="updateProfile()" class="btn btn-primary">
          Update Profile Now</button
        >&nbsp;&nbsp;&nbsp;
      </div>
    </div>
    <br />
  </form>
</template>

<script>
  import { mapActions } from "vuex";
  import NavBar from "@/components/NavBar";
  export default {
    components: { NavBar },
    name: "ProfileForm",
    data() {
      return {
        name: "",
        email: "",
        pass: "",
        filedType: "password",
        show: "show",
      };
    },
    methods: {
      ...mapActions(["redirectTo"]),
      showAndHide() {
        // This is Toggle
        this.filedType = this.filedType === "password" ? "text" : "password";
        this.show = this.show === "show" ? "hide" : "show";
      },
      updateProfile() {
        this.redirectTo({ val: "UpdateProfile" });
      },
    },
    mounted() {
      let user = localStorage.getItem("user-detail");
      if (user) {
        (this.name = JSON.parse(user).Name),
          (this.pass = JSON.parse(user).Password),
          (this.email = JSON.parse(user).Email);
      }else {
         this.redirectTo({val:"signUpView"})
      }
    },
  };
</script>

<style></style>
