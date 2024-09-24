const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static frontend files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle calculator operations
app.post('/calculate', (req, res) => {
  let { expression, degreeMode, inv } = req.body;
  try {
    let result = evaluate(expression, degreeMode, inv);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: 'Invalid expression' });
  }
});

// Function to evaluate the expression
function evaluate(equation, degreeMode, inv) {
  equation = equation.replaceAll("÷", "/");
  equation = equation.replaceAll("×", "*");
  equation = equation.replaceAll("^", "**");
  equation = equation.replaceAll("e", "Math.E");
  equation = equation.replaceAll("log", "Math.log10");
  equation = equation.replaceAll("ln", "Math.log");
  if (degreeMode) {
    if (inv == 0) {
      equation = equation.replaceAll("sin(", "Math.sin(Math.PI/180*");
      equation = equation.replaceAll("cos(", "Math.cos(Math.PI/180*");
      equation = equation.replaceAll("tan(", "Math.tan(Math.PI/180*");
    } else {
      equation = equation.replaceAll("asin(", "Math.asin(Math.PI/180*");
      equation = equation.replaceAll("acos(", "Math.acos(Math.PI/180*");
      equation = equation.replaceAll("atan(", "Math.atan(Math.PI/180*");
    }
  } else {
    if (inv == 0) {
      equation = equation.replaceAll("sin", "Math.sin");
      equation = equation.replaceAll("cos", "Math.cos");
      equation = equation.replaceAll("tan", "Math.tan");
    } else {
      equation = equation.replaceAll("asin", "Math.asin");
      equation = equation.replaceAll("acos", "Math.acos");
      equation = equation.replaceAll("atan", "Math.atan");
    }
  }
  equation = equation.replaceAll("π", "Math.PI");
  equation = equation.replaceAll("Rand", "Math.random()");
  equation = equation.replace(/(\d+)!/g, (match, number) => factorial(Number(number)));
  try {
    return eval(equation);
  } catch (e) {
    return "Error";
  }
}

function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1); // Recursive factorial calculation
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
