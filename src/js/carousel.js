import $ from 'jquery'
export default class Carousel {

    constructor(carouselElem) {
        this.currentSlide = 0;
        this.data = {};
        this.repeat;
        this.carouselElem = carouselElem;
    }

    getData(dataUrl) {
        return $.ajax({
            url: dataUrl,
            type: "GET",
            success: (data, status, xhr) => {
                return data;
            }
        });
    };

    startCarousel(url) {

        let data = this.getData(url),
            self = this;
        data.then((resp) => {
                self.data = resp;
                self.repeat = resp.repeat;
                self.showInstruction(resp.instruction);
                self.createSlides(resp.slides);
                self.initializeCarouselLibrary();
                self.bindEvents();

                // self.resizeImage();
            })
            .catch((err) => {});
    }

    initializeCarouselLibrary() {
        let config = {
            interval: false,
            pause: false,
            wrap: this.repeat
        }
        this.manageCarousel(config);
    }

    manageCarousel(options) {
        this.carouselElem.carousel(options);
    }

    createSlides(multimediaContent) {
        for (let i in multimediaContent) {
            let className = (i > 0) ? "item" : "item active",
                slide = "";
            switch (multimediaContent[i].type) {
                case "image":
                    slide = '<div class="' + className + '">  <img src="' + multimediaContent[i].link + '" alt=""> <div class="carousel-caption"><p class="caption-text">' + multimediaContent[i].caption + '</p></div></div>';
                    break;
                case "audio":
                    slide = '<div class="' + className + '"> <audio controls> <source  src="' + multimediaContent[i].link + '"  type="audio/mpeg">  </audio>  <div class="carousel-caption"><p class="caption-text">' + multimediaContent[i].caption + '</p></div> </div>';
                    break;
                case "video":
                    slide = '<div class="' + className + '"> <video controls preload="metadata"> <source src="' + multimediaContent[i].link + '" type="video/mp4"> </video> <div class="carousel-caption"><p class="caption-text">' + multimediaContent[i].caption + '</p></div> </div>';
                    break;
            }
            this.carouselElem.find(".carousel-inner").append(slide);
        }
    }

    bindEvents() {
        let self = this;
        this.carouselElem.find(".left").on("click", (e) => {
            self.manageCarousel("prev");
        });

        this.carouselElem.find(".right").on("click", (e) => {
            self.manageCarousel("next");
        });

        this.carouselElem.on('slide.bs.carousel', function() {
            self.normalizeHeights(self.carouselElem.find(".item"));
            self.stopMediaPlaying();
        });

        $(window).on('resize orientationchange', () => {
            self.normalizeHeights(self.carouselElem.find(".item"));
        });

        $(window).on('load', () => {
            self.normalizeHeights(self.carouselElem.find(".item"));
        });
    }

    showInstruction(val) {
        $("#myCarousel").find(".intructionTxt").text(val);
    }

    stopMediaPlaying() {
        if ($(".item-active audio").length > 0) {
            $(".item-active audio")[0].currentTime = 0;
            $(".item-active audio")[0].pause();
        }
        if ($(".item-active video").length > 0) {
            $(".item-active video")[0].currentTime = 0;
            $(".item-active video")[0].pause();
        }
    }

    // Normalize Carousel Heights - pass in Bootstrap Carousel items.
    normalizeHeights(slides) {
        let items = slides, //grab all slides
            heights = [], //create empty array to store height values
            tallest = 0; //create variable to make note of the tallest slide

        items.each(() => {
            items.css('min-height', '0'); //reset min-height
        });

        items.each(() => { //add heights to array
            heights.push(items.height());
        });

        tallest = Math.max.apply(null, heights); //cache largest value

        items.each(() => {
            items.css('min-height', tallest + 'px');
        });
    }
}
