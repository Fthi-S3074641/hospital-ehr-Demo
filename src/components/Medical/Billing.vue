<template>
  <div>
      <h4>Make payments</h4>
      <br>
      <input type="number" placeholder="Enter amount" v-model="amount">
      <br>
      <input type="number" placeholder="Account number" v-model="id">
      <br>
      <button @click="sendPayment">Send payment</button>
  </div>
</template>

<script>
export default {
  data(){
    return {
      account: {
        address: null,
        role: null,
        balance: null
      },
      accounts: null,
      id: null,
      amount: null
    }
  },
  methods: {
    sendPayment() {
      this.$Hospital.pay(this.account.address, this.accounts[this.id], this.amount)
      .then(response => {
        this.$Hospital.balance(this.account.address).then(result => {
          this.account.balance = result.c[0]
        })
      })      
    }
  },
  created() {
    this.accounts = this.$Hospital.accounts()
    this.account = this.$store.state.primaryAccount
  }
}
</script>

