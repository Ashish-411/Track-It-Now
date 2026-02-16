import {Icon}from 'leaflet';


export const agentIcon = new Icon({
  iconUrl : "/delivery-bike.png",
  iconSize: [25,25],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

export const customerIcon = new Icon({
    iconUrl: "/placeholder.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});
export const selectedAgentIcon = new Icon({
  iconUrl: "/delivery-bike.png",
  iconSize: [50, 50],  // Bigger size to show it's selected
  iconAnchor: [25, 50],
  popupAnchor: [0, -50],
});
