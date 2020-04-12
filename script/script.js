/* create HTML-document */

const metaCharset = document.createElement('meta');
const metaDevice = document.createElement('meta');
const style = document.createElement('link');
const favicon = document.createElement('link');
const title = document.createElement('title');

metaCharset.setAttribute('charset', 'UTF-8');

metaDevice.setAttribute('name', 'viewport');
metaDevice.setAttribute('content', 'width=device-width, initial-scale=1.0');

style.setAttribute('rel', 'stylesheet');
style.setAttribute('href', 'css/style.css');

favicon.setAttribute('rel', 'icon');
favicon.setAttribute('href', 'favicon.ico');

title.innerText = 'Virtual Keyboard';

document.head.appendChild(metaCharset);
document.head.appendChild(metaDevice);
document.head.appendChild(style);
document.head.appendChild(favicon);
document.head.appendChild(title);

const textarea = document.createElement('textarea');
textarea.setAttribute('autofocus', '');
textarea.setAttribute('rows', '5');

const form = document.createElement('form');
form.appendChild(textarea);

const container = document.createElement('div');
container.classList.add('container');

const intro = document.createElement('div');
intro.classList.add('intro');
intro.innerHTML = `
  <h2>Здравствуйте! Вы находитесь на странице реализации задачи</h2>
  <h1><a href="https://github.com/rolling-scopes-school/tasks/blob/master/tasks/codejam-virtual-keyboard.md">
    "RSS Виртуальная клавиатура"</a></h1>
  <p>Возможны различия в нажатиях на кнопки клавиатуры для разных операционных систем: Windows и Mac OS. 
    Данная реализация выполнена в ОС Windows 10 x64.</p>
  <p>Смена языка ввода осуществляется комбинациями клавиш Shift+Ctrl или Shift+Alt.</p>
  <p>Чтобы зажать клавишу Shift, нажмите ее правой кнопкой мыши. Продолжайте набор правой кнопкой мыши,
    чтобы ввести несколько символов, или левой - чтобы ввести один символ.</p>
`;

/* utils */

const getLanguage = () => {
  let current = 'en';
  if (localStorage.getItem('VirtualKeyboardUserLanguage')) {
    current = localStorage.getItem('VirtualKeyboardUserLanguage');
  } else {
    localStorage.setItem('VirtualKeyboardUserLanguage', current);
  }
  let next = current === 'en' ? 'ru' : 'en';
  const change = () => {
    next = current;
    current = current === 'en' ? 'ru' : 'en';
    localStorage.setItem('VirtualKeyboardUserLanguage', current);
  };
  const getCurrent = () => current;
  const getNext = () => next;

  return {
    getCurrent,
    getNext,
    change,
  };
};

const getDOMContent = (content) => {
  const DOMElement = document.createElement('span');
  if (content.length === 2) {
    const firstChar = document.createElement('span');
    const secondChar = document.createElement('span');
    firstChar.innerHTML = `${content[0]}`;
    secondChar.innerHTML = `${content[1]}`;
    firstChar.classList.add('firstChar');
    secondChar.classList.add('secondChar');
    DOMElement.appendChild(firstChar);
    DOMElement.appendChild(secondChar);
  } else {
    DOMElement.innerText = content;
  }
  return DOMElement;
};

/* constants */

