'use strict';

require('bootstrap');

/* const calculate = require('calculator/calculate'); */

const calculator     = document.querySelector('.calculator');
const keys           = calculator.querySelector('.calculator-keys');
const display        = document.querySelector('.calculator-display');
const subDisplay     = document.querySelector('.calculator-subDisplay');
const operators      = document.getElementsByClassName('calculator-operatorKey');
const clearButton    = calculator.querySelector('[data-action=clear]');
var subDisplayFrozen = '';
var extCumulative = ''; 


//Calculate function 

const calculate = (operand1, operator, operand2) => {
    let Value1 = parseFloat(operand1);
    let Value2 = parseFloat(operand2);

    if (operator === 'add') {return Value1 + Value2};
    if (operator === 'subtract') {return Value1 - Value2};
    if (operator === 'multiply') {return Value1 * Value2};
    if (operator === 'divide') {return Value1 / Value2};
};

//extCalculate function 

const extCalculate = (value) => {
    let Value = parseFloat(value);

    if (calculator.dataset.extOperator === 'exponentiation') {return Value * Value};
    if (calculator.dataset.extOperator === 'sqrRoot') {return Math.sqrt(Value)};
    if (calculator.dataset.extOperator === 'log') {return Math.log(Value)};
    if (calculator.dataset.extOperator === 'factorial') {return Value != 1 ? Value * extCalculate(Value - 1) : 1};
};

// Percentage calculation function 

const calculatePercentage = (firstValue, displayedValue) => {
    return +(firstValue / 100 * displayedValue).toFixed(10);
};

// factorial calculation function 

const calculateFactorial =  (value) => (value != 1) ? value * calculateFactorial(value - 1) : 1;


