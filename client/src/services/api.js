// import axios from 'axios'
// const api = axios.create({
//     baseURL: 'http://localhost:8080/auth',
// })
// export const googleAuth = (code) => api.get(`/google?code=${code}`)

import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080', // Changed to base backend URL
})

export const googleAuth = (code) => api.get(`/auth/google?code=${code}`)

// Add new method for saving coins
export const saveCoin = (coin) => {
    const userInfo = JSON.parse(localStorage.getItem('user-info'))
    return api.post('/api/save-coin', { coin }, {
        headers: {
            'Authorization': `Bearer ${userInfo.token}`
        }
    })
}