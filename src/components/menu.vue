<template>
  <div class="container">
    <NavBar />
    <div>
      <router-link
        :to="{ name: 'ViewCategories', params: { locId: locationId } }"
      >
        <button
          type="button"
          style="margin-right: 20px"
          class="btn btn-primary float-start"
        >
          View/Add Categories
        </button>
      </router-link>
      <router-link :to="{ name: 'AddNewItem', params: { locId: locationId } }">
        <button
          type="button"
          style="margin-right: 20px"
          class="btn btn-warning float-end"
        >
          Add New Item
        </button>
      </router-link>
    </div>
    <div class="clearfix"></div>
    <h1 style="text-align: center">{{ ResturantName }}</h1>
    <router-link
      :to="{ name: 'deleteAllitems', params: { locId: locationId } }"
    >
      <button
        v-if="listofItems.length > 2"
        type="button"
        class="btn btn-danger float-end"
      >
        DeleteAll Items
      </button>
    </router-link>
    <p style="text-align: center; color: #767676">{{ ResturantAdress }}</p>
    <div class="clearfix"></div>
    <div class="clearfix"></div>
    <div class="eachCategory">
      <div class="" v-for="(cat, i) in listOfCategories" :key="i">
        <div class="">
          <div class="catName">
            <h3 class="text-center bg-light p-1">{{ cat.name }}</h3>
          </div>
        </div>
        <div v-for="(item, I) in listofItems" :key="I">
          <div class="Items" v-if="cat.id == item.catId">
            <div v-if="cat.id == item.catId">
              <h4 class="item-Name">{{ item.Name }}</h4>
              <p style="margin-top: 20px; color: #747474" class="item-Desc">
                Description : {{ item.Description }}
              </p>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  color: #747474;
                "
                class="info"
              >
                <p style="margin-bottom: 0" class="item-Desc">
                  Avaliable Qty : {{ numberWithCommas(item.QtyNumber) }}
                </p>
                <div class="item-price">
                  Price : ${{ numberWithCommas(item.price) }}
                </div>
              </div>
            </div>
            <br />
            <div class="clearfix"></div>
            <div
              style="
                margin-bottom: 10px;
                justify-content: space-between;
                display: flex;
              "
              class="buttons"
            >
              <router-link
                :to="{
                  name: 'DeleteItem',
                  params: { itemId: item.id, locationId: locationId },
                }"
              >
                <button type="button" class="btn btn-danger">Delete</button>
              </router-link>
              <router-link
                style="text-decoration: none"
                :to="{
                  name: 'UpdateItem',
                  params: { itemId: item.id, locationId: locationId },
                }"
              >
                <button type="button" class="btn btn-primary">Update</button
                >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </router-link>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
  </div>
</template>
<script>
  import NavBar from "@/components/NavBar";
  import { mapActions, mapState, mapMutations } from "vuex";
  import axios from "axios";
  export default {
    name: "menu",
    components: {
      NavBar,
    },
    data() {
      return {
        userId: "",
        userName: "",
        locationId: "",
        ResturantName: "",
        ResturantAdress: "",
        listofItems: [],
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
        this.getItems(this.userId, this.locationId);
      }
    },
    methods: {
      ...mapActions(["redirectTo"]),
      ...mapMutations([
        "isLoggedInUser",
        "displayAllCategories",
        "canUserAccessThisLocation",
      ]),
      numberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      async getItems(userId, locId) {
        let result = await axios.get(
          `http://localhost:3000/items?userId=${userId}&locationId=${locId}`
        );
        if (result.status == 200) {
          this.listofItems = result.data;
          console.table(this.listofItems);
        }
      },
      async getData() {
        let result = await axios.get(
          `http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`
        );
        if (result.status == 200) {
          this.ResturantName = result.data[0].Name;
          this.ResturantAdress = result.data[0].Address;
        }
      },
    },
  };
</script>
<style>
  .eachCategory {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
    gap: 20px;
    
    margin-top: 30px;

  }
  .Items {
    padding: 5px;
    background-color: #fdfdfd;
    border-top: 0.5px solid #e1e1e1;
  }
  a {
    text-decoration: none;
  }
</style>
