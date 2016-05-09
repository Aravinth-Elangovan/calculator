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
var historyDisplay = document.getElementById("historyDisplay");
var mainDisplay = document.getElementById("mainDisplay");
// CONSTANTS
var KEY_CODE_BACKSPACE = 8;
var KEY_CODE_ASTERISK = 42;
var KEY_CODE_PLUS = 43;
var KEY_CODE_COMMA = 44;
var KEY_CODE_MINUS = 45;
var KEY_CODE_DELETE = 46;
var KEY_CODE_SLASH = 47;
var KEY_CODE_ZERO = 48;
var KEY_CODE_NINE = 57;
var KEY_CODE_EQUAL = 61;
var KEY_CODE_N = 78;
var KEY_CODE_P = 80;

/*
 * checkDelKey() function checks whether Delete or Backspace key is pressed
 */
function countDelKey(event) {
    if (event.keyCode === KEY_CODE_BACKSPACE || event.keyCode === KEY_CODE_DELETE) {
        isDeletePressed = true;
        isEqualPressed = false;
    }
}

/*
 * checkChar() function restricts the textbox to display numbers and operators
 */
function blockChar(event) {
    if ((event.keyCode >= KEY_CODE_ASTERISK) && (event.keyCode <= KEY_CODE_NINE) && (event.keyCode !== KEY_CODE_COMMA)) {
        // allows only numbers and +,-,*,/ symbols to display
        event.returnValue = true;
        addValueByKey(event.keyCode);
    } else if (event.keyCode === KEY_CODE_EQUAL) {
        // restricts '=' sign to show in display
        event.returnValue = false;
        return result(isDeletePressed);
    } else {
        // restricts all other keys
        event.returnValue = false;
    }
}

/*
 * addValue() function Add values to the display of the Calculator 
 */
function addValue(buttonValue) {
    addValueToDisplay(buttonValue);
    // buttonValue is a number isNaN() returns false
    if (isNaN(buttonValue) === false) {
        var tempButtonValue = buttonValue % 10;
        addDigits(tempButtonValue);
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
 * addValueToDisplay() adds value to the history display each time from main display
 */
function addValueToDisplay(buttonValue) {
    if ((isNaN(buttonValue) === true) && isEqualPressed === false) {
        historyDisplay.value += mainDisplay.value;
    } else if (digitLength === 0) {
        historyDisplay.value += arraySymbol[symArrayIndex];
        symArrayIndex++;
    }
}

/*
 * delValue() deletes a digit from the display
 */
function delValue() {
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
 * clearValue() function deletes all the values in the display
 */
function clearValue() {
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
 *  addDigits() function adds a add digits as Values to the arrayNum[]
 */
function addDigits(buttonValue) {
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
 * result() function calculates the result based on the inputs
 */
function result(resultDelButton) {
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
 * prevNxtValue() function is to check values entered by the user for Re-checking
 */
function prevNxtValue(value) {
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
        case KEY_CODE_N:
            // 'n' key pressed
            prevNxtValue(1);
            break;
        case KEY_CODE_P:
            // 'p' key pressed
            prevNxtValue(-1);
            break;
    }
}

/*
 * addValueByKey() Add values to the display when keyboard key is pressed
 */
function addValueByKey(keyValue) {
    if (keyValue === KEY_CODE_ASTERISK || keyValue === KEY_CODE_PLUS || keyValue === KEY_CODE_MINUS || keyValue === KEY_CODE_SLASH) {
        numArrayIndex++;
        isOperatorPressed = true;
        symArrayIndex++;
        // inserting symbols into the array based on ASCII values
        switch (keyValue) {
            case KEY_CODE_ASTERISK:
                // '*' key pressed
                arraySymbol[symArrayIndex] = '*';
                break;
            case KEY_CODE_PLUS:
                // '+' key pressed
                arraySymbol[symArrayIndex] = '+';
                break;
            case KEY_CODE_MINUS:
                // '-' key pressed
                arraySymbol[symArrayIndex] = '-';
                break;
            case KEY_CODE_MINUS:
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
        var buttonValue = keyValue - KEY_CODE_ZERO;
        addDigits(buttonValue);
    }
    keyboardKeyPressed = 1;
}