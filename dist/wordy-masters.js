var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.info-bar');
const ANSWER_LENGTH = 5;
const ROUNDS = 6;
const VALID_INPUT = /^[a-zA-Z]$/;
console.log(letters);
function init() {
    let currentGuess = '';
    let currentRow = 0;
    let wordParts = [];
    let done = false;
    let word = '';
    let isLoading = true;
    const setLoading = (isLoading) => {
        loadingDiv === null || loadingDiv === void 0 ? void 0 : loadingDiv.classList.toggle('hidden', !isLoading);
    };
    const isLetter = (letter) => {
        return VALID_INPUT.test(letter) ? 'Match' : 'No Match';
    };
    function getWordOfTheDay() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('https://words.dev-apis.com/word-of-the-day/?random=1');
            const data = yield response.json();
            setLoading(false);
            isLoading = false;
            word = data.word.toUpperCase();
            wordParts = data.word.toUpperCase().split('');
            console.log('wordParts', wordParts);
            return data;
        });
    }
    getWordOfTheDay();
    const addLetter = (letter) => {
        if (currentGuess.length < ANSWER_LENGTH) {
            // Add letter to the end of the current guess
            currentGuess += letter;
        }
        else {
            // Replace the last letter of the current guess with the new letter when the guess is ful
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }
        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].textContent =
            letter;
    };
    function validateWord() {
        return __awaiter(this, void 0, void 0, function* () {
            isLoading = true;
            setLoading(true);
            const response = yield fetch('https://words.dev-apis.com/validate-word', {
                method: 'POST',
                body: JSON.stringify({ word: currentGuess })
            });
            const responseObject = yield response.json();
            const validWord = responseObject.validWord;
            isLoading = false;
            setLoading(false);
            if (!validWord) {
                markInvalidWord();
            }
            return responseObject;
        });
    }
    const commitWord = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (currentGuess.length !== ANSWER_LENGTH) {
            // do nothing
            return;
        }
        const proceed = yield validateWord();
        if (!proceed.validWord) {
            return;
        }
        const guessParts = currentGuess.split('');
        const map = makeMap(wordParts);
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            // mark as correct
            if (guessParts[i] === wordParts[i]) {
                letters[ANSWER_LENGTH * currentRow + i].classList.add('correct');
                map[guessParts[i]]--;
            }
        }
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
            }
            else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
                letters[ANSWER_LENGTH * currentRow + i].classList.add('close');
            }
            else {
                letters[ANSWER_LENGTH * currentRow + i].classList.add('wrong');
            }
        }
        currentRow++;
        if (currentGuess === word) {
            done = true;
            (_a = document.querySelector('.brand')) === null || _a === void 0 ? void 0 : _a.classList.add('winner');
            return;
        }
        else if (currentRow === ROUNDS) {
            alert(`You lose! The word was ${word}`);
            done = true;
        }
        currentGuess = '';
    });
    const deleteLetter = () => {
        // so even if currentGuess is empty no issues; substring of empty string is still empty string
        // so backspace before not adding any guess will do nothing
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].textContent = '';
    };
    const markInvalidWord = () => {
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            letters[ANSWER_LENGTH * currentRow + i].classList.remove('invalid');
            setTimeout(() => {
                letters[ANSWER_LENGTH * currentRow + i].classList.add('invalid');
            }, 100);
        }
    };
    document.addEventListener('keydown', event => {
        if (done || isLoading) {
            return;
        }
        const action = event.key;
        console.log(action);
        if (action === 'Enter') {
            commitWord();
        }
        else if (action === 'Backspace') {
            deleteLetter();
        }
        else if (isLetter(action)) {
            addLetter(action.toUpperCase());
        }
    });
    const makeMap = (item) => {
        let obj = {};
        for (let i = 0; i < item.length; i++) {
            const element = item[i];
            if (obj[element]) {
                obj[element]++;
            }
            else {
                obj[element] = 1;
            }
        }
        return obj;
    };
}
init();
export {};
