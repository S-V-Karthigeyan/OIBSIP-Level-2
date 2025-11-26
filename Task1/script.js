const exprEl = document.getElementById('expr');
const outEl = document.getElementById('out');
let expression = '';
let lastAns = '0';

const isOperator = ch => ['+', '-', '*', '/'].includes(ch);
const lastChar = () => expression.slice(-1);

function render() {
  exprEl.textContent = expression || '0';
  outEl.textContent = preview(expression) || '0';
}

function safeEval(src) {
  if (!src) return '0';
  let s = src.replace(/×/g, '*').replace(/÷/g, '/').replace(/ans/g, String(lastAns));
  s = s.replace(/\s+/g, '');
  if (!/^[0-9+\-*/().%]+$/.test(s)) throw new Error('Invalid characters');
  if (/[\+\-\*\/\.%]$/.test(s)) throw new Error('Trailing operator');
  s = s.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
  return String(Function(`return (${s})`)());
}

function preview(src) {
  try { return safeEval(src); } catch { return ''; }
}

function add(token) {
  if (['+', '*', '/'].includes(token) && expression === '') return;
  if (isOperator(token) && isOperator(lastChar())) {
    expression = expression.slice(0, -1) + token;
    render();
    return;
  }
  expression += token;
  render();
}

function doAction(action, value) {
  switch (action) {
    case 'clear':
      expression = '';
      break;
    case 'del':
      expression = expression.slice(0, -1);
      break;
    case 'ans':
      expression += 'ans';
      break;
    case 'enter':
      try {
        const res = safeEval(expression);
        lastAns = res;
        expression = String(res);
      } catch (e) {
        expression = 'ERR';
        render();
        setTimeout(() => { expression = ''; render(); }, 800);
        return;
      }
      break;
    case 'percent':
      expression = expression.replace(/(\d+(?:\.\d+)?)$/, m => m + '%');
      break;
    case 'sqrt':
      try {
        const v = Number(safeEval(expression));
        if (Number.isNaN(v)) throw new Error('Bad value');
        expression = String(Math.sqrt(v));
      } catch {
        expression = 'ERR';
        render();
        setTimeout(() => { expression = ''; render(); }, 800);
        return;
      }
      break;
    case 'op':
      add(value);
      break;
    case 'paren':
      add(value);
      break;
    case 'plus':
      add('+');
      break;
    case 'minus':
      add('-');
      break;
    default:
      break;
  }
  render();
}
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const value = btn.dataset.value;
  if (action) doAction(action, value);
  else if (typeof value !== 'undefined') add(value);
});
window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') add(e.key);
  else if (e.key === '.') add('.');
  else if (e.key === 'Backspace') doAction('del');
  else if (e.key === 'Enter' || e.key === '=') doAction('enter');
  else if (['+','-','*','/','(',')'].includes(e.key)) add(e.key);
  else if (e.key === '%') doAction('percent');
});
render();