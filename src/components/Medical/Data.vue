<template>
  <div>
      <h4>Electronic medical records: {{ log }} and {{ isConnected }}</h4>
      <input type="number" placeholder="account number" v-model="id">
      <button @click="readData">Read</button>
      <br>
      <table>
        <thead>
          <tr>
            <th>records</th>
            <th>Role</th>
            <th>Identification</th>
            <th>Medicine</th>
            <th>DateTime</th>
          </tr>
          <tbody>
            <tr v-for="(item, index) in medication">
              <td>{{ index }}</td>
              <td>{{ item.dRole }}</td>
              <td>{{ item.dId }}</td>
              <td>{{ item.mId }}</td>
              <td> {{ item.when }} </td>
            </tr>
          </tbody>
        </thead>
      </table>
      <br>
      <div v-if="isNotPatient">
        <input type="text" placeholder="Medicine id" v-model="medId">
        <button @click="giveMedication">Give medication</button>
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
      accounts: null,
      log: null,
      medId: null,
      isConnected: 'nope',
      medication: null,
      VERIFICATION: false
    }
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = "its done";
    },

    disconnect() {
      this.isConnected = false;
    },

    stream(data) {
      console.log('here you go', data)
      this.isConnected = data.title
    }
  },
  methods: {
    readData() {
      this.$Hospital.read(this.account.address, this.accounts[this.id]).then(response => {
        console.log('Readicate', response)
        this.log = response.data
        this.medication = response
      })
    },
    giveMedication() {
      if(this.account.role === 'Doctor')
      {
        this.$Hospital.giveE(this.account.address, this.accounts[this.id], this.medId).then(response => {
          console.log('Medicate: ', response)
          this.log = response.data
          this.readData()
        })
      }
      if(this.account.role === 'Pharmacy'){
        this.$Hospital.giveR(this.account.address, this.accounts[this.id], this.medId).then(response => {
          console.log('Pharmicate: ', response)
          this.log = response.data
          this.readData()
        })
      }
      
    }
  },
  created() {
    this.accounts = this.$Hospital.accounts()
          this.account = this.$store.state.primaryAccount
  },
  computed: {
    isNotPatient() {
      if(this.account.role === 'Patient'){return false;  }
        else{ return true; }
    }
  }
}
</script>
