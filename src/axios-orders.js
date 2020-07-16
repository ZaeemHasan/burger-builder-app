import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-c622f.firebaseio.com/'
});

export default instance;