<template>
  <div class="">
<h4>Register here</h4>
<br>
<input type="number" placeholder="select public id" v-model="id">
<br>
<input type="text" placeholder="Role: doctor, patients, pharmacy, insurance" v-model="role">
<br>
<button @click="register" v-if="isPossible">Register</button>
<p class="error" v-if="error.state">{{ error.message }}</p>
<br>
<router-link class="link" to="/" v-if="!isLoggedIn">already registered: Log in</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      role: null,
      error: {
        state: false,
        message: ''
      },
      accounts: null
    }
  },
  methods: {
    register() {
      if(this.id < 0 || this.id > 9){
        this.error.state = true
        this.error.message = this.id + ' is not a number between (0 & 9)'
      }else{
        let address = this.accounts[this.id]
        this.$Hospital.register(address, this.role)
        .then(response => {
          console.log('Registration successful', response.tx)
          this.error.state = true
          this.error.message = 'Registration successful: '+ response.tx
            this.$Hospital.balance(address).then(response => { 
                let balance = response.c[0]
                    this.$Hospital.add(address, this.role).then(respond => {
                      this.error.message = 'Registered in Hyperledger'
                          this.$store.dispatch('logIn', [address, this.role, balance ])
                            .then(() => {
                                console.log(address , ' ', this.role, ' ', balance)
                                this.$router.push('/dashboard')
                            })
                    })
            })
        })
        .catch(err => { 
          this.error.state = true
          this.error.message = 'Registration not succesful, click below'
        })
    }
    }
  },
  computed: {
    isLoggedIn() {
      console.log(this.$store.getters.isLoggedIn)
      return this.$store.getters.isLoggedIn
    },
    isPossible() {
      if(this.role === 'Doctor' || this.role === 'Patient' || this.role === 'Pharmacy'){
        return true
      }
      else{
        return false
      }
    }
  },
  created(){
      if(this.$Hospital.accounts() == null){
        this.$router.replace('/')
      }
      else{
        this.accounts = this.$Hospital.accounts()
      }
  }
}
</script>

