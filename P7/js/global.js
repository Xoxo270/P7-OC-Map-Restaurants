var map;
var service;
var restaurants;
var notemini;
var notemaxi;
var markers = [];

function initMap() {
    const liste = new Liste();
    const mapObjet = new MapClass(liste);
    const miseEnRoute = new MiseEnRoute(mapObjet, liste);
}