const keys = [
  ['char', true, 'Backquote', '~`', '`', '~', 'Ё', 'ё', 'Ё'],
  ['char', false, 'Digit1', '!1', '1', '!', '!1', '1', '!'],
  ['char', false, 'Digit2', '@2', '2', '@', '"2', '2', '"'],
  ['char', false, 'Digit3', '#3', '3', '#', '№3', '3', '№'],
  ['char', false, 'Digit4', '$4', '4', '$', ';4', '4', ';'],
  ['char', false, 'Digit5', '%5', '5', '%', '%5', '5', '%'],
  ['char', false, 'Digit6', '^6', '6', '^', ':6', '6', ':'],
  ['char', false, 'Digit7', '&7', '7', '&', '?7', '7', '?'],
  ['char', false, 'Digit8', '*8', '8', '*', '*8', '8', '*'],
  ['char', false, 'Digit9', '(9', '9', '(', '(9', '9', '('],
  ['char', false, 'Digit0', ')0', '0', ')', ')0', '0', ')'],
  ['char', false, 'Minus', '_-', '-', '_'],
  ['char', false, 'Equal', '+=', '=', '+'],
  ['action', false, 'Backspace', 'Backspace'],
  ['char', false, 'Tab', 'Tab', '\t'],
  ['char', true, 'KeyQ', 'Q', 'q', 'Q', 'Й', 'й', 'Й'],
  ['char', true, 'KeyW', 'W', 'w', 'W', 'Ц', 'ц', 'Ц'],
  ['char', true, 'KeyE', 'E', 'e', 'E', 'У', 'у', 'У'],
  ['char', true, 'KeyR', 'R', 'r', 'R', 'К', 'к', 'К'],
  ['char', true, 'KeyT', 'T', 't', 'T', 'Е', 'е', 'Е'],
  ['char', true, 'KeyY', 'Y', 'y', 'Y', 'Н', 'н', 'Н'],
  ['char', true, 'KeyU', 'U', 'u', 'U', 'Г', 'г', 'Г'],
  ['char', true, 'KeyI', 'I', 'i', 'I', 'Ш', 'ш', 'Ш'],
  ['char', true, 'KeyO', 'O', 'o', 'O', 'Щ', 'щ', 'Щ'],
  ['char', true, 'KeyP', 'P', 'p', 'P', 'З', 'з', 'З'],
  ['char', true, 'BracketLeft', '{[', '[', '{', 'Х', 'х', 'Х'],
  ['char', true, 'BracketRight', '}]', ']', '}', 'Ъ', 'ъ', 'Ъ'],
  ['char', false, 'Backslash', '|\\', '\\', '|', '/\\', '\\', '/'],
  ['action', false, 'Delete', 'DEL'],
  ['action', false, 'CapsLock', 'Caps Lock'],
  ['char', true, 'KeyA', 'A', 'a', 'A', 'Ф', 'ф', 'Ф'],
  ['char', true, 'KeyS', 'S', 's', 'S', 'Ы', 'ы', 'Ы'],
  ['char', true, 'KeyD', 'D', 'd', 'D', 'В', 'в', 'В'],
  ['char', true, 'KeyF', 'F', 'f', 'F', 'А', 'а', 'А'],
  ['char', true, 'KeyG', 'G', 'g', 'G', 'П', 'п', 'П'],
  ['char', true, 'KeyH', 'H', 'h', 'H', 'Р', 'р', 'Р'],
  ['char', true, 'KeyJ', 'J', 'j', 'J', 'О', 'о', 'О'],
  ['char', true, 'KeyK', 'K', 'k', 'K', 'Л', 'л', 'Л'],
  ['char', true, 'KeyL', 'L', 'l', 'L', 'Д', 'д', 'Д'],
  ['char', true, 'Semicolon', ':;', ';', ':', 'Ж', 'ж', 'Ж'],
  ['char', true, 'Quote', '"\'', '\'', '"', 'Э', 'э', 'Э'],
  ['char', false, 'Enter', 'ENTER', '\r'],
  ['action', false, 'ShiftLeft', 'Shift'],
  ['char', true, 'KeyZ', 'Z', 'z', 'Z', 'Я', 'я', 'Я'],
  ['char', true, 'KeyX', 'X', 'x', 'X', 'Ч', 'ч', 'Ч'],
  ['char', true, 'KeyC', 'C', 'c', 'C', 'С', 'с', 'C'],
  ['char', true, 'KeyV', 'V', 'v', 'V', 'М', 'м', 'М'],
  ['char', true, 'KeyB', 'B', 'b', 'B', 'И', 'и', 'И'],
  ['char', true, 'KeyN', 'N', 'n', 'N', 'Т', 'т', 'Т'],
  ['char', true, 'KeyM', 'M', 'm', 'M', 'Ь', 'ь', 'Ь'],
  ['char', true, 'Comma', '<,', ',', '<', 'Б', 'б', 'Б'],
  ['char', true, 'Period', '>.', '.', '>', 'Ю', 'ю', 'Ю'],
  ['char', true, 'Slash', '?/', '/', '?', ',.', '.', ','],
  ['action', false, 'ArrowUp', '\u2191'],
  ['action', false, 'ShiftRight', 'Shift'],
  ['action', false, 'ControlLeft', 'Ctrl'],
  ['action', false, 'MetaLeft', 'Win'],
  ['action', false, 'AltLeft', 'Alt'],
  ['char', false, 'Space', '', ' '],
  ['action', false, 'AltRight', 'Alt'],
  ['action', false, 'ControlRight', 'Ctrl'],
  ['action', false, 'ArrowLeft', '\u2190'],
  ['action', false, 'ArrowDown', '\u2193'],
  ['action', false, 'ArrowRight', '\u2192'],
];

