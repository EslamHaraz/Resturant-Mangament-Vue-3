<template>
  <div class="container">
    <NavBar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete Resturant #</h1>
          <p class="text-danger">
            Are You sure you want to delete this Locations {{id}}
          </p>
          
        </div>
        <table style="text-align: center;" clss='table table-striped'>
          <thead style="background-color: black ;color: white;">
              <tr>
                  <th> ID </th>
                  <th> Name </th>
                  <th> Address </th>
                  <th> Phone </th>
              </tr>
          </thead>
          <tbody style="background-color: whitesmoke">
              <td>{{id}}</td>
              <td>{{name}}</td>
              <td>{{address}}</td>
            <td>{{phone}}</td>
          </tbody>
        </table>
      </div>
      <div style="margin-top: 15px;" class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button @click="redirectTo({ val: 'home' })" class="btn btn-info">
            Go Back</button
          >&nbsp;&nbsp;&nbsp;
          <button @click="deleteData()" class="btn btn-danger">
            Delete Now</button
          >&nbsp;&nbsp;&nbsp;
        </div>
      </div>
    </form>
    <div style="margin-top:5px;font-weight: 600;" class="row g-3 align-items-center">
              <div class="col-auto d-block mx-auto alert alert-success" v-if="successMessage">
          {{successMessage}}
              </div>
            </div>
  </div>
</template>
<script>
  import { mapActions } from "vuex";
  import NavBar from "@/components/NavBar.vue";
  import axios from "axios"
  export default {
    name: "DeleteLocation",
    data() {
      return {
        name: "",
        address: "",
        phone: "",
        userId:"",
        deleteLocation:"",
        locationData:[],
        successMessage:"",
        allItemsIdIs: [],
      allCatIdIs:[],
        id:""
      };
    },
   async mounted() {
      let user = localStorage.getItem("user-detail");
      if (!user) {
        this.redirectTo({ val: "signUpView" });
      } else {
        this.userId = JSON.parse(user).id;
        this.deleteLocation = this.$route.params.locationId;
        this.currentUser()
        let result = await axios.get(
            `http://localhost:3000/items?locId=${this.deleteLocation}`
          );
          let i;
          if (result.status == 200) {
            for (i = 0; i < result.data.length; i++) {
              this.allItemsIdIs.push(result.data[i].id);
            }
          }else {
            console.log(this.allItemsIdIs)

          }
          let resultForCategories = await axios.get(
            `http://localhost:3000/Categorires?locationId=${this.locationId}`
          );
          let x;
          if (resultForCategories.status == 200) {
            for (x = 0; x < resultForCategories.data.length; x++) {
              this.allCatIdIs.push(resultForCategories.data[x].id);
              console.log(this.allCatIdIs)
            }
      }
    }}
    ,
    components: {
      NavBar,
    },
    methods: {
      ...mapActions(["redirectTo"]),
   async   currentUser(){
    let result = await axios.get(`http://localhost:3000/locations?id=${this.deleteLocation}&userId=${this.userId}`)
    if(result.status == 200 && result.data.length>0){
        this.locationData = result.data
        this.name = this.locationData[0].Name
        this.address = this.locationData[0].Address
        this.phone = this.locationData[0].Phone
        this.id=this.locationData[0].id
        console.log(this.name)
        console.log(this.locationData)
    }else {
        this.redirectTo({val:"home"})

    }
      },
     async deleteData(){
        let result = await axios.delete(`http://localhost:3000/locations/${this.deleteLocation}`)
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
          }
          var allItemsResult = []
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
        if(result.status == 404 && allItemsResult.includes(false) && allCatsResults.includes(false)){
          this.successMessage="Error 404"
        }else {
          this.successMessage="Deleted successfully"
          setTimeout(() => {
              this.redirectTo({val:"home"})
          }, 2000);
         console.log("hello")
        }
     }
    },
  };
</script>
<style></style>
<style>
td{
    padding: 11px;
}
</style>
