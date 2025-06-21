const apiKey = `at_nBIh9Lopw4zKXQuZPFEM8EMR8pbsO`;

// DOM elements
const ipValue = document.querySelector(".ip-value");
const locationValue = document.querySelector(".location-value");
const timeValue = document.querySelector(".time-value");
const ispValue = document.querySelector(".isp-value");

// Dapetin IP dari query params
const ip = new URLSearchParams(window.location.search).get("ip");

// Setup map
const map = L.map("map").setView([0, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

// Custom icon
const customIcon = L.icon({
  iconUrl: "images/icon-location.svg",
  iconSize: [38, 45],
  iconAnchor: [19, 45],
});

let marker = null;

// Utility untuk update UI
const updateUI = (data) => {
  const { ip, isp, location } = data;
  const { country, region, postalCode, timezone } = location;

  ipValue.textContent = ip;
  locationValue.textContent = `${country}, ${region} ${postalCode}`;
  timeValue.textContent = `UTC ${timezone}`;
  ispValue.textContent = isp;
};

// Utility untuk update map
const updateMap = (lat, lng) => {
  map.setView([lat, lng], 13);

  if (marker) marker.remove();
  marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
};

// Fetch IP info
const fetchIPData = async (ip) => {
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ip}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("IP address not found or API error");

    const data = await res.json();
    updateUI(data);
    updateMap(data.location.lat, data.location.lng);
  } catch (err) {
    console.log(err);
    updateUI({
      ip: "Not Found",
      location: {
        country: "-",
        region: "-",
        postalCode: "",
      },
      timezone: "-",
      isp: "-",
    });

    if (marker) marker.remove();
    map.setView([0, 0], 2);
  }
};

if (ip) {
  fetchIPData(ip);
}
