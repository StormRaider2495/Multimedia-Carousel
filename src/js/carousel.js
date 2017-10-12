import $ from 'jquery'
export default class Carousel {

    constructor() {
        this.currentSlide = 0;
        this.data = {};
        this.repeat;
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
                // self.initializeCarouselLibrary();
                // self.bindEvents();
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
        return $("#myCarousel").carousel(options);
    }

    createSlides(multimediaContent) {
        for (let i in multimediaContent) {
            let className = (i > 0) ? "item" : "item active",
                slide = "";
            switch (multimediaContent[i].type) {
                case "image":
                    slide = '<div class="' + className + '">  <img src="' + multimediaContent[i].link + '" alt=""> </div>';
                    break;
                case "audio":
                    slide = '<div class="' + className + '"> <audio controls> <source  src="' + multimediaContent[i].link + '"  type="audio/mpeg">  </audio>  </div>';
                    break;
                case "video":
                    slide = '<div class="' + className + '"> <video controls preload="metadata"> <source src="' + multimediaContent[i].link + '" type="video/mp4"> </video> </div>';
                    break;
            }
            $("#myCarousel").find(".carousel-inner").append(slide);
        }
        this.showCaption(0);
    }

    showCaption(slideNumber) {
        $(".slide-caption").text(this.data.slides[slideNumber].caption);
    }

    getSlideNumber() {
        let slideNum = this.manageCarousel("slickCurrentSlide");
        return slideNum;
    }

    bindEvents() {
        let self = this;
        $("#myCarousel").find(".controls.left").on("click", (e) => {
            self.stopMediaPlaying();
            self.manageCarousel("slickPrev");
            self.showCaption(self.getSlideNumber());
        });

        $("#myCarousel").find(".controls.right").on("click", (e) => {
            self.stopMediaPlaying();
            self.manageCarousel("slickNext");
            self.showCaption(self.getSlideNumber());
        });

        // $(window).resize(function() {
        //     self.resizeImage();
        // });
    }

    resizeImage() {
        $(".slick-active img").height($(".carousel").height());
    }

    showInstruction(val) {
        $("#myCarousel").find(".intructionTxt").text(val);
    }

    stopMediaPlaying() {
        if ($(".slick-active audio").length > 0) {
            $(".slick-active audio")[0].currentTime = 0;
            $(".slick-active audio")[0].pause();
        }
        if ($(".slick-active video").length > 0) {
            $(".slick-active video")[0].currentTime = 0;
            $(".slick-active video")[0].pause();
        }
    }
}
