import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

function getEchoInstance() {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    window.Pusher = Pusher;

    return new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        forceTLS: true,
        authEndpoint: `${import.meta.env.VITE_BASE_URL}/broadcasting/auth`,
        withCredentials: true,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });
}

export default getEchoInstance;