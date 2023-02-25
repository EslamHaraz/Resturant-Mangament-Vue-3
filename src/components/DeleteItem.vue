<template>
    <div class="container">
      <NavBar />
      <router-link
      :to="{ name: 'menu', params: { locationId: locationId } }"
    >
      <button
        type="button"
        style="margin-right: 20px"
        class="btn btn-warning float-start"
      >
        Back To Menu
      </button>
    </router-link>&nbsp;&nbsp;&nbsp;
      <div class="clearfix"></div>
    <h1 style="text-align: center">{{ ResturantName }}</h1>
    <p style="text-align: center; color: #767676">{{ ResturantAdress }}</p>
    <div class="clearfix"></div>
      <form @click.prevent>
        <div class="row g-3 align-items-center">
          <div class="col-auto mx-auto d-block">
            <h1>Delete Item #{{ itemid }}</h1>
            <h4>Item Name {{ itemName }}</h4>
            <p class="text-danger">
              Are You sure you want to delete this item 
            </p>
          </div>
        </div>
        <div style="margin-top: 15px" class="row g-3 align-items-center">
          <div class="col-auto mx-auto d-block">
            <button @click="goBack()" class="btn btn-info">Go Back</button
            >&nbsp;&nbsp;&nbsp;
            <button @click="deleteItem()" class="btn btn-danger">
              Delete Now</button
            >&nbsp;&nbsp;&nbsp;
          </div>
        </div>
      </form>
      <div
        style="margin-top: 5px; font-weight: 600"
        class="row g-3 align-items-center"
      >
        <div
          class="col-auto d-block mx-auto alert alert-success"
          v-if="successMessage"
        >
          {{ successMessage }}
        </div>
      </div>
    </div>
  </template>
  <script>
    import { mapActions, mapMutations } from "vuex";
    import NavBar from "@/components/NavBar.vue";
    import axios from "axios";
    export default {
      name: "DeleteItem",
      data() {
        return {
          locationId: this.$route.params.locationId,
         itemid: this.$route.params.itemId,
          CategoryName: [],
          userId: "",
          locationData: [],
          successMessage: "",
          id: "",
          allItemsIdIs: [],
          ResturantName:"",
          ResturantAdress:"",
          itemName:"",
          listOfitems:[]

        };
      },
      async mounted() {
        let user = localStorage.getItem("user-detail");
        if (!user) {
          this.redirectTo({ val: "signUpView" });
        } else {
          this.userId = JSON.parse(user).id;
          this.currentUser();
          this.canUserAccessThisitem({
          userIdIS: this.userId,
          locationIdIs: this.locationId,
          itemIdIs: this.itemid,
          redirectToPage: "home",
        });

          this.getDataOfItem(this.userId,this.locationId,this.itemid)
        }

      },
      components: {
        NavBar,
      },
      methods: {
        ...mapActions(["redirectTo"]),
        ...mapMutations([
          "isLoggedInUser",
          "displayAllCategories",
          "canUserAccessThisLocation",
          "canUserAccessThisitem"
        ]),
        goBack() {
          this.$router.push({
            name: "ViewCategories",
            params: { locationId: this.locationId },
          });
        },
        async getDataOfItem(userId,locId,itemId){
    let result = await axios.get(`http://localhost:3000/items?userId=${userId}&locationId=${locId}&id=${itemId}`)
    if(result.status == 200){
        this.listOfitems = result.data
        console.log(this.listOfitems)
        if(this.listOfitems.length < 1){
          this.commit("redirectTo",payload.redirectToPage)
        }else {
               this.itemName = result.data[0].Name
        }
    }
  },
        async currentUser() {
          let result = await axios.get(
            `http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`
          );
          if (result.status == 200 && result.data.length > 0) {
            this.locationData = result.data;
            this.ResturantName = this.locationData[0].Name;
            this.ResturantAdress = this.locationData[0].Address;
            console.log(this.name);
            console.log(this.locationData);
          } else {
            this.redirectTo({ val: "home" });
          }
        },
        async deleteItem() {
          let result = await axios.delete(
            `http://localhost:3000/items/${this.itemid}`
          );
          if (result.status == 200 ) {
            this.successMessage = "Category Is Deleted";
            setTimeout(() => {
              this.redirectTo({ val: "home" });
            }, 2000);
            console.log("hello");
          } else {
            this.successMessage = "Error 404";
          }
        },
      },
    };
  </script>
  <style></style>
  <style>
    td {
      padding: 11px;
    }
  </style>
  