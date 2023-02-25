<template>
    <div class="container">
        <NavBar />
        <form class="container" style="text-align: center;">
        <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
      <h1>Update Your Resturant</h1>
        <input style="    width: 80%;margin: auto;"
          type="text "
          class="form-control"
          placeholder="Enter Your Resturant"
          v-model.trim="state.name"
        />
        <!-- <span class="error-feedback" v-if="v$.name.$error">{{
          v$.name.$errors[0].$message
        }}</span> -->
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          type="number"
          class="form-control"
          placeholder="Enter Your Phone"
          v-model.trim="state.phone"
        />
        <!-- <span class="error-feedback" v-if="v$.phone.$error">{{
          v$.phone.$errors[0].$message
        }}</span> -->
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          type="text"
          class="form-control"
          placeholder="Enter Your address"
          v-model.trim="state.address"
        />
        <!-- <span class="error-feedback" v-if="v$.address.$error">{{
          v$.address.$errors[0].$message
        }}</span> -->
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
    <button @click="Update()" type="button" style="margin-right: 20px;" class="btn btn-primary">Update Now</button>
    <button @click="this.redirectTo({val:'home'})" type="button" class="btn btn-danger">Back</button>
</form>
    </div>
</template>
<script>
import useVuelidate from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';
import {reactive , computed} from "vue"
import { mapActions } from 'vuex';
import axios from "axios"
  import NavBar from "@/components/NavBar";
export default {
    name:"UpdateLocation",
    components:{
        NavBar
    },
    data(){
      return {
        ErrorMessage:"",
        successMessage:"",
        userId:"",
        locationId:"",
        locationData:[]
      }
    },
    setup(){
        const state = reactive({
            name:"",
            phone:"",
            address:"",
   
        })
        const rules = computed(()=>{
            return {
                name :{required,minLength:minLength(10)},
                phone :{required},
                address :{required,minLength:minLength(10)}
            }
        })
       const v$ = useVuelidate(rules,state)
       return {
        state,v$
       }
    },
    mounted(){
        let user = localStorage.getItem("user-detail")
        if(!user) {
            this.redirectTo({val:"home"})
        }else {
            this.userId = JSON.parse(user).id
            this.locationId = this.$route.params.locationId;
            this.currentUser()
        }
    },
    methods:{
        ...mapActions(["redirectTo"]),
        async   currentUser(){
    let result = await axios.get(`http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`)
    if(result.status == 200 && result.data.length>0){
        this.locationData = result.data
        this.state.name = this.locationData[0].Name
        this.state.address = this.locationData[0].Address
        this.state.phone = this.locationData[0].Phone
        this.state.id=this.locationData[0].id
        console.log(this.name)
        console.log(this.locationData)
    }else {
        this.redirectTo({val:"home"})
    }
      },
        async   Update(){
            this.v$.$validate() // run validations
            if(!this.v$.$error){
                console.log("Validated")
                let result = await axios.put(`http://localhost:3000/locations/${this.locationId}`,{
                  Name : this.state.name,
                  Phone:this.state.phone,
                  Address: this.state.address,
                  userId:this.userId,
                })
                if(result.status == 200) {
                  this.successMessage ="Updated successfully"
                  this.ErrorMessage=""
                  setTimeout(()=>{
                    this.state.name=""
                    this.state.phone=""
                    this.state.address=""
                    this.successMessage =""
                    this.v$.$errors=[]
                    this.redirectTo({val:"home"})
                  },2000)
                }else {
                  this.ErrorMessage="Something went wrong ,Please Try Again ! "
                  this.successMessage =""
                }
            }else {
                console.log("Not validated")
                this.ErrorMessage="You Must Fill in all required fields !"
            this.v$.$errors[0].$message="The name must be 10 characters long"
            this.v$.$errors[1].$message="Please Enter A Valid Number"
            }
        }
    }
}
</script>