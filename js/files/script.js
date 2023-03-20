// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from './functions.js'
// Підключення списку активних модулів
import { flsModules } from './modules.js'

//====================================================================================================

/* Каталог сортировка */
// Get references to the radio buttons and card elements
const singleButton = document.getElementById('option1')
const doubleButton = document.getElementById('option2')
const childButton = document.getElementById('option3')
const eliteButton = document.getElementById('option4')
const warriorButton = document.getElementById('option5')
const accessoryButton = document.getElementById('option6')
const cardElements = document.querySelectorAll('.katalog__img')
const availableCheckbox = document.getElementById('available')
const thredCheckbox = document.getElementById('thre-d')
const graniteChecbox = document.getElementById('granite')
const marbleChecbox = document.getElementById('marble')
const label = document.querySelector('.katalog__checkbox-text')
const filterDrop = document.querySelector('.katalog__filterdrop')
// Add an event listener to the radio buttons
if (singleButton) {
	singleButton.addEventListener('change', handleCategoryChange)
}
if (doubleButton) {
	doubleButton.addEventListener('change', handleCategoryChange)
}
if (childButton) {
	childButton.addEventListener('change', handleCategoryChange)
}
if (eliteButton) {
	eliteButton.addEventListener('change', handleCategoryChange)
}
if (warriorButton) {
	warriorButton.addEventListener('change', handleCategoryChange)
}
if (accessoryButton) {
	accessoryButton.addEventListener('change', handleCategoryChange)
}
if (availableCheckbox) {
	availableCheckbox.addEventListener('change', handleTypeChange)
}
if (thredCheckbox) {
	thredCheckbox.addEventListener('change', handleTypeDChange)
}
if (graniteChecbox) {
	graniteChecbox.addEventListener('change', handleGraniteChange)
}
if (marbleChecbox) {
	marbleChecbox.addEventListener('change', handleMarbleChange)
}

// Define the event handler function
function handleCategoryChange(event) {
	// Get the value of the selected radio button
	const selectedCategory = event.target.value

	// Loop over all card elements and show/hide them based on their category
	cardElements.forEach(cardElement => {
		availableCheckbox.checked = false
		thredCheckbox.checked = false
		graniteChecbox.checked = false
		marbleChecbox.checked = false
		cardElement.classList.remove('katalog__img-hiden-price')
		cardElement.classList.remove('katalog__img-hiden-marble')
		cardElement.classList.remove('katalog__img-hiden-granite')
		cardElement.classList.remove('katalog__img-hiden-3d')
		cardElement.classList.remove('katalog__img-hiden-available')
		if (cardElement.classList.contains(selectedCategory)) {
			cardElement.classList.remove('katalog__img-hiden')
		} else {
			cardElement.classList.add('katalog__img-hiden')
		}
	})
}

function handleTypeChange(event) {
	// Get the value of the selected radio button
	const selectedType = event.target.value

	// Loop over all card elements and show/hide them based on their category
	cardElements.forEach(cardElement => {
		if (this.checked) {
			label.classList.add('selected')
			if (!cardElement.classList.contains('katalog__img-hiden')) {
				if (cardElement.classList.contains(selectedType)) {
					cardElement.classList.remove('katalog__img-hiden-available')
				} else {
					cardElement.classList.add('katalog__img-hiden-available')
				}
			}
		} else {
			label.classList.remove('selected')
			cardElement.classList.remove('katalog__img-hiden-available')
		}
	})
}
function handleTypeDChange(event) {
	// Get the value of the selected radio button
	const selectedType = event.target.value

	// Loop over all card elements and show/hide them based on their category
	cardElements.forEach(cardElement => {
		if (this.checked) {
			label.classList.add('selected')
			if (!cardElement.classList.contains('katalog__img-hiden')) {
				if (cardElement.classList.contains(selectedType)) {
					cardElement.classList.remove('katalog__img-hiden-3d')
				} else {
					cardElement.classList.add('katalog__img-hiden-3d')
				}
			}
		} else {
			label.classList.remove('selected')
			cardElement.classList.remove('katalog__img-hiden-3d')
		}
	})
}
function handleGraniteChange(event) {
	// Get the value of the selected radio button
	const selectedType = event.target.value

	// Loop over all card elements and show/hide them based on their category
	cardElements.forEach(cardElement => {
		if (this.checked) {
			label.classList.add('selected')
			if (!cardElement.classList.contains('katalog__img-hiden')) {
				if (cardElement.classList.contains(selectedType)) {
					cardElement.classList.remove('katalog__img-hiden-granite')
				} else {
					cardElement.classList.add('katalog__img-hiden-granite')
				}
			}
		} else {
			label.classList.remove('selected')
			cardElement.classList.remove('katalog__img-hiden-granite')
		}
	})
}
function handleMarbleChange(event) {
	// Get the value of the selected radio button
	const selectedType = event.target.value

	// Loop over all card elements and show/hide them based on their category
	cardElements.forEach(cardElement => {
		if (this.checked) {
			label.classList.add('selected')
			if (!cardElement.classList.contains('katalog__img-hiden')) {
				if (cardElement.classList.contains(selectedType)) {
					cardElement.classList.remove('katalog__img-hiden-marble')
				} else {
					cardElement.classList.add('katalog__img-hiden-marble')
				}
			}
		} else {
			label.classList.remove('selected')
			cardElement.classList.remove('katalog__img-hiden-marble')
		}
	})
}
// Initially show only the single category cards
/* handleCategoryChange({ target: singleButton }) */

