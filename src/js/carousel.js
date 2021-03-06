import $ from 'jquery'
export default class Carousel {

	constructor(carouselElem, instructionElem) {
		this.currentSlide = 0;
		this.data = {};
		this.repeat;
		this.carouselElem = carouselElem;
		this.instructionElem = instructionElem;
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
			self.showInstructionTxt(resp.instruction);
			self.createCarouselSlides(resp.slides);
			self.createCarouselIndicators();
			self.initializeCarouselLibrary();
			self.bindCarouselEvents();
			// self.normalizeCarouselSlideHeights(self.carouselElem.find(".item"));
		})
			.catch((err) => { });
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

	createCarouselSlides(multimediaContent) {
		for (let i in multimediaContent) {
			let className = (i > 0) ? "item" : "item active",
				slide = '<div class="' + className + '">';
			switch (multimediaContent[i].type) {
				case "image":
					slide += '<img src="' + multimediaContent[i].link + '" alt="">';
					break;
				case "audio":
					slide += '<audio controls> <source src="' + multimediaContent[i].link + '" type="audio/mp3"> </audio>';
					break;
				case "video":
					slide += '<video controls> <source src="' + multimediaContent[i].link + '" type="video/mp4"> </video>';
					break;
			}
			// slide += '<div class="carousel-caption"><p class="caption-text" aria-live="polite">' + multimediaContent[i].caption + '</p></div>';
			slide += '</div>';
			this.carouselElem.find(".carousel-inner").append(slide);
		}
		this.showSlideCaption(0);
	}

	createCarouselIndicators() {
		let indicators = "",
			target = '#' + this.carouselElem.attr("id");
		for (let i in this.data.slides) {
			let className = (i > 0) ? "" : "active";
			let label = "Go to slide " + (parseInt(i)+1);
			indicators += '<li tabindex="0" aria-label="' + label + '" data-target="' + target + '" data-slide-to="' + i + '" class="' + className + '"></li>';
		}
		this.carouselElem.find(".carousel-indicators").append(indicators);
	}

	bindCarouselEvents() {
		let self = this;
		this.carouselElem.find(".left").off('click').on("click", () => {
			self.addAccessibility();
			self.manageCarousel("prev");
		});

		this.carouselElem.find(".right").off('click').on("click", () => {
			self.addAccessibility();
			self.manageCarousel("next");
		});

		this.carouselElem.on('slide.bs.carousel', () => {
			self.stopMediaPlaying();
		});

		this.carouselElem.on('slid.bs.carousel', () => {
			self.showSlideCaption(self.getCurrentSlideNumber());
		});

		$(window).on('resize orientationchange', () => {
			self.normalizeCarouselSlideHeights(self.carouselElem.find(".item"));
		});

		this.carouselElem.find(".item").children().on('load', () => {
			self.normalizeCarouselSlideHeights(self.carouselElem.find(".item"));
		});

		this.carouselElem.find(".carousel-indicators li").off("keydown").on("keydown",function(e){
			if(e.which === 13 || e.which === 32){
				let target = parseInt($(e.target).attr("data-slide-to"));
				self.manageCarousel(target);
			}
		});
	}

	showInstructionTxt(val) {
		this.instructionElem.text(val);
	}

	showSlideCaption(slideNumber) {
		this.carouselElem.find(".caption-text").text(this.data.slides[slideNumber].caption);
	}

	getCurrentSlideNumber() {
		return this.carouselElem.find('.item.active').index() - 1;
	}

	stopMediaPlaying() {
		if ($(".item.active audio").length > 0) {
			$(".item.active audio")[0].currentTime = 0;
			$(".item.active audio")[0].pause();
		}
		if ($(".item.active video").length > 0) {
			$(".item.active video")[0].currentTime = 0;
			$(".item.active video")[0].pause();
		}
	}

	// Normalize Carousel Heights - pass in Bootstrap Carousel slides.
	normalizeCarouselSlideHeights(slides) {
		let items = slides, //grab all slides
			heights = [], //create empty array to store height values
			tallest = 0; //create variable to make note of the tallest slide

		items.each(() => {
			items.css('min-height', '0'); //reset min-height
		});

		items.each((index, value) => { //add heights to array
			heights.push(items.height());
		});

		tallest = Math.max.apply(null, heights); //store largest value

		items.each(() => {
			items.css('min-height', tallest + 'px');
		});
	}

	addAccessibility() {
		if (!this.carouselElem.find(".caption-text").attr("aria-live")) {
			this.carouselElem.find(".caption-text").attr({ "aria-live": "polite", "aria-atomic": true });
		}
	}
}