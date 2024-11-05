export function currencyFormat(num){
    return "₱" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

import axios from 'axios';

export const getUser = async () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken'); // Adjust if you're using sessionStorage
        if (token) {
            try {
                const response = await axios.get('http://localhost:4000/api/auth/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response.data.user; // Adjust according to your response structure
            } catch (error) {
                console.error("Error fetching user data:", error);
                return null; // Return null if there's an error
            }
        }
    }
    return false; // If no token is found
};
