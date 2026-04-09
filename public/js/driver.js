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

// const socket = io();
// const orderId = "PATNA_LIVE_TRACK"; 

// // 1. Map Setup
// const map = L.map('map').setView([25.5941, 85.1376], 13);
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// // 2. Icons Setup (Bhaiya ko bhi bike hi dikhegi)
// const bikeIcon = L.icon({
//     iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
//     iconSize: [45, 45],
//     iconAnchor: [22, 22]
// });

// const userIcon = L.icon({
//     iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41]
// });

// let driverMarker = null;
// let userMarker = null;
// let routingControl = null;

// // 3. Join Order Room
// socket.emit('join-order', orderId);

// // 4. Real-time GPS Tracking (Bhaiya ki movement)
// if (navigator.geolocation) {
//     navigator.geolocation.watchPosition((pos) => {
//         const { latitude, longitude } = pos.coords;
//         const driverLoc = L.latLng(latitude, longitude);

//         // Bike Marker update/create
//         if (!driverMarker) {
//             driverMarker = L.marker(driverLoc, { icon: bikeIcon }).addTo(map)
//                 .bindPopup("Aap (Driver)").openPopup();
//         } else {
//             driverMarker.setLatLng(driverLoc);
//         }

//         // Map ko driver ke sath sath move karna
//         map.setView(driverLoc, 16);

//         // Server ko location bhejna taaki User bhi dekh sake
//         socket.emit('update-location', {
//             orderId,
//             lat: latitude,
//             lng: longitude
//         });

//         // Agar user ki location mil gayi hai, toh rasta dikhao
//         updateRoute();

//     }, (err) => console.error(err), { enableHighAccuracy: true });
// }

// // 5. User ki location receive karna (Optionally server se bhej sakte ho)
// // Abhi ke liye hum rasta tabhi banayenge jab dono points honge
// function updateRoute() {
//     if (driverMarker && userMarker && !routingControl) {
//         routingControl = L.Routing.control({
//             waypoints: [driverMarker.getLatLng(), userMarker.getLatLng()],
//             createMarker: () => null,
//             lineOptions: { styles: [{ color: '#27ae60', weight: 6 }] },
//             addWaypoints: false,
//             draggableWaypoints: false
//         }).addTo(map);
//     } else if (routingControl && driverMarker) {
//         routingControl.setWaypoints([driverMarker.getLatLng(), userMarker.getLatLng()]);
//     }
// }