keys.addEventListener ('click', e => {
    if (e.target.matches('button')) {
        const key             = e.target;
        const action          = key.dataset.action;
        const sign            = key.dataset.sign;
        const keyValue        = key.textContent;
        const displayedValue  = display.textContent;
        const previousKeyType = calculator.dataset.previousKeyType;
        const extValue        = calculator.dataset.extValue;
       
        Array.from(operators)
        .forEach(k => k.classList.remove('calculator-operatorKey--isPressed'));

        //This block of code is executed when clicked button with a number

        if (!action) {
            if (displayedValue === '0' || 
                previousKeyType === 'operator' ||
                previousKeyType === 'calculate'
            ) {
                display.textContent = keyValue;
            } else if (previousKeyType === 'percentage') {
                subDisplay.textContent = subDisplayFrozen ;
                display.textContent = keyValue;
            } else {
                display.textContent = displayedValue + keyValue;
            };

            calculator.dataset.previousKeyType = 'number';
        };

        //This block of code is executed when clicked button with an operator

        if (
            action === 'add' ||
            action === 'subtract' ||
            action === 'multiply' ||
            action === 'divide'
        ) {
           
            const firstValue = calculator.dataset.firstValue;
            const secondValue = displayedValue;
            const operator = calculator.dataset.operator;

            if (firstValue && 
                operator &&
                previousKeyType !== 'operator' && 
                previousKeyType !== 'calculate'
            ) {
                const result = calculate(firstValue, operator, secondValue);
                display.textContent = +result.toFixed(10);   

                calculator.dataset.firstValue = result;
            } else {
                calculator.dataset.firstValue = displayedValue;
            }

            subDisplay.textContent += (subDisplay.textContent === '0' || previousKeyType === 'extOperator') 
            ? ' ' + keyValue 
            : ' ' + displayedValue + ' ' + keyValue;

            key.classList.add('calculator-operatorKey--isPressed');
            calculator.dataset.previousKeyType = 'operator';
            calculator.dataset.operator = action;  
        }

        //This block of code is executed when clicked button with a decimal

        if (action === 'decimal') {  
            if (!displayedValue.includes('.') && previousKeyType === 'number') {
                display.textContent = displayedValue + ',';
            } 
            if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
                display.textContent = '0,';
            }

            calculator.dataset.previousKeyType = 'decimal';
        }

        if (action !== 'clear') {
            clearButton.textContent = 'CE'
        }
        
        //This block of code is executed when clicked clear button

        if (action === 'clear') {
            if(key.textContent === 'AC') {
                calculator.dataset.firstValue = ''
                calculator.dataset.carriedSecondValue = ''
                calculator.dataset.operator = ''
                calculator.dataset.previousKeyType = ''
                subDisplay.textContent = '';
            }
            display.textContent = '0';
            key.textContent = 'AC'
            calculator.dataset.previousKeyType = 'clear';
        }
         
        //This block of code is executed when clicked equal button

        if (action === 'calculate') {
            var firstValue = calculator.dataset.firstValue;
            const operator = calculator.dataset.operator;
            var secondValue = displayedValue;

            if (firstValue) {
                if (previousKeyType === 'calculate') {
                    firstValue = displayedValue;
                    secondValue = calculator.dataset.carriedSecondValue;
                }

                display.textContent = +calculate(firstValue, operator, secondValue).toFixed(10);
            };
            calculator.dataset.carriedSecondValue = secondValue;
            subDisplay.textContent = '';                                      
            calculator.dataset.previousKeyType = 'calculate';
        }

        //This block of code is executed when clicked percentage button

        if (action === 'percentage') {  
            const firstValue = calculator.dataset.firstValue;
            const operator = calculator.dataset.operator;
            const secondValue = calculatePercentage(firstValue, displayedValue);
            
            if(previousKeyType === 'operator' || previousKeyType === 'number') {
                subDisplayFrozen = subDisplay.textContent;
                display.textContent = secondValue;
                subDisplay.textContent += ' ' + secondValue;
            } else if (previousKeyType === 'percentage') {
                display.textContent = secondValue;
                subDisplay.textContent = subDisplayFrozen + ' ' + secondValue;
            } else if (previousKeyType === 'calculate') {
                calculator.dataset.firstValue = displayedValue;
                subDisplay.textContent  = calculatePercentage(displayedValue, displayedValue);
                display.textContent  = calculatePercentage(displayedValue, displayedValue);     
            } else {
                display.textContent = '0';
                subDisplay.textContent = '0';
            }

            calculator.dataset.previousKeyType = 'percentage';    
        }

        if (action === 'exponentiation' ||
            action === 'sqrRoot' ||
            action === 'log' ||
            action === 'factorial'
        ) {
            calculator.dataset.extOperator = action;
                         

            if (previousKeyType !== 'extOperator') {
                calculator.dataset.extValue = displayedValue; 
                subDisplayFrozen = subDisplay.textContent;
                extCumulative = '' + sign + '(' + calculator.dataset.extValue + ')';
                subDisplay.textContent = subDisplayFrozen + extCumulative;
                  
            } else {
                extCumulative = sign + '(' + extCumulative + ')';
                subDisplay.textContent = subDisplayFrozen + extCumulative;
            }    
    
            display.textContent = extCalculate(displayedValue);
            calculator.dataset.previousKeyType = 'extOperator';
        };
        
        /* //This block of code is executed when clicked exponentiation button

        if (action === 'exponentiation') {

            if(previousKeyType !== 'exponentiation') {
                calculator.dataset.exponent = display.textContent;
                subDisplayFrozen = subDisplay.textContent;
            }

            if(previousKeyType === 'exponentiation') {
                calculator.dataset.exponent = 'sqr(' + exponent + ')';
            };

            subDisplay.textContent = subDisplayFrozen + ' ' + 'sqr(' + calculator.dataset.exponent + ')';
            display.textContent = Math.pow(displayedValue, 2);

            calculator.dataset.previousKeyType = 'exponentiation'
        };

         //This block of code is executed when clicked squre root button

        if (action === 'sqrRoot') {

            if(previousKeyType !== 'sqrRoot') {
                calculator.dataset.sqrRoot = display.textContent;
                subDisplayFrozen = subDisplay.textContent;
            }

            if(previousKeyType === 'sqrRoot') {
                calculator.dataset.sqrRoot = keyValue + '(' + sqrRoot + ')';
            };

            subDisplay.textContent = subDisplayFrozen + ' ' + keyValue + '(' + calculator.dataset.sqrRoot + ')';
            display.textContent = Math.sqrt(displayedValue);

            calculator.dataset.previousKeyType = 'sqrRoot'
        };

        if (action === 'factorial') {

            if(previousKeyType !== 'factorial' && previousKeyType !== 'sqrRoot') {
                calculator.dataset.factorial = display.textContent;
                subDisplayFrozen = subDisplay.textContent;
            }

            if(previousKeyType === 'sqrRoot') {calculator.dataset.factorial = 'fact(' + sqrRoot + ')';}

            if(previousKeyType === 'factorial') {
                calculator.dataset.factorial = 'fact(' + factorial + ')';
            };

            subDisplay.textContent = subDisplayFrozen + ' ' + 'fact(' + calculator.dataset.factorial + ')';
            display.textContent = calculateFactorial(displayedValue);

            calculator.dataset.previousKeyType = 'factorial'
        }; */
    }
});

