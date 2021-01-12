<template>
  <form class="login-form" @submit.prevent="login">
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
    <button class="login-btn" type="submit">Login</button>
    <div>
      <small>Not a member?</small>
      <NuxtLink class="register-btn" to="signup"> Sign up now </NuxtLink>
    </div>
  </form>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
    }
  },
  methods: {
    focusInput(e) {
      e.target.className = ''
      if (e.target.name === 'email') {
        this.emailError = ''
      }
      if (e.target.name === 'password') {
        this.passwordError = ''
      }
    },
    async login() {
      if (this.email === '') {
        this.emailError = 'Email required'
        this.$refs.email.className = 'error'
      }

      if (this.password === '') {
        this.passwordError = 'Password required'
        this.$refs.password.className = 'error'
      }

      if (this.emailError !== '' && this.passwordError !== '') {
        return
      }

      const login = gql`
        mutation login($email: String!, $password: String!) {
          login(email: $email, password: $password)
        }
      `

      try {
        const res = await this.$apollo.mutate({
          mutation: login,
          variables: {
            email: this.email,
            password: this.password,
          },
        })
        this.$store.commit('auth/setToken', res.data.login)
        await this.$apolloHelpers.onLogin(res.data.login)
        this.$router.push({ path: '/' })
      } catch (ex) {
        alert(ex)
      }
    },
  },
}
</script>
<style scoped>
.login-form {
  display: grid;
  width: 100%;
}

.login-form input {
  height: 35px;
  border-radius: 5px;
  border: 1px solid;
  background: aliceblue;
  padding: 0 10px;
  outline: none;
}

.login-form input.error {
  border: 2px solid #ff0086;
}

.error-text {
  text-align: left;
  padding: 5px 0px 10px;
  color: #f913d2;
}

.login-btn {
  height: 35px;
  margin-bottom: 10px;
  background: #beb4fb;
  color: black;
  border: none;
  border-radius: 5px;
}

.register-btn {
  text-decoration: none;
  color: #ff00c8;
}
</style>
