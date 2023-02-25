<template>
    <Div style="text-align: center;" class="container">
        <Nav-Bar />
        <h1 class="text-danger">Delete All Locations</h1>
        <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <p>
            Are You sure you want to delete All Locations 
          </p>
            <div style="color: red;text-transform: capitalize;">
              <img class="img" src="@/assets/imgs/warning-sign-svgrepo-com.svg">
              if you do this you Can not make backup after Now 
              </div>

        </div>
      </div>
      <div style="margin-top: 15px;" class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button @click="redirectTo({ val: 'home' })" class="btn btn-info">
            Go Back</button
          >&nbsp;&nbsp;&nbsp;
          <button @click="deleteAllLocations()" class="btn btn-danger">
            Delete All</button
          >&nbsp;&nbsp;&nbsp;
        </div>
      </div>
    </form>
    <div style="margin-top:5px;font-weight: 600;" class="row g-3 align-items-center">
              <div class="col-auto d-block mx-auto alert alert-success" v-if="successMessage">
          {{successMessage}}
              </div>
    </Div>
    </Div>
</template>
<script>
import NavBar from "@/components/NavBar.vue"
import { mapActions } from "vuex";
import axios from "axios";
export default {
    name:"DeleteAllLocations",
    components:{
        NavBar
    },
    data(){
        return {
            successMessage:"",
            userId:"",
            allLocationsId:[],
            allItemsIdIs:[],
            allCatsIdIs:[],
        }
    },
  async  mounted() {
      let user = localStorage.getItem("user-detail");
      if (!user) {
        this.redirectTo({ val: "signUpView" });
      } else {
        this.userId = JSON.parse(user).id
        let result = await axios.get(`http://localhost:3000/locations?userId=${this.userId}`)
        if(result.status == 200){
            for(var i=0;i<result.data.length;i++){
               this.allLocationsId.push(result.data[i].id)
            }
        }
        let ResultCat = await axios.get(`http://localhost:3000/Categorires?userId=${this.userId}`)
        if(ResultCat.status == 200){
            for(var x=0;x<ResultCat.data.length;x++){
               this.allCatsIdIs.push(ResultCat.data[x].id)
            }
        }
        let ResultItems = await axios.get(`http://localhost:3000/items?userId=${this.userId}`)
        if(ResultItems.status == 200){
            for(var y=0;y<ResultItems.data.length;y++){
               this.allItemsIdIs.push(ResultItems.data[y].id)
            }
        }
      }
    },
    methods:{
        ...mapActions(['redirectTo']),
      async  deleteAllLocations() {
        let Resultsitem = []
        for(let z = 0 ;z<this.allItemsIdIs.length;z++){
            let result = await axios.delete(`http://localhost:3000/items/${this.allItemsIdIs[z]}`)
            if(result.status==200){
              Resultsitem.push(true)  
            }else { 
              return
            }
        }
        let ResultsCat = []
        for(let f = 0 ; f <this.allCatsIdIs.length;f++){
            let result = await axios.delete(`http://localhost:3000/Categorires/${this.allCatsIdIs[f]}`)
            if(result.status==200){
              ResultsCat.push(true)  
            }else { 
              return
            }
        }
        let allResults = []
        for(let h = 0 ;h<this.allLocationsId.length;h++){
            let result = await axios.delete(`http://localhost:3000/locations/${this.allLocationsId[h]}`)
            if(result.status==200){
              allResults.push(true)  
            }else { 
               return
            }
        }
        if(allResults.includes(true)&&Resultsitem.includes(true)&&ResultsCat.includes(true)){
          this.successMessage = "Deleted All is successfully"
          setInterval(()=>{
            this.redirectTo({val:"home"})
          },2000)
        }else {
          this.successMessage = "SomeThing Went Wrong , Please Try Again"
            setInterval(()=>{
               this.redirectTo({val:"home"})
              },2000)
           
        }
      }
    }
}
</script>