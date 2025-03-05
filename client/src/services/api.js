import axios from 'axios'

const api = axios.create({
    baseURL: 'https://crypto-api-1078438493144.us-central1.run.app', 
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