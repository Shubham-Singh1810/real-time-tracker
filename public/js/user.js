const socket = io();
const orderId = "PATNA_LIVE_TRACK";

// Default view India par rakhte hain, jab tak location na mile
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Icons setup
const driverIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41], iconAnchor: [12, 41]
});

const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41], iconAnchor: [12, 41]
});

let driverMarker = null;
let userMarker = null;
let routingControl = null;

// 1. Get User's Exact Current Location
navigator.geolocation.getCurrentPosition((pos) => {
    const userLatLng = L.latLng(pos.coords.latitude, pos.coords.longitude);
    
    // Aapka Blue Marker
    userMarker = L.marker(userLatLng, { icon: userIcon }).addTo(map)
        .bindPopup("Aap Yahan Hain").openPopup();
    
    map.setView(userLatLng, 15);
    socket.emit('join-order', orderId);
}, (err) => alert("Please allow location access to track!"));

// 2. Receive Driver's Exact Location
socket.on('location-synced', (data) => {
    const driverLatLng = L.latLng(data.lat, data.lng);

    // Driver's Red Marker
    if (!driverMarker) {
        driverMarker = L.marker(driverLatLng, { icon: driverIcon }).addTo(map)
            .bindPopup("Driver/Bhaiya");
    } else {
        driverMarker.setLatLng(driverLatLng);
    }

    // 3. Dynamic Road-snapped Path
    if (userMarker) {
        const userLatLng = userMarker.getLatLng();
        
        if (routingControl) {
            routingControl.setWaypoints([driverLatLng, userLatLng]);
        } else {
            routingControl = L.Routing.control({
                waypoints: [driverLatLng, userLatLng],
                createMarker: () => null, // Default markers hide karein
                lineOptions: { styles: [{ color: '#2ecc71', weight: 5 }] },
                addWaypoints: false,
                draggableWaypoints: false
            }).addTo(map);
        }
    }
});