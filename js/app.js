$(function () {
  // Search Box Vars
  const inputLastLetter = $(".search-box .input-search");
  const searchBTN = $(".input-group button");
  const messages = {
    error: $(".search-error"),
    success: $(".search-success"),
  };
  // Best word
  const bestwordsContent = $(".bestwords .bestword-content");
  const loader = bestwordsContent.find(".preloader-filter");
  const changeWordsBTN = $(".changewords-btn");
  const copyWordsBTN = $(".copywords-btn");
  const wordMeaningLink = $(".wordmean-link");
  const removeSelectionWrap = $(".removeselected-wrap button");
  const selectedIDsWords = new Set();
  const copyWords = new Set();

  // Wisedom Today
  const wisedomContent = $(".wisedom-content");

  // Word Meaning page
  const wordmeaningBox = $(".wordmean");

  const sideAdv = $(".side-adv");
  const lettersWrap = $(".beforelast-wrod .beforelast-wrod-content");
  const messagesBeforeLastLetter = {
    error: $(".letterbefore-error"),
    success: $(".letterbefore-success"),
  };
  const bfLLetterLoader = $(".bflastletter-loader");

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

  // Database Ajax variables
  const BackEndURL = "https://jkt3ay.deta.dev/"; // old: https://qafia.deta.dev/

  // Articles Section
  const bestArticles = $(".bestArticles .article-item");

  // Window resize
  $(window).on("resize", () => {
    // set hieght for adv
    setADVHeight();
  });

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

  // Home Page
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

    bfLLetterLoader.hide();
  }

  // ! Handle Data From Database and backend
  if (bestwordsContent.length) {
    let { results, isLoading, lastLetterConstant } = {
      results: [], // success or error
      isLoading: true,
      lastLetterConstant: "",
    };
    let sliceCounter = {
      old: 0,
      new: 42,
    };

    // Default Words
    duringSearching((isLoading = true));
    axios
      .get(`${BackEndURL}mostliked`)
      .then(({ data }) => {
        results = data.results;

        if (results.length) {
          // init
          initActions();
          duringSearching((isLoading = false));
          handleResults(results, sliceCounter);
        } else {
          duringSearching((isLoading = false));
          console.log("لايوجد كلمات");
        }
      })
      .catch((error) => {
        duringSearching((isLoading = false));
        console.log(error.message);
      });

    // When search input last word changing
    searchBTN.click(function (event) {
      event.preventDefault();
      let value = inputLastLetter.val().trim();

      if (!value) {
        handleMessage("قم بادخال حرف او كلمة");
      } else {
        let valueLength = value.length;
        messages.error.hide();

        // if user  enter letter
        if (valueLength == 1) {
          const url = `${BackEndURL}letter/${handleLetter(value)}`;
          lastLetterConstant = handleLetter(value);
          handelGetRequest(url);
        } else if (valueLength > 1) {
          let lastLetter = value.charAt(valueLength - 1);
          // let beforeLastLetter = value.charAt(valueLength - 2);
          // const url = `${BackEndURL}search?count=${valueLength}&last=${handleLetter(
          //   lastLetter
          // )}&b_last=${handleLetter(beforeLastLetter)}`;
          const url = `${BackEndURL}search?last=${handleLetter(lastLetter)}`;
          lastLetterConstant = handleLetter(lastLetter);
          handelGetRequest(url);
        }
        messagesBeforeLastLetter.error.hide();
      }
    });

    // Handle Get Request
    function handelGetRequest(url, messageElement = messages, isInput = true) {
      duringSearching((isLoading = true));
      // GET request
      axios
        .get(url)
        .then(({ data }) => {
          results = data.results;

          if (results.length) {
            // init
            initActions();

            isInput && inputLastLetter.val("");
            // init slice counter
            sliceCounter.old = 0;
            sliceCounter.new = 42;
            duringSearching((isLoading = false));
            handleResults(results, sliceCounter);
            handleMessage(
              `تم ايجاد <b>${results.length}</b> كلمة بنجاح`,
              "success",
              messageElement
            );
            scrollAfterFinished();
          } else {
            duringSearching((isLoading = false));
            handleMessage("لايوجد كلمات ", "error", messageElement);
          }
        })
        .catch((error) => {
          duringSearching((isLoading = false));
          handleMessage(
            "هناك خطأ فى الانترنت او السيرفر",
            "error",
            messageElement
          );
        });
    }

    // When user Click "تغيير الكلمات"
    changeWordsBTN.click(function () {
      if (sliceCounter.new == results.length) {
        sliceCounter.old = 0;
        sliceCounter.new = 42;
      } else if (results.length <= 42) {
        return;
      } else {
        sliceCounter.old += 42;
        sliceCounter.new += 42;
      }
      handleResults(results, sliceCounter);
    });

    wordActions($(".word-badge"));

    // Copy words when click on copy words button
    copyWordsBTN.click(function () {
      if (copyWords.size > 0) {
        let button = $(this);
        let copyWordsText = [...copyWords].join(" / ");
        let spanTag = button.find("span");
        let convertedIDs = [...selectedIDsWords].join(" ");

        /* Copy the text inside the text field */
        navigator.clipboard
          .writeText(copyWordsText)
          .then((result) => {
            spanTag.text("تم النسخ!");
            button.addClass("bg-success");

            // Get Request

            button.attr("disabled", true);
            axios
              .get(`${BackEndURL}copy?ids=${convertedIDs}`)
              .then(({ data }) => {
                isCopyBTNClickd = true;
                button.attr("disabled", false);
                console.log(data);
              })
              .catch((error) => {
                console.log(error.message);
              });

            // Show successfull message
            setTimeout(() => {
              button.removeClass("bg-success");
              spanTag.text("نسخ المحدد");
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });

    // Search by using letter before the last
    $(".letter-badge").click(function () {
      let letter = $(this).text().trim();

      if (!lastLetterConstant) {
        handleMessage(
          "يجب ان تبحث عن أخر حرف (الروي) اولا",
          "error",
          messagesBeforeLastLetter
        );
        return;
      } else {
        const url = `${BackEndURL}search?last=${lastLetterConstant}&b_last=${handleLetter(
          letter
        )}`;

        handelGetRequest(url, messagesBeforeLastLetter, false);
      }
    });
  }

  // Wisedom Get
  if (wisedomContent.length) {
    const bodyTag = wisedomContent.find(".wise-body");
    const nameTag = wisedomContent.find(".wise-name");

    axios
      .get(`${BackEndURL}quote`)
      .then(({ data = [] }) => {
        if (data.length) {
          bodyTag.html(data[1]); // Body
          nameTag.html(data[0]); // Name
        } else {
          console.log("لا يوجد حكمه");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Word meaning page
  if (wordmeaningBox.length) {
    const params = new URLSearchParams(location.search);
    let wordID = "wordid";
    let data = params.get(wordID);
    let wordWrapSection = wordmeaningBox.find(".wrapBox");

    if (params.has(wordID) && params.get(wordID) != "NaN") {
      let IDs = data;

      axios.get(`${BackEndURL}meaning?ids=${IDs}`).then(({ data }) => {
        let result = data.results;

        if (typeof result != "string") {
          if (result.length == 1) {
            let item = Object.entries(JSON.parse(result[0][1]));
            let theWord = result[0][0];

            if (item.length == 0) {
              wordWrapSection.html(
                `
                <h2 class="mb-5 text-black bigTitle">معني كلمة <b>${theWord}</b>:</h2>
                <p>غير متوفر معني لهذة الكلمة</p>
                    `
              );
              return;
            }

            // Insert Title
            wordWrapSection.html(
              `
              <h2 class="mb-5 text-black bigTitle">معني كلمة <b>${theWord}</b>:</h2>
              <article class="backlinkswrap">
                  <h4>معني كلمة <b>${theWord}</b> حسب:</h4>
                  <ul class="backlinks">
  
                  </ul>
                  <hr class="mb-4"/>
                  </article>
                  `
            );

            for (const [dictionary, themeaning] of item) {
              let idAttr = createID(dictionary, theWord);
              let content = "";

              themeaning.forEach((mean) => {
                content += handleMeaningParagraphs(mean);
              });

              let htmlLinks = `  <li>
              <a href="#${idAttr}" class="btn-link text-info fw-bold">${dictionary}</a>
              </li>`;

              let articleContent = `
              <article id="${idAttr}" class="meaning-article">
                                <h4>${dictionary}</h4>
                                ${content}
                            </article>`;

              wordWrapSection.find(".backlinks").prepend(htmlLinks);
              wordWrapSection.find(".backlinkswrap").after(articleContent);
            }
          } else if (result.length > 1) {
            let articleContent = "";
            let lastIItem = result.length - 1;
            // Insert Title
            wordWrapSection.html(
              `
              <h2 class="mb-5 text-black bigTitle">معني الكلمات:</h2>
              `
            );
            result.forEach((meanItem, index) => {
              let item = Object.entries(JSON.parse(meanItem[1]));
              let theWord = `'${meanItem[0]}'`;
              let content = "";

              let hr = (last) => {
                if (last) {
                  return index == lastIItem ? `<hr class="mb-4"/>` : "";
                } else {
                  return index == lastIItem ? "" : `<hr class="mb-4"/>`;
                }
              };

              // Subheader

              if (item.length == 0) {
                articleContent += ``;
                wordWrapSection.append(`
                  <article class="backlinkswrap${index}">
                  <h4>معني كلمة <b>${theWord}</b> حسب:</h4>
                  <p>غير متوفر معني لهذة الكلمة</p>
                  ${hr(true)}
                  </article>
            `);
              } else {
                articleContent += `<h4 class="mb-4">كلمه ${theWord}:</h4>`;
                wordWrapSection.append(`
                <article class="backlinkswrap${index}">
                <h4>معني كلمة <b>${theWord}</b> حسب:</h4>
                <ul class="backlinks${index}">

                </ul>
                ${hr(true)}
                </article>
          `);

                for (const [dictionary, themeaning] of item) {
                  let idAttr = createID(dictionary, theWord);

                  themeaning.forEach((mean) => {
                    content += handleMeaningParagraphs(mean);
                  });

                  let htmlLinks = `<li>
            <a href="#${idAttr}" class="btn-link text-info fw-bold">${dictionary}</a>
            </li>`;

                  articleContent += `
                  <article id="${idAttr}" class="meaning-article">
                      <h5 class="fs-21px fw-bold">${dictionary}</h5>
                      ${content}
                  </article>
            `;

                  wordWrapSection.find(`.backlinks${index}`).append(htmlLinks);
                }

                articleContent += hr(false);
              }
            });

            $(`.backlinkswrap${lastIItem}`).after(articleContent);
          }
        } else {
          wordWrapSection.html(
            `<p class="text-center mb-0">من فضلك حدد كلمات <a href="index.html" class="text-info">من هنا</a></p>`
          );
        }
      });
    } else {
      wordWrapSection.html(
        `<p class="text-center mb-0">من فضلك حدد كلمات <a href="index.html" class="text-info">من هنا</a></p>`
      );
    }
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

  // Scroll To words after search finished
  function scrollAfterFinished() {
    setTimeout(() => {
      $("html,body").animate(
        {
          scrollTop: bestwordsContent.offset().top,
        },
        50
      );
    }, 100);
  }

  // Show loading
  function duringSearching(isLoading) {
    let icon = searchBTN.find("i.fas");

    if (isLoading) {
      searchBTN.attr("disabled", true);
      icon.removeClass("fa-search");
      icon.addClass("fa-spinner");
      icon.addClass("fa-spin");
      loader.removeClass("d-none");
      bfLLetterLoader.show();
    } else {
      searchBTN.attr("disabled", false);
      icon.addClass("fa-search");
      icon.removeClass("fa-spinner");
      icon.removeClass("fa-spin");
      loader.addClass("d-none");
      bfLLetterLoader.hide();
    }
  }

  // Handle Messages (Success , Error)
  function handleMessage(message, type = "error", element = messages) {
    if (type == "error") {
      element.error.html(message);
      element.error.show();
      element.success.hide();
    } else {
      element.success.html(message);
      element.success.show();
      element.error.hide();
    }
  }

  // Convert Letters
  function handleLetter(letter) {
    switch (letter) {
      case "ا":
        return "أ";
      case "ى":
        return "ي";
      default:
        return letter;
    }
  }

  // Word html
  function wordHTML(word, id, isSelect) {
    return `<span class="word-badge badge display-xomd text-dark px-5 ${
      isSelect ? "selected" : ""
    }" data-id="${id}"  >${word}</span>`;
  }

  // Handle Data and prepare to insert to html
  function handleResults(data = [], sliceCounter) {
    const dataLength = data.length;
    let slicedData = [];
    let sliceStart = sliceCounter.old == 0 ? 0 : sliceCounter.old;
    let slicedLength; // -1 is last word , -2 words less than slice
    // Default
    changeWordsBTN.find("button").attr("disabled", false);

    if (dataLength <= 42) {
      slicedData = data;
      changeWordsBTN.find("button").attr("disabled", true);
      slicedLength = -2;
      insertResultToHTML(slicedData, slicedLength);
      return;
    }

    if (sliceCounter.new >= dataLength) {
      sliceCounter.new = dataLength;
      slicedData = data.slice(sliceCounter.old, sliceCounter.new);
      slicedLength = -1;
      insertResultToHTML(slicedData, slicedLength);
      return;
    } else {
      slicedLength = dataLength - sliceCounter.new;
      slicedData = data.slice(sliceStart, sliceCounter.new);
      insertResultToHTML(slicedData, slicedLength);
    }
  }

  // Insert Data to html after handled
  function insertResultToHTML(slicedData = [], slicedLength) {
    const otherwordsNumber = $(".otherwords-number");
    let currentWords = $(".bestword-content .word-badge");
    let insertedHTMLData = ``;

    currentWords.each(function () {
      $(this).remove();
    });

    loader.after(loopWords(slicedData, insertedHTMLData));

    wordActions($(".word-badge"));

    showRestWordsNumber(slicedLength, otherwordsNumber);
  }

  // Display rest number of other words
  function showRestWordsNumber(length, element) {
    // Show rest of words number
    if (length > 0) {
      element.html(`<p>متبقي : <b>${length}</b> كلمة</p>`);
    } else if (length == -1) {
      element.html(
        `<p>هذة أخر الكلمات,<br> سيتم التغيير من البداية عند الضغط على زر <b>تغيير الكلمات</b></p>`
      );
    } else if (length == -2) {
      element.html(`<p>هذة جميع الكلمات التي وجدت</p>`);
    } else {
      element.html(`<p>لا يوجد كلمات أخرى</p>`);
    }
  }

  // Loop words and orgonize html word code
  function loopWords(data, htmlItem) {
    data.forEach((word) => {
      htmlItem += wordHTML(word[0], word[1], selectedIDsWords.has(word[1]));
    });

    return htmlItem;
  }

  // Handle word when click on it
  function wordActions(words) {
    // When user click on words
    words.each(function () {
      $(this).click(function () {
        let id = Number($(this).data("id"));
        let text = $(this).text();
        let smallTag = copyWordsBTN.find("small");

        // When user remove select
        if ($(this).hasClass("selected")) {
          $(this).removeClass("selected");
          selectedIDsWords.delete(id);
          copyWords.delete(text);
        }
        // When user select word
        else {
          $(this).addClass("selected");
          selectedIDsWords.add(id);
          copyWords.add(text);
        }

        // Check words selected array
        if (copyWords.size) {
          smallTag.text(`(${copyWords.size})`);
          wordMeaningLink.attr(
            `href`,
            `word.html?wordid=${encodeURIComponent(
              [...selectedIDsWords].join(" ")
            )}`
          );

          copyWordsBTN.attr("disabled", false);
          wordMeaningLink.removeClass("disabled");
          removeSelectionWrap.attr("disabled", false);

          removeSelectionWrap.click(function () {
            initActions();
            $(".word-badge").removeClass("selected");
          });
        } else {
          smallTag.text("");
          initActions();
        }
      });
    });
  }

  function initActions() {
    selectedIDsWords.clear();
    copyWords.clear();
    copyWordsBTN.find("small").text("");
    copyWordsBTN.attr("disabled", true);
    wordMeaningLink.attr(`href`, `word.html`);
    wordMeaningLink.addClass("disabled");
    removeSelectionWrap.attr("disabled", true);
  }

  // Meaning page
  function handleMeaningParagraphs(meaning) {
    let item = Object.entries(meaning);
    let html = "";

    for (const [word, mean] of item) {
      html += `<p class="lead fw-normal display-omd">
      <strong>${word}</strong>
      ${mean}
      </p>`;
    }

    return html;
  }

  function createID(dictionary, word) {
    return `${dictionary.replace(/\s/g, "")}-${word}`;
  }
});
