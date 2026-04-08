const socket = io();
const orderId = "PATNA_LIVE_TRACK"; 

// 1. Join Order Room
socket.emit('join-order', orderId);

// 2. Map initialization (Bhaiya ko apni location dikhane ke liye)
const map = L.map('map').setView([0, 0], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const marker = L.marker([0, 0]).addTo(map);

// 3. Real GPS Tracking
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        
        // Update marker on driver's phone
        marker.setLatLng([latitude, longitude]);
        map.setView([latitude, longitude]);

        // Send exact location to Server
        socket.emit('update-location', {
            orderId,
            lat: latitude,
            lng: longitude
        });
    }, (err) => console.error("GPS Error:", err), 
    { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 });
} else {
    alert("Bhai, aapke browser mein GPS support nahi hai!");
}