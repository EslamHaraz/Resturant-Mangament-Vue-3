<template>
  <div class="container">
    <NavBar />
    
    <router-link
  :to="{name:'ViewCategories',params:{locId:locationId}}"
>
  <button
    type="button"
    style="margin-right: 20px"
    class="btn btn-warning float-start"
  >
    Back To Category
  </button>
</router-link>&nbsp;&nbsp;&nbsp;
    <router-link
  :to="{ name: 'menu', params: { locad: locationId } }"
>
  <button
    type="button"
    style="margin-right: 20px"
    class="btn btn-info float-start"
  >
    Back To Menu
  </button>
</router-link>&nbsp;&nbsp;&nbsp;
    <h1 style="text-align: center;">{{ResturantName}}</h1>
    <p style="text-align: center;color: #767676;">{{ResturantAdress}}</p>
    <form class="container" style="text-align: center;">
        <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
      <h1>Add Your Category</h1>
        <input style="    width: 80%;margin: auto;"
          type="text "
          class="form-control"
          placeholder="Add Category Name "
          v-model.trim="name"
        />
        <span class="error-feedback" v-if="v$.name.$error">{{
          v$.name.$errors[0].$message
        }}</span>
      </div>
      </div>
    <div style="margin-top:5px;font-weight: 600;" class="row g-3 align-items-center">
              <div class="col-auto d-block mx-auto alert alert-success" v-if="successMessage">
          {{successMessage}}
              </div>
              <div class="col-auto d-block mx-auto alert alert-danger" v-if="ErrorMessage">
          {{ErrorMessage}}
              </div>
      </div>
  <br/>
    <br />
    <button @click="addCategory()" type="button" style="margin-right: 20px;" class="btn btn-success">Add Now</button>
</form>
  </div>
</template>
<script>
  import NavBar from "@/components/NavBar";
  import { mapActions,mapMutations } from "vuex";
  import useValidate from "@vuelidate/core";
  import { required,minLength,maxLength } from "@vuelidate/validators";
  import axios from "axios";
  export default {
    name: "AddNewCategory",
    components: {
      NavBar,
    },
    data(){
        return {
            locationId:this.$route.params.locationId,
            successMessage:"",
            ErrorMessage:"",
            ResturantAdress:"",
            ResturantName:"",
            name:"",
            userId:"",
            locationId:"",
            listOfUser:[],
            v$:useValidate()
        }
    },
    validations(){
        return {
            name:{required,minLength:minLength(5),maxLength:maxLength(12)}
        }
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
       this.listOfUserCategories(this.userId,this.locationId)
       this.getData()
      }
    },
    methods :{
        ...mapActions(["redirectTo"]),
        ...mapMutations(["isLoggedInUser","displayAllCategories","canUserAccessThisLocation"]),
        async listOfUserCategories(userId,locationId){
            let result = await axios.get(`http://localhost:3000/Categorires?userId=${userId}&locationId=${locationId}`)
            if(result.status == 200){
                this.listOfUser = result.data
                console.log(this.listOfUser)
            }
        },
        async getData() {
            let result = await axios.get(`http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`)
            if(result.status == 200){
                this.ResturantName = result.data[0].Name
                this.ResturantAdress = result.data[0].Address
            }
        },
      async  addCategory() {
        this.v$.$validate()
        let filterCategoryName = this.listOfUser.filter((e)=> e.name.toLocaleLowerCase() == this.name.toLocaleLowerCase())
        if(!this.v$.$error){
            if(filterCategoryName.length > 0){
            this.successMessage = "",
           this.ErrorMessage="You Can Not Add Two Category With Same Name"
            }else {
                let result = await axios.post(`http://localhost:3000/Categorires`,{
                    name:this.name,
                    userId:this.userId,
                    locationId:parseInt(this.locationId)
                })
   
                if(result.status ==201){
                this.successMessage = "Added New Category successfully "
                this.ErrorMessage=""
                setTimeout(()=>{

                    this.$router.push({name:'ViewCategories',params:{locId:this.locationId}})
                },2000)
            }else {
                this.successMessage = "",
            this.ErrorMessage="SomeThing Went Wrong,Please Try Again"
            }
        }
        }else {
            this.successMessage = "",
           this.ErrorMessage="You Must Fill in Category Name "
        }
      }
    }
  };
</script>
