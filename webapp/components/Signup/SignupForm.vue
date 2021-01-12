<template>
  <form class="signup-form" @submit.prevent="signup">
    <input
      ref="name"
      v-model.trim="name"
      name="name"
      type="text"
      placeholder="Name"
      @focus="focusInput"
    />
    <small class="error-text">{{ this.nameError }}</small>
    <input
      ref="email"
      v-model.trim="email"
      name="email"
      type="email"
      placeholder="Email"
      @focus="focusInput"
    />
    <small class="error-text">{{ this.emailError }}</small>
    <input
      ref="password"
      v-model.trim="password"
      name="password"
      type="password"
      placeholder="Password"
      @focus="focusInput"
    />
    <small class="error-text">{{ this.passwordError }}</small>
    <button class="signup-btn" type="submit">Signup</button>
    <div>
      <small>Already have an account?</small>
      <NuxtLink class="login-btn" to="/login"> Login here </NuxtLink>
    </div>
  </form>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'SignupForm',
  data() {
    return {
      name: '',
      nameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
    }
  },
  methods: {
    focusInput(e) {
      e.target.className = ''
      if (e.target.name === 'name') {
        this.nameError = ''
      }
      if (e.target.name === 'email') {
        this.emailError = ''
      }
      if (e.target.name === 'password') {
        this.passwordError = ''
      }
    },
    async signup() {
      if (this.name === '') {
        this.nameError = 'Email required'
        this.$refs.name.className = 'error'
      }

      if (this.email === '') {
        this.emailError = 'Email required'
        this.$refs.email.className = 'error'
      }

      if (this.password === '') {
        this.passwordError = 'Password required'
        this.$refs.password.className = 'error'
      }

      if (
        this.nameError !== '' &&
        this.emailError !== '' &&
        this.passwordError !== ''
      ) {
        return
      }

      const signup = gql`
        mutation signup($name: String!, $email: String!, $password: String!) {
          signup(name: $name, email: $email, password: $password)
        }
      `
      try {
        const res = await this.$apollo.mutate({
          mutation: signup,
          variables: {
            name: this.name,
            email: this.email,
            password: this.password,
          },
        })
        this.$store.commit('auth/setToken', res.data.signup)
        await this.$apolloHelpers.onLogin(res.data.signup)
        this.$router.push({ path: '/' })
      } catch (ex) {
        alert(ex)
      }
    },
  },
}
</script>
<style scoped>
.signup-form {
  display: grid;
  width: 100%;
}

.signup-form input {
  height: 35px;
  border-radius: 5px;
  border: 1px solid;
  background: aliceblue;
  padding: 0 10px;
  outline: none;
}

.signup-form input.error {
  border: 2px solid #ff0086;
}

.error-text {
  text-align: left;
  padding: 5px 0px 10px;
  color: #f913d2;
}

.signup-btn {
  height: 35px;
  margin-bottom: 10px;
  background: #beb4fb;
  color: black;
  border: none;
  border-radius: 5px;
}

.login-btn {
  text-decoration: none;
  color: #ff00c8;
}
</style>
