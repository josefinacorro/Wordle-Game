let resultElement = document.querySelector('.word_result');
let mainContainer = document.querySelector('.main-container');
let rowId = 1;

//Peticion a la API de palabras
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'd0078438d6mshbe8f53330a389e6p1ae2bdjsn06ed7371986b',
		'X-RapidAPI-Host': '1000-most-common-words.p.rapidapi.com'
	}
};

fetch('https://1000-most-common-words.p.rapidapi.com/words/spanish?words_limit=1', options)
.then(word_result => word_result.json())
.finally(()=> {
	let loadingElement = document.querySelector('.loading')
	loadingElement.style.display = 'none';
})
.then(data => {
	console.log(data)
	let word = data[0];
	let wordArray = word.toUpperCase().split('');

	let actualRow = document.querySelector('.row');

	drawSquares(actualRow);
	listenInput(actualRow);
	addFocus(actualRow);


	function listenInput(actualRow){
		let squares = actualRow.querySelectorAll('.square')
		squares = [...squares]

		let userInput = []

		squares.forEach(element => {
			element.addEventListener('input', event=>{
				//Si no se ha borrado
				if (event.inputType !== 'deleteContentBackward'){

					//Recoger el ingreso del usuario
					userInput.push(event.target.value.toUpperCase())


					if(event.target.nextElementSibling){
						event.target.nextElementSibling.focus();
					} else {

						//Crear el arreglo con las letras

						let squaresFilled = document.querySelectorAll('.square')
						squaresFilled = [...squaresFilled]

						let lastFiveSquaresFilled = squaresFilled.slice(-word.length);
						let finalUserInput = []
						lastFiveSquaresFilled.forEach(element => {
							finalUserInput.push(element.value.toUpperCase())
						});


						//Cambiar estilos si existe la letra pero no esta en la posicion correcta
						let existIndexArray = existLetter(wordArray, finalUserInput)			
						existIndexArray.forEach(element =>{
							squares[element].classList.add('gold');
						})

						//Comparar arrays para cambiar estilos
						let rightIndex = compareArrays(wordArray, finalUserInput)
					
						rightIndex.forEach(element => {
							squares[element].classList.add('green')
						})

						//Si los arreglos son iguales
						if(rightIndex.length == wordArray.length){
							showResult(`Ganaste!`)

							return;
						}

						//Crear nueva linea
						let actualRow = createRow()

						if(!actualRow){
							return;
						}

						drawSquares(actualRow)
						listenInput(actualRow)
						addFocus(actualRow)
					};
				} else{
					userInput.pop();
				}

			});
		});
	};


	//functions
	function compareArrays(array1, array2){
		let iqualsIndex = []
		array1.forEach((element, index)=>{
			if (element == array2[index]){
				console.log(`En la posicion ${index} SI son iguales`)
				iqualsIndex.push(index);
			} else{
				console.log(`En la posicion ${index} NO son iguales`)
			}
		});
		return iqualsIndex;
	}


	function existLetter(array1, array2){
		let existIndexArray = []
		array2.forEach((element, index)=>{
			if(array1.includes(element)){
				existIndexArray.push(index)
			}
		});
		return existIndexArray
	}


	function createRow(){
		rowId++
		if (rowId <= 5){
			let newRow = document.createElement('div');
			newRow.classList.add('row');
			newRow.setAttribute('id', rowId);
			mainContainer.appendChild(newRow);
			return newRow;
		} else{
			showResult(`Intentalo de nuevo, la respuesta correcta era "${word.toUpperCase()}"`)
		}
	}

	function drawSquares(actualRow) {
		wordArray.forEach((item, index) =>{
			if(index === 0){
				actualRow.innerHTML += `<input type="text" maxlength="1" class="square focus">`
			} else {
				actualRow.innerHTML += `<input type="text" maxlength="1" class="square">`
			}
		});
	}


	function addFocus(actualRow){
		let focusElement = actualRow.querySelector('.focus')
		focusElement.focus();
	}


	function showResult(textMsg){
		resultElement.innerHTML = `
			<p>${textMsg}</p>
			<button class="button">Reiniciar</button>`

			let resetBtn = document.querySelector('.button')
			resetBtn.addEventListener('click', ()=>{
				location.reload();
			});
	}
})