const stretchKeys = ['Backspace', 'Tab', 'Delete', 'CapsLock', 'Enter', 'ShiftLeft', 'ShiftRight', 'Space'];

const firstInRow = ['ControlLeft', 'Tab', 'CapsLock', 'ShiftLeft', 'ControlLeft', 'Backquote'];

const language = getLanguage();

/* variables */

let isShiftLeft;
let isShiftRight;
let isCtrlLeft;
let isCtrlRight;
let isAltLeft;
let isAltRight;

let isCapsLock = false;
let inTimeout = false;

const keyboard = {};

let activeKeys = [];
let currentKey;

/* service */

const setNewLanguage = () => {
  if (!inTimeout) {
    Object.keys(keyboard).forEach((i) => {
      keyboard[i].languageToggle();
    });
    language.change();
    inTimeout = true;
    setTimeout(() => { inTimeout = false; }, 100);
  }
};

textarea.insertText = function insertText(text) {
  this.setRangeText(text, textarea.selectionStart, textarea.selectionEnd, 'end');
};

const setUpperCase = () => {
  Object.keys(keyboard).forEach((i) => {
    keyboard[i].nameToUpperCase();
  });
};

const setLowerCase = () => {
  Object.keys(keyboard).forEach((i) => {
    keyboard[i].nameToLowerCase();
  });
};

const keyboardRenderCase = () => {
  if (isShiftLeft || isShiftRight) {
    if (isCapsLock) {
      setLowerCase();
    } else {
      setUpperCase();
    }
  } else if (isCapsLock) {
    setUpperCase();
  } else {
    setLowerCase();
  }
};

const clearActions = () => {
  isShiftLeft = false;
  isShiftRight = false;
  isCtrlLeft = false;
  isCtrlRight = false;
  isAltLeft = false;
  isAltRight = false;
  keyboard.ShiftRight.DOMElement.classList.remove('pressed');
  keyboard.ShiftLeft.DOMElement.classList.remove('pressed');
  keyboard.AltRight.DOMElement.classList.remove('pressed');
  keyboard.AltLeft.DOMElement.classList.remove('pressed');
  keyboard.ControlLeft.DOMElement.classList.remove('pressed');
  keyboard.ControlRight.DOMElement.classList.remove('pressed');
  keyboardRenderCase();
};

/* keyboard functions */

const printChar = (key) => {
  let char = (isShiftLeft || isShiftRight)
    ? keyboard[key].modContent[language.getCurrent()]
    : keyboard[key].content[language.getCurrent()];
  if (isCapsLock) {
    char = (isShiftLeft || isShiftRight)
      ? char.toLowerCase()
      : char.toUpperCase();
  }
  textarea.insertText(char);
};

const deletePrevious = () => {
  if (textarea.selectionStart === textarea.selectionEnd) {
    if (textarea.selectionStart > 0) {
      textarea.setRangeText('', textarea.selectionStart - 1, textarea.selectionEnd, 'end');
    }
  } else {
    textarea.insertText('');
  }
};

const deleteNext = () => {
  if (textarea.selectionStart === textarea.selectionEnd) {
    if (textarea.selectionStart < textarea.value.length) {
      textarea.setRangeText('', textarea.selectionStart, textarea.selectionEnd + 1, 'end');
    }
  } else {
    textarea.insertText('');
  }
};

const moveHorizontal = (delta) => {
  let newPosition = textarea.selectionEnd + delta;
  if (newPosition < 0) newPosition = 0;
  if (newPosition > textarea.value.length) newPosition = textarea.value.length;
  textarea.setSelectionRange(newPosition, newPosition);
};

const moveVertical = (delta) => {
  const currentPosition = textarea.selectionEnd;
  let previousStringLength = 0;
  let nextStringLength = 0;
  let currentStringLength = 0;
  let srtLength = 1;
  let strPosition = currentPosition;
  let step = 0;
  let i = 0;

  while (i <= textarea.value.length && step < 2) {
    if (i === currentPosition) {
      strPosition = srtLength;
    }

    if (srtLength > 105 || textarea.value.charCodeAt(i) === 10 || i === textarea.value.length) {
      if (i < currentPosition) {
        previousStringLength = srtLength;
      } else if (step === 0) {
        currentStringLength = srtLength;
        step = 1;
      } else {
        nextStringLength = srtLength;
        step = 2;
      }
      srtLength = 0;
    }

    srtLength += 1;
    i += 1;
  }

  let newPosition;
  if (delta < 0) {
    newPosition = strPosition < previousStringLength
      ? textarea.selectionEnd - previousStringLength
      : textarea.selectionEnd - strPosition;
  } else {
    newPosition = strPosition > nextStringLength
      ? textarea.selectionEnd + currentStringLength + nextStringLength - strPosition
      : textarea.selectionEnd + currentStringLength;
  }

  if (newPosition >= 0 && newPosition <= textarea.value.length) {
    textarea.setSelectionRange(newPosition, newPosition);
  }
};

