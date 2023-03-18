// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from './functions.js'
// Підключення списку активних модулів
import { flsModules } from './modules.js'

//====================================================================================================
//Добавление галочки в блоке 3Д
const priceList = document.querySelector('.thred__price-list')
if (priceList) {
	const links = priceList.querySelectorAll('.thred__price-link')
	links.forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault()
			const activeLink = priceList.querySelector('.active')

			if (activeLink) {
				activeLink.classList.remove('active')
			}

			link.classList.add('active')
		})
	})
}
//====================================================================================================
//Каталог-полоска выбора цены
const slider1 = document.querySelector('.slider1')
const slider2 = document.querySelector('.slider2')
const value1 = document.querySelector('.value1')
const value2 = document.querySelector('.value2')

if (slider1) {
	slider1.addEventListener('input', function () {
		const minValue = parseInt(slider1.value)
		const maxValue = parseInt(slider2.value)
		value1.innerText = `${minValue} UAH`
		value2.innerText = `${maxValue} UAH`
	})
}
if (slider2) {
	slider2.addEventListener('input', function () {
		const minValue = parseInt(slider1.value)
		const maxValue = parseInt(slider2.value)
		value1.innerText = `${minValue} UAH`
		value2.innerText = `${maxValue} UAH`
	})
}

//====================================================================================================

//Калькулятор-смена екранов попапа
const progressBarBody = document.querySelector('.calc__progress-bar-body')
const progressBar = document.querySelector('.calc__progress-bar')
const questionScreens = document.querySelectorAll('.calc__question-screen')
const nextButtons = document.querySelectorAll('.calc__next-btn')
const backButtons = document.querySelectorAll('.calc__back-btn')
const questionScreenEnd = document.querySelector('.calc__question-screen-end')
let currentScreen = 0

function updateProgressBar() {
	const percent = ((currentScreen + 1) / questionScreens.length) * 100
	progressBar.style.width = `${percent}%`
}

function showScreen(index) {
	questionScreens[currentScreen].classList.remove('active')
	questionScreens[index].classList.add('active')
	currentScreen = index
	updateProgressBar()
}

nextButtons.forEach((button, index) => {
	button.addEventListener('click', () => {
		if (currentScreen < questionScreens.length - 1) {
			showScreen(currentScreen + 1)
		} else {
			// Опрос завершен
			questionScreens[currentScreen].classList.remove('active')
			questionScreenEnd.classList.add('active')
			progressBarBody.classList.add('hide')
		}
	})
})

backButtons.forEach((button, index) => {
	button.addEventListener('click', () => {
		if (currentScreen > 0) {
			showScreen(currentScreen - 1)
		}
	})
})

updateProgressBar()
showScreen(0)
//====================================================================================================
