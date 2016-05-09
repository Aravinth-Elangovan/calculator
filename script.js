/* 
    Created on : Mar 26, 2016, 10:22:07 AM
    Author     : Aravinth Elangovan
*/
var arrayNumber = [];
var arraySymbol = [];
var isOperatorPressed = true;
var digitLength = 1;
var numArrayIndex = 0;
var symArrayIndex = 0;
var actualValue = 0;
var currentIndexLocation = 0;
var isDeletePressed = false;
var isEqualPressed = false;
var keyboardKeyPressed = 0;
// CONSTANTS
var BACKSPACE_ASCII_VALUE = 8;
var ASTERISK_ASCII_VALUE = 42;
var PLUS_ASCII_VALUE = 43;
var COMMA_ASCII_VALUE = 44;
var MINUS_ASCII_VALUE = 45;
var DELETE_ASCII_VALUE = 46;
var SLASH_ASCII_VALUE = 47;
var ZERO_ASCII_VALUE = 48;
var NINE_ASCII_VALUE = 57;
var EQUAL_ASCII_VALUE = 61;
var N_ASCII_VALUE = 78;
var P_ASCII_VALUE = 80;

/*
 * countDeleteKey() function checks whether Delete or Backspace key is pressed
 */
function countDeleteKey(event) {
    if (event.keyCode === BACKSPACE_ASCII_VALUE || event.keyCode === DELETE_ASCII_VALUE) {
        isDeletePressed = true;
        isEqualPressed = false;
    }
}

/*
 * restrictCharacter() function restricts the textbox to display numbers and operators
 */
function restrictCharacter(event) {
    if ((event.keyCode >= ASTERISK_ASCII_VALUE) && (event.keyCode <= NINE_ASCII_VALUE) && (event.keyCode !== COMMA_ASCII_VALUE)) {
        // allows only numbers and +,-,*,/ symbols to display
        event.returnValue = true;
        showValueInMainDisplayByKey(event.keyCode);
    } else if (event.keyCode === EQUAL_ASCII_VALUE) {
        // restricts '=' sign to show in display
        event.returnValue = false;
        return calculateResult(isDeletePressed);
    } else {
        // restricts all other keys
        event.returnValue = false;
    }
}

/*
 * showValueInMainDisplay() function Show values in the Calculator main display 
 */
function showValueInMainDisplay(buttonValue) {
    var mainDisplay = document.getElementById("mainDisplay");
    showValueInHistoryDisplay(buttonValue);
    // buttonValue is a number isNaN() returns false
    if (isNaN(buttonValue) === false) {
        var tempButtonValue = buttonValue % 10;
        addDigitsToNumberArray(tempButtonValue);
    } else if (digitLength !== 0) {
        // buttonValue is a Symbol, this block is executed
        isOperatorPressed = true;
        digitLength = 0;
        isEqualPressed = false;
        numArrayIndex++;
        arraySymbol[symArrayIndex] = buttonValue;
    }

    //checking the number is single digit or not
    if (digitLength !== 2) {
        mainDisplay.value = buttonValue;
    } else {
        mainDisplay.value = actualValue;
    }
}

/*
 * showValueInHistoryDisplay() adds value to the history display each time from main display
 */
function showValueInHistoryDisplay(buttonValue) {
    var historyDisplay = document.getElementById("historyDisplay");
    var mainDisplay = document.getElementById("mainDisplay");
    if ((isNaN(buttonValue) === true) && isEqualPressed === false) {
        historyDisplay.value += mainDisplay.value;
    } else if (digitLength === 0) {
        historyDisplay.value += arraySymbol[symArrayIndex];
        symArrayIndex++;
    }
}

/*
 * removeValue() deletes a digit from the display
 */
function removeValue() {
    var mainDisplay = document.getElementById("mainDisplay");
    var displayValue = mainDisplay.value;
    if (displayValue.length > 0) {
        displayValue = displayValue.substring(0, displayValue.length - 1);
        mainDisplay.value = displayValue;
        arrayNumber[currentIndexLocation] = displayValue;
        isDeletePressed = true;
        isEqualPressed = false;
    }
}

/*
 * clearAllValue() function deletes all the values in the display
 */
function clearAllValue() {
    var historyDisplay = document.getElementById("historyDisplay");
    var mainDisplay = document.getElementById("mainDisplay");
    //resetting all the values
    historyDisplay.value = '';
    mainDisplay.value = '';
    arrayNumber = [''];
    arraySymbol = [''];
    isOperatorPressed = true;
    digitLength = 1;
    numArrayIndex = 0;
    symArrayIndex = 0;
    actualValue = 0;
    currentIndexLocation = 0;
    isDeletePressed = false;
    isEqualPressed = false;
    keyboardKeyPressed = 0;
}
/*
 *  addDigitsToNumberArray() function adds a add digits as Values to the arrayNumber[]
 */
