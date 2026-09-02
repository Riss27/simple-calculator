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

// Parser manual (tanpa eval / Function) untuk ekspresi + - * / ( )
function parseExpression(expr) {
  let i = 0;

  const skipSpace = () => {
    while (i < expr.length && /\s/.test(expr[i])) i++;
  };

  const expectEnd = () => {
    skipSpace();
    if (i !== expr.length) throw new Error('Invalid');
  };

  const parseNumber = () => {
    skipSpace();
    const start = i;
    while (i < expr.length && /[0-9.]/.test(expr[i])) i++;
    if (start === i) throw new Error('Invalid');
    const num = Number(expr.slice(start, i));
    if (Number.isNaN(num)) throw new Error('Invalid');
    return num;
  };

  const parseFactor = () => {
    skipSpace();
    const ch = expr[i];
    if (ch === '(') {
      i++;
      const val = parseAddSub();
      skipSpace();
      if (expr[i] !== ')') throw new Error('Invalid');
      i++;
      return val;
    }
    if (ch === '-') {
      i++;
      return -parseFactor();
    }
    return parseNumber();
  };

  const parseMulDiv = () => {
    let val = parseFactor();
    for (;;) {
      skipSpace();
      const ch = expr[i];
      if (ch === '*') {
        i++;
        val *= parseFactor();
      } else if (ch === '/') {
        i++;
        const divisor = parseFactor();
        if (divisor === 0) throw new Error('Div by zero');
        val /= divisor;
      } else {
        break;
      }
    }
    return val;
  };

  const parseAddSub = () => {
    let val = parseMulDiv();
    for (;;) {
      skipSpace();
      const ch = expr[i];
      if (ch === '+') {
        i++;
        val += parseMulDiv();
      } else if (ch === '-') {
        i++;
        val -= parseMulDiv();
      } else {
        break;
      }
    }
    return val;
  };

  skipSpace();
  if (i >= expr.length) throw new Error('Empty');
  const result = parseAddSub();
  expectEnd();
  return result;
}

function calculate() {
  const expression = display.value;
  if (!expression.trim()) return;

  // Cek ekspresi valid (tidak diakhiri operator)
  if (/[\+\-\*\/]$/.test(expression)) {
    display.value = 'Error';
    return;
  }

  try {
    const result = parseExpression(expression);
    display.value = Number.isInteger(result)
      ? String(result)
      : String(Math.round(result * 1e10) / 1e10);
  } catch (err) {
    display.value = 'Error';
  }
}