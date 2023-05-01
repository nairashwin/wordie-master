"use strict";
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
const VALID_INPUT = /^[a-zA-Z]$/;
console.log(letters);
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let currentGuess = '';
        let currentRow = 0;
        const isLetter = (letter) => {
            return VALID_INPUT.test(letter) ? 'Match' : 'No Match';
        };
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
        const commitWord = () => __awaiter(this, void 0, void 0, function* () {
            if (currentGuess.length !== ANSWER_LENGTH) {
                // do nothing
                return;
            }
            //TODO validate against the API word
            //TODO do styling for correct or incorrect
            //TODO add win or lose to the scoreboard
            currentRow++;
            currentGuess = '';
        });
        const deleteLetter = () => {
            // so even if currentGuess is empty no issues; substring of empty string is still empty string
            // sp backspace before not adding any guess will do nothing
            currentGuess = currentGuess.substring(0, currentGuess.length - 1);
            console.log('currentGuess', currentGuess);
            letters[ANSWER_LENGTH * currentRow + currentGuess.length].textContent = '';
            console.log(letters[ANSWER_LENGTH * currentRow + currentGuess.length]);
        };
        //   document.addEventListener('keydown', function handleKeyPress(event) {
        document.addEventListener('keydown', event => {
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
            else {
                // do nothing
            }
        });
    });
}
init();