function addDigitsToNumberArray(buttonValue) {
    if (isOperatorPressed === true) {
        //if the number is single digit, this block is executed
        digitLength = 1;
        isOperatorPressed = false;
        if (isDeletePressed === false) {
            arrayNumber[numArrayIndex] = buttonValue;
            currentIndexLocation = numArrayIndex;
        } else {
            arrayNumber[currentIndexLocation] = buttonValue;
        }
    } else {
        //if the number is not a single digit number,this block gets executed
        digitLength = 2;
        if (isDeletePressed === false && currentIndexLocation === numArrayIndex) {
            actualValue = arrayNumber[numArrayIndex];
            actualValue = (actualValue * 10) + buttonValue;
            arrayNumber[numArrayIndex] = actualValue;
        } else {
            actualValue = arrayNumber[currentIndexLocation];
            actualValue = (actualValue * 10) + buttonValue;
            arrayNumber[currentIndexLocation] = actualValue;
        }
    }
}

/*
 * calculateResult() function calculates the result based on the inputs
 */
function calculateResult(resultDelButton) {
    var historyDisplay = document.getElementById("historyDisplay");
    var mainDisplay = document.getElementById("mainDisplay");
    var tempValue = 0;
    if (resultDelButton === true) {
        arrayNumber[currentIndexLocation] = mainDisplay.value;
        var tempDispValue = '';
        // Updating the altered value in the History Display
        for (var iLoop = 0; iLoop < arrayNumber.length; iLoop++) {
            // adding numbers to the display
            tempDispValue += arrayNumber[iLoop];
            //adding symbols to the display
            if (iLoop < arraySymbol.length && keyboardKeyPressed === 0 || iLoop < arraySymbol.length - 1 && keyboardKeyPressed === 1) {
                tempDispValue += arraySymbol[iLoop + keyboardKeyPressed];
            }
        }
        historyDisplay.value = tempDispValue;
    }
    // if equal button is clicked first time it displays the result
    if (isEqualPressed === false) {

        if (resultDelButton === false) {
            historyDisplay.value += mainDisplay.value;
        }
        // Calculates the result based on the values in the display
        tempValue = historyDisplay.value;
        var total = eval(tempValue);
        mainDisplay.value = total;
        isEqualPressed = true;
        isDeletePressed = false;
        currentIndexLocation = arrayNumber.length;
    }
}

/*
 * traverseValue() function is to check values entered by the user for Re-checking
 */
function traverseValue(value) {
    var mainDisplay = document.getElementById("mainDisplay");
    if ((currentIndexLocation !== 0 && value === -1) || (currentIndexLocation < arrayNumber.length - 1 && value === 1)) {
        mainDisplay.value = arrayNumber[currentIndexLocation + value];
        currentIndexLocation = currentIndexLocation + value;
    }
}

/*
 * prevNxtKey() traverses previous and next values using P ans N keys
 */
function prevNxtKey(e) {
    switch (e.keyCode) {
        case N_ASCII_VALUE:
            //n key pressed
            traverseValue(1);
            break;
        case P_ASCII_VALUE:
            //p key pressed
            traverseValue(-1);
            break;
    }
}

/*
 * addValueByKey() Add values to the display when keyboard key is pressed
 */
function showValueInMainDisplayByKey(keyValue) {
    var mainDisplay = document.getElementById("mainDisplay");
    if (keyValue === ASTERISK_ASCII_VALUE || keyValue === PLUS_ASCII_VALUE || keyValue === MINUS_ASCII_VALUE || keyValue === SLASH_ASCII_VALUE) {
        numArrayIndex++;
        isOperatorPressed = true;
        symArrayIndex++;
        // inserting symbols into the array based on ASCII values
        switch (keyValue) {
            case ASTERISK_ASCII_VALUE:
                // '*' key pressed
                arraySymbol[symArrayIndex] = '*';
                break;
            case PLUS_ASCII_VALUE:
                // '+' key pressed
                arraySymbol[symArrayIndex] = '+';
                break;
            case MINUS_ASCII_VALUE:
                // '-' key pressed
                arraySymbol[symArrayIndex] = '-';
                break;
            case MINUS_ASCII_VALUE:
                // '/' key pressed
                arraySymbol[symArrayIndex] = '/';
                break;
        }
        if (isEqualPressed === true) {
            mainDisplay.value = '';
            isEqualPressed = false;
        }
    } else {
        // inserting numbers into the number array
        var buttonValue = keyValue - ZERO_ASCII_VALUE;
        addDigitsToNumberArray(buttonValue);
    }
    keyboardKeyPressed = 1;
}