$(function () {
  /* Html Temp */
  const lettersWrap = $(".beforelast-wrod .beforelast-wrod-content");
  const arabicLetters = [
    "أ",
    "ب",
    "ت",
    "ث",
    "ج",
    "ح",
    "خ",
    "د",
    "ذ",
    "ر",
    "ز",
    "س",
    "ش",
    "ص",
    "ض",
    "ط",
    "ظ",
    "ع",
    "غ",
    "ف",
    "ق",
    "ك",
    "ل",
    "م",
    "ن",
    "ه",
    "و",
    "ی",
    "ة",
    "ء",
  ];

  //
  arabicLetters.forEach(function (letter) {
    lettersWrap.append(`<span class="letter-badge badge">${letter}</span>`);
  });
});
