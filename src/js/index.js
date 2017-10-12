import Carousel from './carousel';

$(document).ready(function() {
    let carousel = new Carousel();
    carousel.startCarousel("data/data.json");
});
