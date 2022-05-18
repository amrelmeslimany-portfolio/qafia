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
  const underlineLetters = ["ج", "ح", "خ", "ع", "غ", "م"];

  //
  arabicLetters.forEach(function (letter) {
    if (underlineLetters.includes(letter))
      lettersWrap.append(
        `<span class="letter-badge badge"><span class="underline-letter">${letter}</span></span>`
      );
    else
      lettersWrap.append(
        `<span class="letter-badge badge"><span>${letter}</span></span>`
      );
  });
});
