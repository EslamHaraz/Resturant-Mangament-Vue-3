<template>
  <div class="container">
    <NavBar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete Category {{ name }}</h1>
          <p class="text-danger">
            Are You sure you want to delete this Category # {{ Categoryid }}
          </p>
        </div>
      </div>
      <div style="margin-top: 15px" class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button @click="goBack()" class="btn btn-info">Go Back</button
          >&nbsp;&nbsp;&nbsp;
          <button @click="deleteCategory()" class="btn btn-danger">
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
    name: "DeleteCategory",
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
        this.canUserAccessThisCategory({
          userIdIS: this.userId,
          locationIdIs: this.locationId,
          catIdIs: this.Categoryid,
          redirectToPage: "home",
        });
        this.getCategorName(this.userId, this.locationId, this.Categoryid);
        let result = await axios.get(
          `http://localhost:3000/items?catId=${this.Categoryid}`
        );
        let i;
        if (result.status == 200) {
          for (i = 0; i < result.data.length; i++) {
            this.allItemsIdIs.push(result.data[i].id);
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
      goBack() {
        this.$router.push({
          name: "ViewCategories",
          params: { locationId: this.locationId },
        });
      },
      async getCategorName(userId, locationId, Categoryid) {
        let result = await axios.get(
          `http://localhost:3000/Categorires?userId=${userId}&locationId=${locationId}&id=${Categoryid}`
        );
        if (result.status == 200) {
          this.categoryNames = result.data;
          if (this.categoryNames.length > 0) {
            console.log(this.categoryNames);
            this.name = this.categoryNames[0].name;
          }
        }
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
      async deleteCategory() {
        let result = await axios.delete(
          `http://localhost:3000/Categorires/${this.Categoryid}`
        );
        let allResult = []
        for(var i =0 ; i < this.allItemsIdIs.length;i++){
            let result = await axios.delete(
          `http://localhost:3000/items/${this.allItemsIdIs[i]}`
          );
          if(result.status == 200){
            allResult.push(true)
          }else {
            allResult.push(false)
          }
        }
        if (result.status == 200 && !allResult.includes(false)) {
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
