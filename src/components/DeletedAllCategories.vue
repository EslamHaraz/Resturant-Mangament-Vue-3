<template>
    <div class="container">
        <NavBar />
        <form @click.prevent>
            <div class="row g-3 align-items-center">
                <div class="col-auto mx-auto d-block">
              <h1 style="text-align:center;">Delete All Categories</h1>
              <hr />
            <p class="text-danger">
              Are You sure you want to delete All Categories For This Location ?
            </p>
            <h1 style="text-align: center;">{{ResturantName}}</h1>
        <p style="text-align: center;color: #767676;">{{ResturantAdress}}</p>
            <p class="text-danger">
                When Deleting all Categories , thier related menu items  well be deleted
            </p>
          </div>
        </div>
        <div style="margin-top: 15px" class="row g-3 align-items-center">
          <div class="col-auto mx-auto d-block">
            <button @click="goBack()" class="btn btn-info">Go Back</button
            >&nbsp;&nbsp;&nbsp;
            <button @click="deleteAllCategory()" class="btn btn-danger">
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
      name: "DeletedAllCategories",
      data() {
        return {
          locationId: this.$route.params.locationId,
          Categoryid: this.$route.params.catId,
          CategoryName: "",
          userId: "",
          locationData: [],
          successMessage: "",
          id: "",
          name: "",
          allItemsIdIs: [],
          ResturantName:"",
        ResturantAdress:"",
        allCatIdIs:[]
        };
      },
      async mounted() {
        let user = localStorage.getItem("user-detail");
        if (!user) {
          this.redirectTo({ val: "signUpView" });
        } else {
          this.userId = JSON.parse(user).id;
          this.deleteLocation = this.$route.params.locationId;
          this.currentUser();
          this.getData()
          let result = await axios.get(
            `http://localhost:3000/items?locId=${this.locationId}`
          );
          let i;
          if (result.status == 200) {
            for (i = 0; i < result.data.length; i++) {
              this.allItemsIdIs.push(result.data[i].id);
            }
          }
          let resultForCategories = await axios.get(
            `http://localhost:3000/Categorires?locationId=${this.locationId}`
          );
          let x;
          if (resultForCategories.status == 200) {
            for (x = 0; x < resultForCategories.data.length; x++) {
              this.allCatIdIs.push(resultForCategories.data[x].id);
            }
          }
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
          "canUserAccessThisCategory",
        ]),
        async getData() {
            let result = await axios.get(`http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`)
            if(result.status == 200){
                this.ResturantName = result.data[0].Name
                this.ResturantAdress = result.data[0].Address
            }
        },
        goBack() {
          this.$router.push({
            name: "ViewCategories",
            params: { locationId: this.locationId },
          });
        },
        async currentUser() {
          let result = await axios.get(
            `http://localhost:3000/locations?id=${this.deleteLocation}&userId=${this.userId}`
          );
          if (result.status == 200 && result.data.length > 0) {
            this.locationData = result.data;
            this.name = this.locationData[0].Name;
            this.address = this.locationData[0].Address;
            this.phone = this.locationData[0].Phone;
            this.id = this.locationData[0].id;
            console.log(this.name);
            console.log(this.locationData);
          } else {
            this.redirectTo({ val: "home" });
          }
        },
        async deleteAllCategory() {
          let allCatsResults = []
          for(var i =0 ; i < this.allCatIdIs.length;i++){
              let result = await axios.delete(
            `http://localhost:3000/Categorires/${this.allCatIdIs[i]}`
            );
            if(result.status == 200){
                allCatsResults.push(true)
            }else {
                allCatsResults.push(false)
            }
          let allItemsResult = []
          for(var v = 0 ; v < this.allItemsIdIs.length;v++){
              let result = await axios.delete(
            `http://localhost:3000/items/${this.allItemsIdIs[v]}`
            );
            if(result.status == 200){
                allItemsResult.push(true)
            }else {
                allItemsResult.push(false)
            }
          }
          if (!allItemsResult.includes(false) && !allCatsResults.includes(false)) {
            this.successMessage = "Category And Related Items are  Deleted";
            setTimeout(() => {
              this.redirectTo({ val: "home" });
            }, 2000);
            console.log("hello");
          } else {
            this.successMessage = "Error 404";
          }
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
  