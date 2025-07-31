function checkStringLength(str, maxLength) {
  return str.length <= maxLength;
}

function isPalindrome(str) {
  const cleanedStr = str.replace(/\s/g, '').toLowerCase();
  return cleanedStr === cleanedStr.split('').reverse().join('');
}

checkStringLength('проверяемая строка', 20);
checkStringLength('проверяемая строка', 18);
checkStringLength('проверяемая строка', 10);

isPalindrome('топот');
isPalindrome('ДовОд');
isPalindrome('Кекс');
isPalindrome('Лёша на полке клопа нашёл ');
