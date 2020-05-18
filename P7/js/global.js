var map;
var service;
var restaurants;
var notemini;
var notemaxi;
var markers = [];

/* instanciation des class JS */
function initMap() {
    const liste = new Liste();
    const mapObjet = new MapClass(liste);
    const miseEnRoute = new MiseEnRoute(mapObjet, liste);
}