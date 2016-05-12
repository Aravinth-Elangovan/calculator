/* 
    Created on : Mar 26, 2016, 10:22:07 AM
    Author     : Aravinth Elangovan
*/
var arrayNumber = [];
var arraySymbol = [];
var digitLength = 1;
var numArrayIndex = 0;
var symArrayIndex = 0;
var actualValue = 0;
var operatorCount = 0;
var currentIndexLocation = 0;
var isOperatorPressed = true;
var isDeletePressed = false;
var isEqualPressed = false;
// CONSTANTS
var ASCII_VALUE_BACKSPACE = 8;
var ASCII_VALUE_ASTERISK = 42;
var ASCII_VALUE_PLUS = 43;
var ASCII_VALUE_COMMA = 44;
var ASCII_VALUE_MINUS = 45;
var ASCII_VALUE_DELETE = 46;
var ASCII_VALUE_SLASH = 47;
var ASCII_VALUE_ZERO = 48;
var ASCII_VALUE_NINE = 57;
var ASCII_VALUE_EQUAL = 61;
var ASCII_VALUE_N = 78;
var ASCII_VALUE_P = 80;

/*
 * monitorBackspaceDeleteKeys() function checks whether Delete or Backspace key is pressed
 */
function monitorBackspaceDeleteKeys(event) {
    if (event.keyCode === ASCII_VALUE_BACKSPACE || event.keyCode === ASCII_VALUE_DELETE) {
        isDeletePressed = true;
        isEqualPressed = false;
    }
}

/*
 * restrictsCharacter() function restricts the textbox to display numbers and operators
 */
function restrictsCharacter(event) {
    if ((event.keyCode >= ASCII_VALUE_ASTERISK) && (event.keyCode <= ASCII_VALUE_NINE) && (event.keyCode !== ASCII_VALUE_COMMA)) {
        // allows only numbers and +,-,*,/ symbols to display
        if(operatorCount < 1 || event.keyCode >= ASCII_VALUE_ZERO && event.keyCode <= ASCII_VALUE_NINE ) {
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }
        showValueInMainDisplayByKey(event.keyCode);
    } else if (event.keyCode === ASCII_VALUE_EQUAL) {
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
        operatorCount = 0;
        var tempButtonValue = buttonValue % 10;
        addDigitsToNumberArray(tempButtonValue);
    } else if (digitLength !== 0 && isOperatorPressed === false) {
        // buttonValue is a Symbol, this block is executed
        isOperatorPressed = true;
        digitLength = 0;
        isEqualPressed = false;
        operatorCount++;
        numArrayIndex++;
        arraySymbol[symArrayIndex] = buttonValue;
        //history1.value += arraySymbol[symArrayIndex];
    } else {
        operatorCount++;
    }

    //checking the number is single digit or not
    if (digitLength !== 2 && operatorCount < 2) {
        mainDisplay.value = buttonValue;
    } else if(operatorCount < 1) {
        mainDisplay.value = actualValue;
    }
}

/*
 * showValueInHistoryDisplay() adds value to the history display each time from main display
 */
function showValueInHistoryDisplay(buttonValue) {
    var historyDisplay = document.getElementById("historyDisplay");
    var mainDisplay = document.getElementById("mainDisplay");
    if ((isNaN(buttonValue) === true) && isEqualPressed === false && operatorCount < 2) {
        historyDisplay.value += mainDisplay.value;
    } else if (digitLength === 0 && operatorCount < 2) {
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
            if(iLoop !== arrayNumber.length - 1 ) {
                tempDispValue += arraySymbol[iLoop];
            } else if(iLoop === 2) {
                tempDispValue += arraySymbol[iLoop];
            }
                
            /*adding symbols to the display
            if (iLoop < arraySymbol.length && keyboardKeyPressed === 0 || iLoop < arraySymbol.length - 1 && keyboardKeyPressed === 1) {
                tempDispValue += arraySymbol[iLoop + keyboardKeyPressed];
            }*/
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
        if(tempValue === '') {
            mainDisplay.value = '';
        }
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
        case ASCII_VALUE_N:
            //n key pressed
            traverseValue(1);
            break;
        case ASCII_VALUE_P:
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
    if ((keyValue === ASCII_VALUE_ASTERISK || keyValue === ASCII_VALUE_PLUS || keyValue === ASCII_VALUE_MINUS || keyValue === ASCII_VALUE_SLASH) && isOperatorPressed === false) {
        numArrayIndex++;
        isOperatorPressed = true;
        // inserting symbols into the array based on ASCII values
        switch (keyValue) {
            case ASCII_VALUE_ASTERISK:
                // '*' key pressed
                arraySymbol[symArrayIndex] = '*';
                break;
            case ASCII_VALUE_PLUS:
                // '+' key pressed
                arraySymbol[symArrayIndex] = '+';
                break;
            case ASCII_VALUE_MINUS:
                // '-' key pressed
                arraySymbol[symArrayIndex] = '-';
                break;
            case ASCII_VALUE_SLASH:
                // '/' key pressed
                arraySymbol[symArrayIndex] = '/';
                break;
        }
        //history1.value += arraySymbol[symArrayIndex];
        symArrayIndex++;
        operatorCount++;
        if (isEqualPressed === true) {
            mainDisplay.value = '';
            isEqualPressed = false;
        }
    } else if(keyValue >= ASCII_VALUE_ZERO && keyValue <= ASCII_VALUE_NINE ){
        // inserting numbers into the number array
        var buttonValue = keyValue - ASCII_VALUE_ZERO;
        operatorCount = 0;
        addDigitsToNumberArray(buttonValue);
    }
}