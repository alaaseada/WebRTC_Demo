const socket = io('/');
const videoGrid = document.querySelector('#video-grid');
const make_call_btn = document.querySelector('#make-call-btn');

myPeer = new Peer({
  config: {
    iceServers: [
      {
        url: 'stun:154.180.212.237:3478',
        username: 'alaaseada',
        credential: '@L@@password',
      },
    ],
  },
});

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);
    myPeer.on('call', (call) => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
    socket.on('user-connected', (userId) => {
      connectToNewUser(userId, stream);
    });
  });

socket.on('user-disconnected', (userId) => {
  if (peers[userId]) peers[userId].close();
});

myPeer.on('open', (id) => {
  socket.emit('join-room', ROOM_ID, id);
});
console.log(myPeer);

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}

make_call_btn.addEventListener('click', callMyMobile);

function callMyMobile() {
  const mobilePeer = new Peer();
  getUserMedia({ audio: true, video: true }).then((stream) => {
    const call = myPeer.call();
    call.on('stream', (remoteStream) => {});
  });
}
