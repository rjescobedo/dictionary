const wrongWordList = [
    "Spell check just called. It's offended", 
    "Oops! That's not a word...yet. Wanna make it one?", 
    "Looks like you invented a new language. Congrats!",
    "That's not in the dictionary...maybe try Google Translate?",
    "Are you sure you didn't just sneeze on your keyboard?",
    "404: Word Not Found. Did you mean 'keyboard smash'?",
    "Close, but no cigar. Double-check your spelling, champ!",
    "Hmm, this word is still loading...forever."];

//Error Handling Function
function displayErrorMessage(word) {
    return (!Array.isArray(word) || word.length === 0);
}

//Dicitonary Display
function displayDictionary(word) {
    //Container for the definition
    const definitionContainer = document.getElementById('definition-container');
    definitionContainer.innerHTML = ''
    definitionContainer.style.display = 'block';

    // Display error if word doesn't exist or mispelled
    const error = document.createElement('h3');
    error.classList.add('error');
    if (displayErrorMessage(word)) {
        console.error('Invalid word');
        const randomIndex = Math.floor(Math.random() * wrongWordList.length);
        error.textContent = wrongWordList[randomIndex];
        definitionContainer.append(error);
        return;
    }

    // Display the word and phonetic
    const wordTitle = document.createElement('h2');
    word.forEach(word => {

        if (word.phonetic === undefined) {
            wordTitle.textContent = `${word.word}`;
        } else {
            wordTitle.innerHTML = `${word.word}<em> (${word.phonetic})</em>`;
        }
        definitionContainer.append(wordTitle);
    });

    // Display the audio source
    const audioElement = document.createElement('audio');
    word.forEach(word => {
        const phonetics = word.phonetics;

        for(const phonetic of phonetics){
            
            if (phonetic.audio === '') {
                audioElement.style.display = 'none';
            } else {
                audioElement.type = 'audio/mpeg';
                audioElement.controls = true;
                audioElement.src = phonetic.audio;
                audioElement.style.display = 'block';

                definitionContainer.append(audioElement);
                break;
            }
        }


    });

    // Display the Part of Speech & Definition of Word
    const definitionUl = document.createElement('ul');
    word.forEach(word => {
        const meanings = word.meanings;
        
        meanings.forEach(meaning => {
            const partOfSpeech = meaning.partOfSpeech;
            
            const maxDefinitions = 3;
            meaning.definitions.slice(0, maxDefinitions).forEach(definition => {
                const definitionLi = document.createElement('li');
                definitionLi.innerHTML = `<strong><em>${partOfSpeech}.</em></strong> ${definition.definition}`;
                definitionUl.append(definitionLi);
            })
        }) 
        definitionContainer.append(definitionUl);
    });
}

// Fethcing Dictionary API
async function fetchWord(word) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const dictionaryData = await response.json();
    try {
        console.log(dictionaryData);
        displayDictionary(dictionaryData)

    } 
    catch (error) {
        console.error('Error:', error)
    }
}

//Form Handling
const dictionaryForm = document.getElementById('dictionary-form');
dictionaryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const wordInput = document.getElementById('word-input');
    const inputValue = wordInput.value;
    console.log(inputValue);

    fetchWord(inputValue);
    wordInput.value = ''
})