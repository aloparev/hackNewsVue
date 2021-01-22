<template>
  <form class="login-form" @submit.prevent="submit">
    <div v-if="error">
      <small class="error-text"> {{ error.message }}</small>
    </div>
    <div v-if="loading">
      <small class="loading-text">Loading...</small>
    </div>
    <input
      id="email"
      v-model.trim="formData.email"
      name="email"
      type="email"
      placeholder="Email"
    />
    <input
      id="password"
      v-model.trim="formData.password"
      name="password"
      type="password"
      placeholder="Password"
    />
    <button class="login-btn" type="submit" :disabled="loading || !valid">
      Login
    </button>
    <div>
      <small>Not a member?</small>
      <NuxtLink class="register-btn" to="signup"> Sign up now </NuxtLink>
    </div>
  </form>
</template>
<script>
import { mapActions } from 'vuex'
import { UNKNOWN_ERROR, LOGIN_ERRORS } from '@/static/error'

export default {
  name: 'LoginForm',
  data() {
    return {
      formData: {
        email: '',
        password: '',
      },
      error: null,
      loading: false,
    }
  },
  computed: {
    valid() {
      const { email, password } = this.formData
      return email && password
    },
  },
  methods: {
    ...mapActions('auth', ['login']),
    async submit() {
      try {
        this.error = null
        this.loading = true
        await this.login({ ...this.formData })
        this.$router.push({ path: '/' })
      } catch (ex) {
        let message = ex.message.replace('GraphQL error:', ' ').trim()
        if (!LOGIN_ERRORS.includes(message)) {
          message = UNKNOWN_ERROR
        }
        this.error = { message }
      } finally {
        this.loading = false
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
  margin: 10px 0px;
  outline: none;
}

.error-text,
.loading-text {
  text-align: left;
  padding: 5px 0px 10px;
  font-weight: 900;
}

.error-text {
  color: #f50749;
}

.loading-text {
  color: green;
}

.login-btn {
  height: 35px;
  margin-bottom: 10px;
  background: #75c2f9;
  color: black;
  border: none;
  border-radius: 5px;
}

.login-btn:disabled {
  background: darkgray;
  cursor: no-drop;
  outline: none;
}

.register-btn {
  text-decoration: none;
  color: #0d9ef3;
}
</style>
