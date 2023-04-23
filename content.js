const nid1 = "nid1";
const nid2 = "nid2";
const tambon1 = "tambon1";
const tambon2 = "tambon2";
const waitForProvince = "province";

document
  .querySelector(`#${nid1}`)
  .addEventListener("blur", checkIdWhenTab.bind(null, nid1));
document
  .querySelector(`#${nid2}`)
  .addEventListener("blur", checkIdWhenTab.bind(null, nid2));

document.addEventListener("focusin", addHeight);

function checkIdWhenTab(nid) {
  const fieldValue = document.getElementById(nid).value; //string
  const arr = fieldValue.trim().split("").slice(0, 12); // arr of string
  // 1234567890121
  const sum = arr
    .map((elem, i) => {
      return parseInt(elem) * (arr.length + 1 - i);
    })
    .reduce((acc, b) => acc + b, 0);

  const lastDigit = (11 - (sum % 11)) % 10;

  if (lastDigit === +fieldValue[12]) {
    console.log("Correct Id");
    document.querySelector(`#${nid}`).style.backgroundColor = "#ffe347";
  } else {
    console.log("Id is not match");
    document.querySelector(`#${nid}`).style.backgroundColor = "#808080";
  }
}

//////
function addHeight() {
  // Do Remove highlight from previously focused field
  // Bolst currently focused field
  const focusedField = document.activeElement;
  if (focusedField && focusedField.tagName === "INPUT") {
    focusedField.style.height = "1.5rem";
  }
}

///// fill field

document
  .querySelector(`#${tambon1}`)
  .addEventListener("focus", addData.bind(null, tambon1));
document
  .querySelector(`#${tambon2}`)
  .addEventListener("focus", addData.bind(null, tambon2));

function addData(tambon) {
  const fieldA = document.querySelector(`#${tambon}`);
  fieldA.addEventListener("blur", function () {
    const fieldAValue = fieldA.value;
    chrome.storage.local.get("form_data", function (result) {
      const data = result.form_data || {};
      // Get the current data from chrome.storage
      // If there is data for fields B and C, fill them in
      data[fieldAValue] === undefined
        ? (data[fieldAValue] = [])
        : data[fieldAValue];
      if (data[fieldAValue][0] && data[fieldAValue][1]) {
        document.querySelector(`#district${tambon.slice(-1)}`).value =
          data[fieldAValue][0];
        document.querySelector(`#province${tambon.slice(-1)}`).value =
          data[fieldAValue][1];
      }

      document
        .querySelector(`#${waitForProvince}${tambon.slice(-1)}`)
        .addEventListener("blur", function () {
          data[fieldAValue][0] = document.querySelector(
            `#district${tambon.slice(-1)}`
          ).value;
          data[fieldAValue][1] = document.querySelector(
            `#province${tambon.slice(-1)}`
          ).value;
          chrome.storage.local.set({ form_data: data }, function () {
            // Data is saved to chrome.storage
          });
        });
    });
  });
}
