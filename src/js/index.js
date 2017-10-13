import Carousel from './carousel';

$(document).ready(function() {
    let carouselElem = $("#multimedia-carousel");
    let carousel = new Carousel(carouselElem);
    carousel.startCarousel("data/data.json");
});
