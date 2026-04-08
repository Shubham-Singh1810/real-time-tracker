const socket = io();
const orderId = "PATNA_LIVE_TEST"; // Dono side same honi chahiye

const map = L.map('map').setView([25.5941, 85.1376], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// 1. Custom Icons (Red for Driver, Blue for User)
const driverIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41]
});

const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41]
});

let driverMarker = null;
let userMarker = null;
let routingControl = null;

// 2. Pehle User (Aap) apni location set karein
navigator.geolocation.getCurrentPosition((pos) => {
    const userLatLng = L.latLng(pos.coords.latitude, pos.coords.longitude);
    userMarker = L.marker(userLatLng, { icon: userIcon }).addTo(map).bindPopup("Main Yahan Hoon (Ghar)").openPopup();
    map.setView(userLatLng, 15);
    
    // Socket join karein jab user location mil jaye
    socket.emit('join-order', orderId);
});

// 3. Bhaiya (Driver) ki location receive karna
socket.on('location-synced', (data) => {
    const driverLatLng = L.latLng(data.lat, data.lng);

    if (!driverMarker) {
        driverMarker = L.marker(driverLatLng, { icon: driverIcon }).addTo(map).bindPopup("Bhaiya (Driver)");
    } else {
        driverMarker.setLatLng(driverLatLng);
    }

    // 4. Dynamic Routing (Road ke raste)
    if (userMarker) {
        const userLatLng = userMarker.getLatLng();
        
        if (routingControl) {
            routingControl.setWaypoints([driverLatLng, userLatLng]);
        } else {
            routingControl = L.Routing.control({
                waypoints: [driverLatLng, userLatLng],
                createMarker: function() { return null; }, // Extra default markers hide karein
                lineOptions: { styles: [{ color: 'green', weight: 4 }] },
                addWaypoints: false,
                draggableWaypoints: false
            }).addTo(map);
        }
    }
});