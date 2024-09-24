let output = document.getElementById("output");
let inv = 0;
let degreeMode = false;
let memory = '0';

// Allowed keys for the calculator (numbers, operators, and symbols)
const allowedKeys = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
    '+', '-', '*', '/', '.', '%', '(', ')', '^', 
    'Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Escape'
];

// Function to handle button clicks
function calc(arg) {
    // Ensure focus remains on the output field
    output.focus();

    if (arg === 'C') {
        output.value = '0'; // Reset to 0 when AC is pressed
    } else {
        // If the current value is "0", clear the input before appending new input
        if (output.value === '0' && arg !== '.' && arg !== '0') {
            output.value = '';
        }
        // Prevents multiple "0" or "." at the beginning
        if (!(output.value === '' && (arg === '0' || arg === '÷' || arg === '×' || arg === '+' || arg === '-'))) {
            output.value += arg;
        }
    }
}

// Function to handle the inverse button
function inverse() {
    let normal = document.getElementsByClassName("normal");
    let inverse = document.getElementsByClassName("inverse");
    let secondarybtn = document.getElementById("secondary");
    if (inv == 0) {
        for (let n of normal) {
            n.style.display = "none";
        }
        for (let i of inverse) {
            i.style.display = "flex";
        }
        inv = 1;
    } else {
        for (let n of normal) {
            n.style.display = "flex";
        }
        for (let i of inverse) {
            i.style.display = "none";
        }
        inv = 0;
    }
    secondarybtn.classList.toggle("active")
}

async function evaluateExpression(expression) {
    console.log("Evaluating expression: " + expression); // Debugging log
    try {
        let response = await fetch('http://localhost:3000/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                expression: expression,
                degreeMode: degreeMode,
                inv: inv
            })
        });

        console.log("Fetch response status: " + response.status); // Log response status
        if (!response.ok) {
            throw new Error("Server response not OK");
        }

        let data = await response.json();
        console.log("Fetch data received: ", data); // Log response data
        if (data.error) {
            return 'Error';
        } else {
            return data.result;
        }
    } catch (error) {
        console.error('Error:', error.message); // Detailed error logging
        alert("An error occurred: " + error.message); // Alert user about the error
        return 'Error';
    }
}


// Function to toggle between degree and radian mode
function toggleDegreeRadian() {
    let degreebtn = document.getElementById("degree-btn");
    let radianbtn = document.getElementById("radian-btn");
    if (degreeMode) {
        degreebtn.style.display = "flex";
        radianbtn.style.display = "none";
        degreeMode = false;
    } else {
        degreebtn.style.display = "none";
        radianbtn.style.display = "flex";
        degreeMode = true;
    }
}

async function handleMemory(arg) {
    if(arg == 'm+'){
        memory+=('+' + (await evaluateExpression(output.value)))
        console.log(arg)
    }
    else if(arg == 'm-'){
        memory+=('-' + (await evaluateExpression(output.value)))
    }
    else if(arg == 'mr'){
        if(output.value == '0'){
            output.value = (await evaluateExpression(memory));
        }
    }
    else{
        memory = '0';
    }
    output.focus();
}

async function giveOutput(){
    output.value = await evaluateExpression(output.value)
    output.focus(); // Maintain focus after evaluation
}

// Set focus on the output field when the page loads
window.onload = function() {
    document.getElementById("output").focus();

    // Clear the initial "0" when user starts typing (for keyboard inputs)
    output.addEventListener('keydown', function(event) {
        console.log("Key pressed: " + event.key); // Debugging log

        // Prevent input of invalid characters, but allow "Enter" for evaluation
        if (!allowedKeys.includes(event.key) && event.key !== 'Enter') {
            event.preventDefault();
            return;
        }

        // Clear "0" when valid keys are pressed
        if (output.value === '0' && event.key.match(/[0-9.]/)) {
            output.value = '';
        }

        // Handle "Enter" key as "equal" button
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent newline in input
            console.log("Enter key detected, calling evaluateExpression"); // Debugging log
            giveOutput(); // Perform calculation
        }
    });

    // Clear the initial "0" when user starts typing (for button clicks)
    output.addEventListener('input', function() {
        if (output.value === '0') {
            output.value = ''; // Clear the "0" once user starts typing
        }

        // If the field becomes empty due to backspace or delete, reset to "0"
        if (output.value === '') {
            output.value = '0';
        }
    });
};