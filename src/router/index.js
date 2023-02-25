import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import signUpView from '@/views/signUpView'
import Login from '@/views/Login'
import Profile from '@/views/Profile'
import ErrorPage from '@/views/ErrorPage'
import UpdateProfile from '@/components/UpdateProfile'
import LocationView from "@/views/LocationView"
import ForgetPassword from "../components/ForgetPassword"
import DeleteLocation from "../components/DeleteLocation"
import DeleteAllLocations from "@/components/DeleteAllLocations"
import UpdateLocation from "@/components/UpdateLocation"
import AddNewCategory from "@/components/AddNewCategory"
import ViewCategories from "@/components/ViewCategories"
import UpdateCategory from "@/components/UpdateCategory"
import DeleteCategory from "@/components/DeleteCategory"
import DeletedAllCategories from "@/components/DeletedAllCategories"
import AddNewItem from "@/components/AddNewItem"
import UpdateItem from "@/components/UpdateItem"
import DeleteItem from "@/components/DeleteItem"
import deleteAllitems from "@/components/deleteAllitems"
import menu from "@/components/menu"
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/signUpView",
    name: "signUpView",
    component: signUpView,
  },
  {
    path: "/Login",
    name: "Login",
    component: Login,
  },
  {
    path: "/Profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/UpdateProfile",
    name: "UpdateProfile",
    component: UpdateProfile,
  },
  {
    path: "/LocationView",
    name: "LocationView",
    component: LocationView,
  },
  {
    path: "/ForgetPassword",
    name: "ForgetPassword",
    component: ForgetPassword,
  },
  {
    path: "/DeleteLocation/:locationId",
    name: "DeleteLocation",
    component: DeleteLocation,
  },
  {
    path: "/DeleteAllLocations",
    name: "DeleteAllLocations",
    component: DeleteAllLocations,
  },
  {
    path: "/UpdateLocation/:locationId",
    name: "UpdateLocation",
    component: UpdateLocation,
  },
  {
    path: "/menu/location/:locationId",
    name: "menu",
    component: menu,
  },
  {
    path: "/menu/Categories/add/:locationId",
    name: "AddNewCategory",
    component: AddNewCategory,
  },
  {
    path: "/menu/Categories/Update/:locationId/:catId",
    name: "UpdateCategory",
    component: UpdateCategory,
  },
  {
    path: "/menu/Categories/Delete/loc/:locationId/item/:catId",
    name: "DeleteCategory",
    component: DeleteCategory,
  },
  {
    path: "/menu/Categories/DeleteAll/:locationId",
    name: "DeletedAllCategories",
    component: DeletedAllCategories,
  },
  {
    path: "/menu/ViewCategories/view/:locationId",
    name: "ViewCategories",
    component: ViewCategories,
  },
  {
    path: "/menu/ViewCategories/AddItem/:locationId",
    name: "AddNewItem",
    component: AddNewItem,
  },
  {
    path: "/menu/Update/item/:itemId/loc/:locationId",
    name: "UpdateItem",
    component: UpdateItem,
  },
  {
    path: "/menu/Delete/item/:itemId/loc/:locationId",
    name: "DeleteItem",
    component: DeleteItem,
  },
  {
    path: "/menu/DeleteAllitems/:locationId",
    name: "deleteAllitems",
    component: deleteAllitems,
  },
  // Stays Last
  {
    path: "/:catchAll(.*)",
    name: "ErrorPage",
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to,from,next)=>{
  document.title =to.name
  next()
})
export default router;
