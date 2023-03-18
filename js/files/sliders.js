/*
Документація по роботі у шаблоні: 
Документація слайдера: https://swiperjs.com/
Сніппет(HTML): swiper
*/

// Підключаємо слайдер Swiper з node_modules
// При необхідності підключаємо додаткові модулі слайдера, вказуючи їх у {} через кому
// Приклад: { Navigation, Autoplay }
import Swiper, { Navigation } from 'swiper'
/*
Основні модулі слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Детальніше дивись https://swiperjs.com/
*/

// Стилі Swiper
// Базові стилі
import '../../scss/base/swiper.scss'
// Повний набір стилів з scss/libs/swiper.scss
//import '../../scss/libs/swiper.scss'
// Повний набір стилів з node_modules
// import 'swiper/css';

// Ініціалізація слайдерів
function initSliders() {
	// Список слайдерів
	// Перевіряємо, чи є слайдер на сторінці
	if (document.querySelector('.swiper__hidden', '.swiper__visible')) {
		// Вказуємо склас потрібного слайдера
		// Створюємо слайдер
		new Swiper('.brick__slider', {
			// Вказуємо склас потрібного слайдера
			// Підключаємо модулі слайдера
			// для конкретного випадку
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 2,
			spaceBetween: 30,
			lazy: true,
			speed: 800,
			loop: true,
			parallax: true,
			/* 	loop: true, */
			navigation: {
				prevEl: '.swiper-button-prev',
				nextEl: '.swiper-button-next',
			},

			// Брейкпоінти
			breakpoints: {
				320: {
					slidesPerView: 1.1,
					spaceBetween: 15,
				},
				400: {
					slidesPerView: 2,
					spaceBetween: 10,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 2,
					spaceBetween: 30,
				},
				1268: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
			},

			// Події
			on: {},
		})

		new Swiper('.warrior__slider', {
			// Вказуємо склас потрібного слайдера
			// Підключаємо модулі слайдера
			// для конкретного випадку
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 2,
			spaceBetween: 30,
			lazy: true,
			speed: 800,
			loop: true,
			parallax: true,
			navigation: {
				prevEl: '.swiper-button-prev',
				nextEl: '.swiper-button-next',
			},

			// Брейкпоінти
			breakpoints: {
				320: {
					slidesPerView: 2,
					spaceBetween: 15,
				},
				400: {
					slidesPerView: 2,
					spaceBetween: 10,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 2,
					spaceBetween: 30,
				},
				1268: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
			},

			// Події
			on: {},
		})

		new Swiper('.thred__slider', {
			// Вказуємо склас потрібного слайдера
			// Підключаємо модулі слайдера
			// для конкретного випадку
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 2,
			lazy: true,
			spaceBetween: 30,
			speed: 800,
			loop: true,
			parallax: true,
			navigation: {
				prevEl: '.swiper-button-prev',
				nextEl: '.swiper-button-next',
			},

			// Брейкпоінти
			breakpoints: {
				320: {
					slidesPerView: 1.1,
					spaceBetween: 15,
				},
				400: {
					slidesPerView: 2,
					spaceBetween: 10,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 2,
					spaceBetween: 30,
				},
				1268: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
			},

			// Події
			on: {},
		})
		new Swiper('.typebrick__slider', {
			// Вказуємо склас потрібного слайдера
			// Підключаємо модулі слайдера
			// для конкретного випадку
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 2,
			lazy: true,
			spaceBetween: 20,
			autoHeight: true,
			speed: 800,
			parallax: true,
			/* 			loop: true, */
			// Кнопки "вліво/вправо"
			navigation: {
				prevEl: '.swiper-button-prev',
				nextEl: '.swiper-button-next',
			},

			// Брейкпоінти
			breakpoints: {
				640: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
				1268: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
			},

			// Події
			on: {},
		})
	}
}
// Скролл на базі слайдера (за класом swiper scroll для оболонки слайдера)
function initSlidersScroll() {
	let sliderScrollItems = document.querySelectorAll('.swiper_scroll')
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index]
			const sliderScrollBar =
				sliderScrollItem.querySelector('.swiper-scrollbar')
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				direction: 'vertical',
				slidesPerView: 'auto',
				freeMode: {
					enabled: true,
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					snapOnRelease: false,
				},
				mousewheel: {
					releaseOnEdges: true,
				},
			})
			sliderScroll.scrollbar.updateSize()
		}
	}
}

window.addEventListener('load', function (e) {
	// Запуск ініціалізації слайдерів
	initSliders()
	// Запуск ініціалізації скролла на базі слайдера (за класом swiper_scroll)
	//initSlidersScroll();
})