//====================================================================================================

//Каталог-полоска выбора цены
/* const slider1 = document.querySelector('.slider1')
const slider2 = document.querySelector('.slider2')
const value1 = document.querySelector('.value1')
const value2 = document.querySelector('.value2')
console.log('value1', slider1.value)
console.log('value2', value2)
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
} */
const slider1 = document.querySelector('.slider1')
const slider2 = document.querySelector('.slider2')
const value1 = document.querySelector('.value1')
const value2 = document.querySelector('.value2')
if (slider1) {
	slider1.addEventListener('input', function () {
		value1.textContent = this.value + ' UAH'
		filterCards()
	})
}

if (slider2) {
	slider2.addEventListener('input', function () {
		value2.textContent = this.value + ' UAH'
		filterCards()
	})
}

function filterCards() {
	const minPrice = parseInt(slider1.value)
	const maxPrice = parseInt(slider2.value)

	cardElements.forEach(function (cardElements) {
		const price = parseInt(cardElements.getAttribute('data-price'))

		if (price >= minPrice && price <= maxPrice) {
			cardElements.classList.remove('katalog__img-hiden-price')
		} else {
			cardElements.classList.add('katalog__img-hiden-price')
		}
	})
}
if (filterDrop) {
	filterDrop.addEventListener('click', () => {
		availableCheckbox.checked = false
		thredCheckbox.checked = false
		graniteChecbox.checked = false
		marbleChecbox.checked = false
		cardElements.forEach(cardElement => {
			cardElement.classList.remove('katalog__img-hiden-price')
			cardElement.classList.remove('katalog__img-hiden-marble')
			cardElement.classList.remove('katalog__img-hiden-granite')
			cardElement.classList.remove('katalog__img-hiden-3d')
			cardElement.classList.remove('katalog__img-hiden-available')
		})
	})
}

//====================================================================================================

//Добавление галочки в блоке 3Д
const priceList1 = document.querySelector('.thred__price-list1')
const priceList2 = document.querySelector('.thred__price-list2')
const priceList3 = document.querySelector('.thred__price-list3')

function priseListFunc(price) {
	if (price) {
		const links = price.querySelectorAll('.thred__price-link')

		links.forEach(link => {
			link.addEventListener('click', e => {
				e.preventDefault()
				const activeLink = price.querySelector('.active')

				if (activeLink) {
					activeLink.classList.remove('active')
				}

				link.classList.add('active')
			})
		})
	}
}
priseListFunc(priceList1)
priseListFunc(priceList2)
priseListFunc(priceList3)

//====================================================================================================

function filterByPrice(priceCategory) {
	// Получаем все элементы, которые нужно фильтровать
	const items = document.querySelectorAll('.thred__slide')

	// Проходимся по каждому элементу и проверяем его цену
	items.forEach(item => {
		const price = parseInt(item.getAttribute('data-price'))

		// Если цена соответствует выбранной категории, показываем элемент, иначе скрываем его
		if (priceCategory === '20-30' && price >= 20000 && price <= 30000) {
			item.style.display = 'block'
		} else if (priceCategory === '30-50' && price >= 30000 && price <= 50000) {
			item.style.display = 'block'
		} else if (priceCategory === '50-80' && price >= 50000 && price <= 80000) {
			item.style.display = 'block'
		} else if (priceCategory === '80+' && price >= 80000) {
			item.style.display = 'block'
		} else {
			item.style.display = 'none'
		}
	})
}

const button20to30 = document.querySelector('#btn-20-30')
if (button20to30) {
	button20to30.addEventListener('click', () => {
		filterByPrice('20-30')
	})
}
const button30to50 = document.querySelector('#btn-30-50')
if (button30to50) {
	button30to50.addEventListener('click', () => {
		filterByPrice('30-50')
	})
}
const button50to80 = document.querySelector('#btn-50-80')
if (button50to80) {
	button50to80.addEventListener('click', () => {
		filterByPrice('50-80')
	})
}

const button80plus = document.querySelector('#btn-80-plus')
if (button80plus) {
	button80plus.addEventListener('click', () => {
		filterByPrice('80+')
	})
}
//====================================================================================================

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