// Theme switch section

var themeSwitcher = document.querySelector('.header-themeSwitcherFrame');
var theme ='day';

themeSwitcher.addEventListener ('click', () => {
    var themeButton = document.querySelector('.header-themeSwitcherButton');
        if (theme === 'day') {
            var themeAnimation = themeButton.animate([
                {transform: 'translateX(0)'},
                {transform: 'translateX(26px)'}
            ],100);

            themeAnimation.addEventListener('finish', () => {
                themeButton.style.transform = 'translateX(26px)';
            });

            document.body.style.setProperty('--calculator-bg-color', '#000000');
            document.body.style.setProperty('--main-text-color', '#ffffff');
            document.body.style.setProperty('background-color', '#737373');
            document.body.style.setProperty('--operatorButton-bg-color', '#e6e6e6');
            document.body.style.setProperty('--equalButton-bg-color', '#ff6600');
            document.body.style.setProperty('--logo-color', '#ffffff');
            document.body.style.setProperty('--themeSwitcher-bg-color', '#ff6600');
            
            theme = 'night'
        } else {
            themeAnimation = themeButton.animate([
                {transform: 'translateX(26px)'},
                {transform: 'translateX(0)'}
            ],100);

            themeAnimation.addEventListener('finish', () => {
                    themeButton.style.transform = 'translateX(0)';
                });

                document.body.style.setProperty('--calculator-bg-color', '#ffffff');
                document.body.style.setProperty('--main-text-color', '#000000');
                document.body.style.setProperty('background-color', '#ffffff');
                document.body.style.setProperty('--operatorButton-bg-color', '#e6f2ff');
                document.body.style.setProperty('--equalButton-bg-color', '#737373');
                document.body.style.setProperty('--logo-color', '#000000');
                document.body.style.setProperty('--themeSwitcher-bg-color', '#737373');
                theme = 'day'    
        }


    
});

// Mode switch section

var modeSwitcher = document.querySelector('.header-modeSwitcherFrame');
var mode ='normal';

modeSwitcher.addEventListener ('click', () => {
    var modeButton = document.querySelector('.header-modeSwitcherButton');
    var calculatorExtendedKeys = document.querySelector('.calculator-extendedKeys');
        if (mode === 'normal') {
            var modeAnimation = modeButton.animate([
                {transform: 'translateX(0)'},
                {transform: 'translateX(26px)'}
            ],100);

            modeAnimation.addEventListener('finish', () => {
                modeButton.style.transform = 'translateX(26px)';
            });

            calculatorExtendedKeys.style.setProperty('display', 'block');
            
            mode = 'engineering'
        } else {
            modeAnimation = modeButton.animate([
                {transform: 'translateX(26px)'},
                {transform: 'translateX(0)'}
            ],100);

            modeAnimation.addEventListener('finish', () => {
                modeButton.style.transform = 'translateX(0)';
            });

            calculatorExtendedKeys.style.setProperty('display', 'none');  

            mode = 'normal'    
        }


    
});