/* dispatchers */

const startAction = (key) => {
  switch (key) {
    case 'ShiftLeft':
      isShiftLeft = true;
      isShiftRight = false;
      keyboard.ShiftRight.DOMElement.classList.remove('pressed');
      keyboardRenderCase();
      break;
    case 'ShiftRight':
      isShiftRight = true;
      isShiftLeft = false;
      keyboard.ShiftLeft.DOMElement.classList.remove('pressed');
      keyboardRenderCase();
      break;
    case 'AltLeft':
      isAltLeft = true;
      isAltRight = false;
      keyboard.AltRight.DOMElement.classList.remove('pressed');
      break;
    case 'AltRight':
      isAltRight = true;
      isAltLeft = false;
      keyboard.AltLeft.DOMElement.classList.remove('pressed');
      break;
    case 'ControlLeft':
      isCtrlLeft = true;
      break;
    case 'ControlRight':
      isCtrlRight = true;
      break;
    case 'Backspace':
      deletePrevious();
      break;
    case 'Delete':
      deleteNext();
      break;
    case 'ArrowLeft':
      moveHorizontal(-1);
      break;
    case 'ArrowRight':
      moveHorizontal(1);
      break;
    case 'ArrowUp':
      moveVertical(-1);
      break;
    case 'ArrowDown':
      moveVertical(1);
      break;
    case 'CapsLock':
      isCapsLock = !isCapsLock;
      keyboard.CapsLock.DOMElement.classList.toggle('caps');
      keyboardRenderCase();
      break;
    default:
  }
};

const stopAction = (key) => {
  switch (key) {
    case 'ShiftLeft':
      if (isShiftLeft) {
        isShiftLeft = false;
      } else {
        isShiftRight = false;
        keyboard.ShiftRight.DOMElement.classList.remove('pressed');
      }
      if (isCtrlLeft || isCtrlRight || isAltLeft || isAltRight) {
        setNewLanguage();
      }
      keyboardRenderCase();
      break;
    case 'ShiftRight':
      if (isShiftRight) {
        isShiftRight = false;
      } else {
        isShiftLeft = false;
        keyboard.ShiftLeft.DOMElement.classList.remove('pressed');
      }
      if (isCtrlLeft || isCtrlRight || isAltLeft || isAltRight) {
        setNewLanguage();
      }
      keyboardRenderCase();
      break;
    case 'AltLeft':
      isAltLeft = false;
      if (isShiftLeft || isShiftRight) {
        setNewLanguage();
      }
      break;
    case 'AltRight':
      isAltRight = false;
      if (isShiftLeft || isShiftRight) {
        setNewLanguage();
      }
      break;
    case 'ControlLeft':
      isCtrlLeft = false;
      if (isShiftLeft || isShiftRight) {
        setNewLanguage();
      }
      break;
    case 'ControlRight':
      isCtrlRight = false;
      if (isShiftLeft || isShiftRight) {
        setNewLanguage();
      }
      break;
    default:
  }
};

/* drivers */

const emulateKeyDown = (code) => {
  if (keyboard[code]) {
    keyboard[code].DOMElement.classList.add('pressed');
    if (keyboard[code].type === 'action') {
      startAction(code);
      return;
    }
    printChar(code);
  }
};

const emulateKeyUp = (code) => {
  if (keyboard[code]) {
    keyboard[code].DOMElement.classList.remove('pressed');
    if (keyboard[code].type === 'action') {
      stopAction(code);
    }
  }
};


const clearKeysStack = () => {
  while (activeKeys.length > 0) {
    emulateKeyUp(activeKeys.pop());
  }
};

