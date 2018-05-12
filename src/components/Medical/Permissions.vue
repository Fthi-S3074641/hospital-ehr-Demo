<template>
  <div>
      <h4>Give or Revoke access rights: {{ log }}</h4>
      <table>
        <thead>
          <tr>
            <th>List</th>
            <th>Identification</th>
            <th v-if="isPatient">Revoke</th>
          </tr>
<tbody>
  <tr v-for="(address, index) in permissions" :key="index">
<td>{{ index }}</td>
<td>{{ address }}</td>
<td v-if="isPatient"><button @click="revokeAccess(index)">revoke</button></td>
  </tr>
</tbody>
        </thead>
      </table>
      <br>
      <div>
        <input type="number" placeholder="accent number" v-model="id">
        <button @click="grantAccess">Grant access</button>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      account: {
       address: null,
       role: null,
       balance: null 
      },
      log: null,
      accounts: null,
      permissions: null
    }
  },
  methods: {
    revokeAccess(index) {
      if(this.account.address !== this.permissions[index]){
          console.log(index, ' : ', this.permissions[index])
          this.$Hospital.revoke(this.account.address, this.accounts[index])
          .then((response => { 
          var addr =  this.permissions[index]
          this.log = response.tx
          this.permissions.splice(index,1)
          this.$Hospital.remove(this.account.address,addr)
          .then(resp => {
            this.log = 'Completly removed permission'
            console.log(resp)
          })
          }))
      }else{
        this.log('You cannot revoke yourself')
      }
    },
    grantAccess() {
      this.$Hospital.grant(this.account.address, this.accounts[this.id])
      .then(response => { 
        this.log = response.tx
        this.permissions.push(this.accounts[this.id])
      })
    },
    fetchPermissions(){
      this.$Hospital.permissions(this.account.address, this.account.role)
      .then(response => {
        console.log(response)
        this.permissions = response.data
      })
    }
  },
  created() {
          this.accounts = this.$Hospital.accounts()
      this.account = this.$store.state.primaryAccount
      this.fetchPermissions();
  },
  computed: {
    checkPriviledge(idx) {
      this.$Hospital.check(this.account.address, this.accounts[idx])
      .then(response => {
        return response
      })
    },
    isPatient(){
      if(this.account.role === 'Patient') {
        return true
      }else { return false }
    },
    theRole(idx) {
      this.$Hospital.role(this.permissions[idx])
      .then(resp => {
        return resp
      })
    }
  }
}
</script>
