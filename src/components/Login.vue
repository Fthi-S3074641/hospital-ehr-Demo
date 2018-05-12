<template>
  <div class="">

  <input type="number" placeholder="your public Id" v-model="id">
  <button @click="login">Log in</button>
  <br>
  <label>Account address: {{ isAddress }}</label>
  <br>
  <p class="error" v-if="error.state">{{ error.message}}</p>
  <router-link to="/register" v-if="!isLoggedIn">if you are not registered?</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: {
        state: false,
        message: null
      },
      id: null,
      accounts: ''
    }
  },
  methods: {
    login() {
      if(this.id < 0 || this.id > 9){
        this.error.state = true
        this.error.message = this.id + ' is not a number between (0 & 9)'
      }else{
        let address = this.accounts[this.id]
        let role = null
      let balance = null
    this.$Hospital.signIn(address)
    .then(response => { 
      console.log('Registration response', response)
      if (response == '1'){
        this.$Hospital.role(address).then(response => { 
          role = response 
          this.$Hospital.balance(address).then(response => { 
            balance = response.c[0]
              this.$store.dispatch('logIn', [address, role, balance ])
              .then(() => {
                console.log(address , ' ', role, ' ', balance)
                // update your state for the account id, number and role
                  this.$router.push('/dashboard')
              })
            })
          })
        

      }else {
        this.error.state = true
        this.error.message = 'You are not registered: click below'
      }
      })
    .catch(err => { 
      this.error.state = true
      this.error.message = 'Ethereum is not working: check your oracle'
    })
    }

  }
},
beforeMount(){
    this.$Hospital.init().then(() => {
      this.accounts = this.$Hospital.accounts()
    })
},
created() {
  this.$store.dispatch('logOut')
},
computed: {
    isLoggedIn() {
      console.log(this.$store.getters.isLoggedIn)
      return this.$store.getters.isLoggedIn
    },
    isAddress() {
      console.log(this.id)
      var k = this.id
      return this.accounts[k]
    }
  }
}
</script>
