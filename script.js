const display = document.getElementById('display');

function appendToDisplay(value) {
  const operators = ['+', '-', '*', '/'];
  const lastChar = display.value.slice(-1);

  // Blok duplikasi operator (contoh: ++, --, etc)
  if (operators.includes(value) && operators.includes(lastChar)) {
    return;
  }

  display.value += value;
}

function clearDisplay() {
  display.value = '';
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    const expression = display.value;

    // Cek ekspresi valid (tidak diakhiri operator)
    if (/[\+\-\*\/]$/.test(expression)) {
      display.value = 'Error';
      return;
    }

    const result = Function(`return ${expression}`)();
    display.value = result;
  } catch (err) {
    display.value = 'Error';
  }
}
