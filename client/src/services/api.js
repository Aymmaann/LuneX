import axios from 'axios'

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
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

export const getUserCoins = () => {
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    return api.get('/api/get-user-coins', { 
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })
}