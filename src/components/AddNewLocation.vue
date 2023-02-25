<template>
    <div class="container">
        <!-- Button trigger modal -->
<button @click="redirect()" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Add New Resturant</button>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    name:"AddNewLocation",
    methods:{
        ...mapActions(["redirectTo"]),
        redirect(){
            this.redirectTo({val:"LocationView"})
        }
    },
}
</script>