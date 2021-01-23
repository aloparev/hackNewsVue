<template>
  <form class="signup-form" @submit.prevent="submit">
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
    <input
      id="name"
      v-model.trim="formData.name"
      name="name"
      type="text"
      placeholder="Name"
    />
    <button class="signup-btn" type="submit" :disabled="loading || !valid">
      Sign up
    </button>
    <div>
      <small>Already have an account?</small>
      <NuxtLink class="login-btn" to="/login"> Login here </NuxtLink>
    </div>
  </form>
</template>
<script>
import { mapActions } from 'vuex'
import { UNKNOWN_ERROR, SIGNUP_ERRORS } from '@/static/error'

export default {
  name: 'SignupForm',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
      },
      error: null,
      loading: false,
    }
  },
  computed: {
    valid() {
      const { name, email, password } = this.formData
      return email && password && name
    },
  },
  methods: {
    ...mapActions('auth', ['signup']),
    async submit() {
      try {
        this.error = null
        this.loading = true
        await this.signup({ ...this.formData })
        this.$router.push({ path: '/' })
      } catch (ex) {
        let message = ex.message.replace('GraphQL error:', ' ').trim()
        if (!SIGNUP_ERRORS.includes(message)) {
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

.signup-btn {
  height: 35px;
  margin-bottom: 10px;
  background: #75c2f9;
  color: black;
  border: none;
  border-radius: 5px;
}

.signup-btn:disabled {
  background: darkgray;
  cursor: no-drop;
  outline: none;
}

.login-btn {
  text-decoration: none;
  color: #0d9ef3;
}
</style>
