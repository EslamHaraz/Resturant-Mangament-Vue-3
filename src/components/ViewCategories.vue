<template>
  <div class="container">
    <NavBar />
    <router-link
      :to="{ name: 'AddNewCategory', params: { locationId: locationId } }"
    >
      <button
        type="button"
        style="margin-right: 20px"
        class="btn btn-primary float-start"
      >
        Add Category
      </button>
    </router-link>&nbsp;&nbsp;&nbsp;
    <router-link
      :to="{ name: 'DeletedAllCategories', params: { locationId: locationId } }"
    >
      <button
        type="button"
        style="margin-right: 20px"
        class="btn btn-danger float-start"
      >
        DeleteAll
      </button>
    </router-link>&nbsp;&nbsp;&nbsp;
    <router-link
      :to="{ name: 'menu', params: { locationId: locationId } }"
    >
      <button
        type="button"
        style="margin-right: 20px"
        class="btn btn-warning float-start"
      >
        Back
      </button>
    </router-link>&nbsp;&nbsp;&nbsp;
    <h1 style="text-align: center;">{{ResturantName}}</h1>
        <p style="text-align: center;color: #767676;">{{ResturantAdress}}</p>
        <p>List Of Categories is {{listOfCategories.length}}</p>
        <table style="text-align: center;" v-if="numOfCategories>0" class="table table-striped">
  <thead>
    <tr style="background-color: black; color: white;">
      <th scope="col">Name</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for ="(cat) in listOfCategories" :key="cat.id">
      <td style="font-weight:bold;">{{cat.name}}</td>

      <td>
        <router-link :to="{name:'UpdateCategory',params:{catId:cat.id ,locationId:cat.locationId}}">
            <button class="btn btn-info">Update</button>
        </router-link>&nbsp;&nbsp;&nbsp;
        <router-link :to="{name:'DeleteCategory',params:{catId:cat.id ,locationId:cat.locationId}}">
            <button class="btn btn-warning">Delete</button>
        </router-link>
      </td>
    </tr>
  </tbody>
</table>
<div v-if="numOfCategories<1" style="background-color: #ecdebf;padding: 15px;color: #7e5353;" class="box">
        <p style="margin: 0;">No Locations Added Yet</p>
      </div>
  </div>
</template>
<script>
  import NavBar from "@/components/NavBar";
  import { mapActions,mapMutations,mapState } from "vuex";
  import axios from "axios";
  export default {
    name: "ViewCategories",
    components: {
      NavBar,
    },
    data() {
      return {
        locationId: this.$route.params.locationId,
        userId :"",
        ResturantName:"",
        ResturantAdress:""
      };
    },
    computed:{
      ...mapState(["numOfCategories","listOfCategories"])
    },
    async  mounted() {
      let user = localStorage.getItem("user-detail");
      if (!user) {
        this.redirectTo({ val: "signUpView" });
      } else {
        this.userName = JSON.parse(user).Name;
        this.userId = JSON.parse(user).id;
        this.locationId = this.$route.params.locationId
       this.canUserAccessThisLocation({userIdIS:this.userId,locationIdIs:this.locationId,redirectToPage:"home"})
       this.getData()
       this.displayAllCategories({userIdIS:this.userId,locationId:this.locationId })
      }
    },
    methods :{
        ...mapActions(["redirectTo"]),
        ...mapMutations(["isLoggedInUser","displayAllCategories","canUserAccessThisLocation"]),
        async getData() {
            let result = await axios.get(`http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`)
            if(result.status == 200){
                this.ResturantName = result.data[0].Name
                this.ResturantAdress = result.data[0].Address
            }
        }
    }
  };
</script>
