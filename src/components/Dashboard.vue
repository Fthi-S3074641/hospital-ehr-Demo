
<template>
  <div class="">
    <div class="header">
<h4>Role: {{ account.role }} Address: {{ account.address }} Balance: {{ account.balance }}</h4>
    </div>
<br>

<ul>
  <li><router-link class="link" to="/dashboard/permissions">Access control</router-link></li>
  <li><router-link class="link" to="/dashboard/data">Medical data </router-link></li>
  <li><router-link class="link" to="/dashboard/billing">Billing</router-link></li>
  <li><a href="#" v-if="isLoggedIn" @click="logout">Logout</a></li>
</ul>

<router-view></router-view>
<!-- <h4> {{ accounts }}</h4> -->
  </div>
</template>


<script>
export default {
  data() {
    return {
      account: {
        address: null,
        role: '',
        balance: ''
      },
      accounts: null
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logOut')
      .then(() => {
        this.$router.replace('/')
      })
    }
  },
  computed: {
    isLoggedIn() {
      console.log(this.$store.getters.isLoggedIn)
      return this.$store.getters.isLoggedIn
    }
  },
  created(){
      if(this.$Hospital.accounts() == null){
        this.$store.dispatch('logOut')
        .then(() => {
          this.$router.replace('/')
        })
      }
      this.accounts = this.$Hospital.accounts()
      this.account = this.$store.state.primaryAccount
  }
}
</script>