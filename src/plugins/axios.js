import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import store from '../store'
import firebaseConfig from '../../firebaseConfig'

const region = 'us-central1'

const firebaseAPI = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? `https://${region}-${firebaseConfig.projectId}.cloudfunctions.net/` : `http://localhost:5000/${firebaseConfig.projectId}/${region}/`,
  timeout: 10000
})

firebaseAPI.interceptors.request.use(async (config) => {
  const dif = moment(store.state.claims.exp * 1000).diff(moment(), 'minutes')
  if (dif < 10) await store.dispatch('getToken')
  config.headers.authorization = store.state.token
  return config
}, function (error) {
  return Promise.reject(error)
})

Vue.prototype.$axios = firebaseAPI
