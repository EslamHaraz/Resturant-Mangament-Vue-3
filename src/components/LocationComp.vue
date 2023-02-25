<template>
    <form class="container" style="text-align: center;">
        <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
      <h1>Add Your Resturant</h1>
        <input style="    width: 80%;margin: auto;"
          type="text "
          class="form-control"
          placeholder="Enter Your Resturant"
          v-model.trim="state.name"
        />
        <span class="error-feedback" v-if="v$.name.$error">{{
          v$.name.$errors[0].$message
        }}</span>
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
        <span class="error-feedback" v-if="v$.phone.$error">{{
          v$.phone.$errors[0].$message
        }}</span>
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
        <span class="error-feedback" v-if="v$.address.$error">{{
          v$.address.$errors[0].$message
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
    <button @click="addLocation()" type="button" style="margin-right: 20px;" class="btn btn-primary">Add Now</button>
    <button @click="this.redirectTo({val:'home'})" type="button" class="btn btn-danger">Back</button>
</form>
</template>
<script>
import useVuelidate from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';
import {reactive , computed} from "vue"
import { mapActions } from 'vuex';
import axios from "axios"
export default {
    name:"LocationComp",
    data(){
      return {
        ErrorMessage:"",
        successMessage:"",
      }
    },
    setup(){
        const state = reactive({
            name:"",
            phone:"",
            address:"",
            userId:"",
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
    mounted() {
      let user = localStorage.getItem("user-detail");
      this.userId = JSON.parse(user).id
    },
    methods:{
      ...mapActions(["redirectTo"]),
     async   addLocation(){
            this.v$.$validate() // run validations
            if(!this.v$.$error){
                console.log("Validated")
                let result = await axios.post("http://localhost:3000/locations",{
                  Name : this.state.name,
                  Phone:this.state.phone,
                  Address: this.state.address,
                  userId:this.userId,
                })
                if(result.status == 201) {
                  this.successMessage ="Added successfully"
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
