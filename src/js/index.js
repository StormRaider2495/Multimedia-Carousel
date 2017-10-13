import Carousel from './carousel';

$(document).ready(function() {
    let carouselElem = $("#myCarousel"),
        instructionElem = $("#instructionTxt"),
        carousel = new Carousel(carouselElem,instructionElem);
    carousel.startCarousel("data/data.json");
});
