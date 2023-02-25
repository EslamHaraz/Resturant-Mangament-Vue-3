<template>
    <div class="container">
      <div style="display: flex; align-items: center; padding: 10px; justify-content: space-between;">
        <p style="margin-right: 10px; margin-bottom: 0;" v-if="allLocations.length>0">List Of Locations ({{allLocations.length}})</p>
        <router-link :to="{name:'DeleteAllLocations'}">
          <button v-if="allLocations.length>1" style="padding: 4px;" class="btn btn-danger" type="button">Delete All</button>
        </router-link>
      </div>
      <div v-if="allLocations.length<1" style="background-color: #ecdebf;padding: 15px;color: #7e5353;" class="box">
        <p style="margin: 0;">No Locations Added Yet</p>
      </div>
   <table style="text-align: center;" v-if="allLocations.length>0" class="table table-striped">
  <thead>
    <tr style="background-color: black; color: white;">
      <th scope="col">#</th>
      <th scope="col">Name</th>
      <th scope="col">Phone</th>
      <th scope="col">Address</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for ="(location,index) in allLocations" :key="location.id">
      <td>{{index+1}}</td>
      <td style="font-weight:bold;">{{location.Name}}</td>
      <td>{{location.Phone}}</td>
      <td>{{location.Address}}</td>
      <td>
        <router-link :to="{name:'DeleteLocation',params:{locationId:location.id}}">
            <button class="btn btn-danger">Delete</button>
        </router-link>
        <router-link style="margin-left: 10px;" :to="{name:'UpdateLocation',params:{locationId:location.id}}">
            <button class="btn btn-primary">Update</button>
        </router-link>
        <router-link style="margin-left: 10px;" :to="{name:'menu',params:{locationId:location.id}}">
            <button class="btn btn-success">Menu</button>
        </router-link>

      </td>
    </tr>
  </tbody>
</table>
</div>
</template>
<script>
export default {
    name:"userLocations",
    props:["allLocations"]
}
</script>