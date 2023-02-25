<template>
  <div style="text-align: center" class="container">
    <NavBar />
    <div class="clearfix"></div>
    <h1 style="text-align: center">{{ ResturantName }}</h1>
    <p style="text-align: center; color: #767676">{{ ResturantAdress }}</p>
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <hr />
          <h1>Add New Item</h1>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group--error': v$.itemName.$error }"
          >
            <input
              v-model="itemName"
              style="width: 250px"
              type="text"
              class="width form-control"
              id="floatItemName"
              placeholder="Enter Item Name"
            />
            <span class="error-feedback" v-if="v$.itemName.$error">{{
              v$.itemName.$errors[0].$message
            }}</span>
            <label for="floatItemName">Enter Item Name</label>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group--error': v$.price.$error }"
          >
            <input
              v-model="price"
              style="width: 250px"
              type="text"
              class="width form-control"
              id="floatprice"
              placeholder="Enter your price"
            />
            <span class="error-feedback" v-if="v$.price.$error">{{
              v$.price.$errors[0].$message
            }}</span>
            <label for="floatprice">Enter your price</label>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div
          class="col-auto d-block mx-auto"
        >
          <div class="form-floating mb-3"  :class="{ 'form-group--error': v$.quantitesNumber.$error }">
            <input
              v-model="quantitesNumber"
              style="width: 250px"
              type="number"
              class="width form-control"
              id="floatItemQty"
              placeholder="Enter Item Quantites"
            />
            <span class="error-feedback" v-if="v$.quantitesNumber.$error">{{
              v$.quantitesNumber.$errors[0].$message
            }}</span>
            <label for="floatItemQty">Enter Item Quantites</label>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div
          class="col-auto d-block mx-auto"
          
        >
          <div class="form-floating mb-3" :class="{ 'form-group--error': v$.Description.$error }">
            <textarea
              v-model="Description"
              style="min-height: 200px; max-height: 400px; width: 250px"
              class="width h200 form-control"
              placeholder="Leave a comment here"
              id="floatingTextarea"
            ></textarea>
            <span class="error-feedback" v-if="v$.Description.$error">{{
              v$.Description.$errors[0].$message
            }}</span>
            <label for="floatItemDescription">Enter Your Description</label>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group--error': v$.pickedCategory.$error }"
          >
            <select
              style="width: 250px"
              class="form-select"
              id="loatItemCategory"
              v-model="pickedCategory"
            >
              <option
                v-for="(cat, i) in listOfCategories"
                :key="i"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
            <label for="floatItemCategory">Select Category Name</label>
          </div>
          <span class="error-feedback" v-if="v$.pickedCategory.$error">{{
            v$.pickedCategory.$errors[0].$message
          }}</span>
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
      <div
        class="col-auto d-block mx-auto alert alert-danger"
        v-if="ErrorMessage"
      >
        {{ ErrorMessage }}
      </div>
    </div>
    <br />
    <br />
    <button
      @click="addNewItem()"
      type="button"
      style="margin-right: 20px"
      class="btn btn-primary"
    >
      Add Now
    </button>
  </div>
</template>
<script>
  import NavBar from "@/components/NavBar";
  import { mapActions, mapState, mapMutations } from "vuex";
  import useValidate from "@vuelidate/core";
  import {
    minLength,
    required,
    maxLength,
    between,
  } from "@vuelidate/validators";
  import axios from "axios";
  export default {
    name: "AddNewItem",
    components: {
      NavBar,
    },
    data() {
      return {
        successMessage: "",
        ErrorMessage: "",
        userId: "",
        userName: "",
        locationId: "",
        ResturantName: "",
        ResturantAdress: "",
        pickedCategory: "",
        itemName: "",
        quantitesNumber: "",
        Description: "",
        price:"",
        v$: useValidate(),
      };
    },
    validations() {
      return {
        itemName: { required, minLength: minLength(6) },
        quantitesNumber: { required, between: between(1, 1000) },
        price: { required, between: between(1, 250) },
        Description: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(120),
        },
        pickedCategory: { required },
      };
    },
    computed: {
      ...mapState([
        "isuserLoggedIn",
        "listOfCategories",
        "numOfCategories",
        "loggedInUserId",
      ]),
    },
    async mounted() {
      let user = localStorage.getItem("user-detail");
      if (!user) {
        this.redirectTo({ val: "signUpView" });
      } else {
        this.userName = JSON.parse(user).Name;
        this.userId = JSON.parse(user).id;
        this.isLoggedInUser();
        this.locationId = this.$route.params.locationId;
        this.displayAllCategories({
          userIdIS: this.userId,
          locationId: this.locationId,
        });
        this.getData();
        this.canUserAccessThisLocation({
          userIdIS: this.userId,
          locationIdIs: this.locationId,
          redirectToPage: "home",
        });
      }
    },
    methods: {
      ...mapActions(["redirectTo"]),
      ...mapMutations([
        "isLoggedInUser",
        "displayAllCategories",
        "canUserAccessThisLocation",
      ]),
      async getData() {
        let result = await axios.get(
          `http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`
        );
        if (result.status == 200) {
          this.ResturantName = result.data[0].Name;
          this.ResturantAdress = result.data[0].Address;
        }
      },
      async addNewItem() {
        this.v$.$validate();
        if (!this.v$.$error) {
          console.log("Validated");
          let result = await axios.post("http://localhost:3000/items",{
                  Name : this.itemName,
                 QtyNumber:this.quantitesNumber,
                  Description: this.Description,
                  userId:this.userId,
                  locId: parseInt(this.locationId),
                  catId:this.pickedCategory,
                  price :  parseInt(this.price),
                })
                if(result.status == 201) {
                  this.successMessage ="Added New Item successfully"
                  this.ErrorMessage=""
                  setTimeout(()=>{
                    this.redirectTo({val:"menu"})
                  },2000)
                }else {
                  this.ErrorMessage="Something went wrong ,Please Try Again ! "
                  this.successMessage =""
                }
            }else {
                console.log("Not validated")
            this.ErrorMessage="You Must Fill in all required fields !"
            this.v$.$errors[0].$message="The name must be 6 characters long"
            this.v$.$errors[1].$message="Please Enter A Valid Number"
            }
        // let result = await axios.post()
      },
    },
  };
</script>
<style>
  .width {
    width: 250px;
  }
  .form-group--error {
    color: red;
  }
  .form-floating.mb-3.form-group--error input,
  .form-floating.mb-3.form-group--error select,
  .form-floating.mb-3.form-group--error textarea {
    border: 2px solid red;
  }
</style>
