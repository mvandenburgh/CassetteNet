import axios from 'axios';

axios.defaults.withCredentials = true;


let SERVER_ROOT_URL;
try {
    SERVER_ROOT_URL = new URL(process.env.REACT_APP_SERVER_ROOT_URL);
} catch (err) {
    SERVER_ROOT_URL = new URL('http://localhost:5000/');
}

async function checkInToListeningRoom(listeningRoomId) {
    await axios.put(new URL(`/api/listeningroom/${listeningRoomId}/checkIn`, SERVER_ROOT_URL).href);
}

export {
    checkInToListeningRoom,
}
