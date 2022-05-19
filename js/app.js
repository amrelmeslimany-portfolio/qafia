$(function () {
  const sideAdv = $(".side-adv");
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

  // Articles Section
  const bestArticles = $(".bestArticles .article-item");

  // Window resize
  $(window).on("resize", () => {
    // set hieght for adv
    setADVHeight();
  });

  // Insert Letters to Body
  if (lettersWrap.length) {
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
  }

  // Set height of adv
  setADVHeight();

  // Truncate Article title and Desc
  if (bestArticles.length) {
    bestArticles.each(function () {
      let title = $(this).find(".article-title");
      let desc = $(this).find(".article-desc");

      truncate(title, 60);
      truncate(desc, 600);
    });
  }

  // ReUsed Functions
  function setADVHeight() {
    // Set Height of adv
    if ($(".3double-height").length && sideAdv.length) {
      $(".3double-height").each(function () {
        let width = $(this).width();

        $(this).height(`${width / 3}px`);
      });
      sideAdv.height(`${sideAdv.width() * 2}px`);
    }
  }

  function truncate(text, sliceNumber) {
    text.text().trim().length > sliceNumber &&
      text.text(text.text().trim().substring(0, sliceNumber) + "...");
  }
});
