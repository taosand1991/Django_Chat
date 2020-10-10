import Pusher from 'pusher-js'

const pusher = new Pusher('ca1b9cebe8e517e3529c', {
    cluster: 'eu'
});


export default pusher;