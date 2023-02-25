<template>
  <div class="container">
    <NavBar></NavBar>
    <p style="text-transform: capitalize" class="text-end">
      Welcome {{ userName }} {{listOfLocations.length}}
      <RouterLink :to="{ name: 'Profile' }">
        <button class="btn btn-info" type="button">Profile</button>
      </RouterLink>
    </p>
    <AddNewLocation />
    <userLocations :allLocations = "listOfLocations"/>
  </div>
</template>

<script>
  import AddNewLocation from "@/components/AddNewLocation"
  import { mapActions } from "vuex";
  import NavBar from "@/components/NavBar";
  import axios from "axios"
  import userLocations from "@/components/userLocations" 

  export default {
    name: "HomeView",
    data() {
      return {
        userName: "",
        listOfLocations:[],
        userId:"",
      };
    },
    components: {
      NavBar,
      AddNewLocation,
      userLocations,
    },
  async  mounted() {
      let user = localStorage.getItem("user-detail");
      if (!user) {
        this.redirectTo({ val: "signUpView" });
      } else {
        this.userName = JSON.parse(user).Name;
        this.userId = JSON.parse(user).id;
      }
      let result = await axios.get(`http://localhost:3000/locations?userId=${this.userId}`)
      if(result.status == 200 && result.data.length >0) {
        console.log(result)
        this.listOfLocations = result.data
      }
    },
    methods: {
      ...mapActions(["redirectTo"]),
    },
  };
</script>
