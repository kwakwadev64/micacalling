// 1. On se connecte au réseau PeerJS
const peer = new Peer();
let localStream; // Cette variable stockera notre flux vidéo/audio

// 2. On affiche notre ID dès qu'il est généré par le serveur
peer.on('open', (id) => {
    document.getElementById('my-id').innerText = id;
});

// 3. On demande l'accès à la caméra et au micro
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
.then((stream) => {
    // On stocke le flux dans notre variable
    localStream = stream;
    // On l'affiche dans notre balise <video> locale
    const localVideo = document.getElementById('local-video');
    localVideo.srcObject = stream;
})
.catch((error) => {
    console.error("Impossible d'accéder à la caméra : ", error);
});
peer.on('call', (call) => {
    // Répondre à l'appel en envoyant notre propre flux vidéo/audio
    call.answer(localStream);
    
    // Attendre de recevoir le flux vidéo de l'ami
    call.on('stream', (remoteStream) => {
        // L'afficher dans la balise <video> de l'ami
        const remoteVideo = document.getElementById('remote-video');
        remoteVideo.srcObject = remoteStream;
    });
});
// Gestion du clic sur le bouton "Appeler"
document.getElementById('call-btn').addEventListener('click', () => {
    // Récupérer l'ID de l'ami écrit dans la case
    const remoteId = document.getElementById('remote-id').value;
    
    // Lancer l'appel en envoyant notre flux vidéo
    const call = peer.call(remoteId, localStream);
    
    // Attendre de recevoir le flux vidéo de l'ami en retour
    call.on('stream', (remoteStream) => {
        const remoteVideo = document.getElementById('remote-video');
        remoteVideo.srcObject = remoteStream;
    });
});