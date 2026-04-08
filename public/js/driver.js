const socket = io();
const orderId = "PATNA_ORDER_99"; 

// High accuracy GPS settings
const geoOptions = {
    enableHighAccuracy: true, // GPS use karega (Cell tower nahi)
    maximumAge: 0,            // Cache location nahi, fresh data chahiye
    timeout: 5000
};

navigator.geolocation.watchPosition((pos) => {
    const { latitude, longitude, heading, speed } = pos.coords;
    
    socket.emit('update-location', {
        orderId,
        lat: latitude,
        lng: longitude,
        rotation: heading || 0,
        speed: speed || 0
    });
    
    console.log(`Real Location Sent: ${latitude}, ${longitude}`);
}, (err) => console.error("GPS Error:", err), geoOptions);