const mouseWatch = () => {
  const timeout = setTimeout(() => {
    if (currentKey && currentKey !== activeKeys[activeKeys.length - 1]) {
      emulateKeyUp(activeKeys.pop());
      activeKeys.push(currentKey);
      emulateKeyDown(currentKey);
    }
    const interval = setInterval(() => {
      if (currentKey) {
        emulateKeyUp(activeKeys.pop());
        activeKeys.push(currentKey);
        emulateKeyDown(currentKey);
      }
    }, 60);
    container.addEventListener('mouseup', () => { clearInterval(interval); }, { once: true });
    container.addEventListener('mouseleave', () => { clearInterval(interval); }, { once: true });
  }, 300);
  container.addEventListener('mouseup', () => { clearTimeout(timeout); }, { once: true });
  container.addEventListener('mouseleave', () => { clearTimeout(timeout); }, { once: true });
};

const onMouseUp = (event) => {
  textarea.focus();
  if (event.which === 3
    && (activeKeys[0] === 'ShiftLeft' || activeKeys[0] === 'ShiftRight')
    && activeKeys.length === 1) {
    return;
  }

  if (event.which === 3
    && (activeKeys[0] === 'ShiftLeft' || activeKeys[0] === 'ShiftRight')
    && activeKeys.length === 2) {
    if (activeKeys[1] === 'ShiftLeft' || activeKeys[1] === 'ShiftRight') {
      if (activeKeys[0] === activeKeys[1]) {
        emulateKeyUp(activeKeys.pop());
        activeKeys = [];
      } else {
        activeKeys.shift();
      }
    } else {
      emulateKeyUp(activeKeys.pop());
    }
  } else {
    clearKeysStack();
  }
};

/* class Key */

class Key {
  constructor(
    type,
    isMutable,
    keyCode,
    enName,
    enContent,
    enModContent,
    ruName,
    ruContent,
    ruModContent,
  ) {
    this.type = type;
    this.isMutable = isMutable;
    this.DOMContent = {
      en: getDOMContent(enName),
    };

    if (type === 'char') {
      this.content = {
        en: enContent,
        ru: ruContent || enContent,
      };
      this.modContent = {
        en: enModContent || enContent,
        ru: ruModContent || ruContent || enModContent || enContent,
      };
      this.DOMContent.ru = getDOMContent(ruName || enName);
    }

    this.DOMElement = document.createElement('div');
    this.DOMElement.classList.add('key');
    this.DOMElement.setAttribute('data-keycode', keyCode);
    this.DOMElement
      .appendChild(type === 'char' ? this.DOMContent[language.getCurrent()] : this.DOMContent.en);

    this.nameToLowerCase();

    this.DOMElement.addEventListener('mousedown', (event) => {
      textarea.focus();
      activeKeys.push(keyCode);
      emulateKeyDown(keyCode);
      if (event.which === 1) {
        mouseWatch();
      }
    });

    this.DOMElement.addEventListener('mouseenter', () => {
      currentKey = keyCode;
    });

    this.DOMElement.addEventListener('mouseleave', () => {
      currentKey = false;
    });

    if (stretchKeys.includes(keyCode)) {
      this.DOMElement.classList.add('stretch');
    }
  }

  languageToggle() {
    if (this.type === 'char') {
      this.DOMElement
        .replaceChild(this.DOMContent[language.getNext()], this.DOMContent[language.getCurrent()]);
    }
  }

  nameToUpperCase() {
    if (this.isMutable) {
      this.DOMElement.classList.remove('lowercase');
    }
  }

  nameToLowerCase() {
    if (this.isMutable) {
      this.DOMElement.classList.add('lowercase');
    }
  }
}

/* fill keyboard */

const fillKeyboard = () => {
  let keysRow;
  keys.forEach((i) => {
    keyboard[i[2]] = new Key(...i);
    if (firstInRow.includes(i[2])) {
      keysRow = document.createElement('div');
      keysRow.classList.add('row');
      container.appendChild(keysRow);
    }
    keysRow.appendChild(keyboard[i[2]].DOMElement);
  });
};
fillKeyboard();

/* base */

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(intro);
  document.body.appendChild(form);
  document.body.appendChild(container);

  document.addEventListener('keydown', (event) => {
    event.preventDefault();
    emulateKeyDown(event.code);
  });

  document.addEventListener('keyup', (event) => {
    event.preventDefault();
    clearKeysStack();
    emulateKeyUp(event.code);
  });

  document.addEventListener('mouseup', onMouseUp);

  container.addEventListener('contextmenu', (e) => { e.preventDefault(); });

  window.addEventListener('blur', clearActions);
});
