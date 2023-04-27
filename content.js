const nid1 = "nid1";
const nid2 = "nid2";
const tambon1 = "tambon1";
const tambon2 = "tambon2";
const waitForProvince = "province";

document.querySelector(`#${nid1}`).addEventListener("blur", checkIdWhenTab.bind(null, nid1));
document.querySelector(`#${nid2}`).addEventListener("blur", checkIdWhenTab.bind(null, nid2));

document.addEventListener("focusin", addHeight);
document.addEventListener("focusin", listenAllFindYou);

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

// for readability
function addHeight() {
  // Do Remove highlight from previously focused field
  // Bolst currently focused field
  const focusedField = document.activeElement;
  if (focusedField && focusedField.tagName === "INPUT") {
    focusedField.style.height = "1.5rem";
  }
}

// click, and focusin work on ready-to-go element
function listenAllFindYou(event) {
  var element = event.target;
  if (element.id === tambon1) {
    addData(tambon1);
  }
  if (element.id === tambon2) {
    addData(tambon2);
  }
}

// Get the current data from chrome.storage
// If Data has the key then an array has values on 0 and 1st index
function addData(tambon) {
  const fieldA = document.querySelector(`#${tambon}`);
  fieldA.addEventListener("blur", function () {
    const fieldAValue = fieldA.value;

    chrome.storage.local.get("form_data", function (result) {
      const data = result.form_data || {};
      data[fieldAValue] === undefined ? (data[fieldAValue] = []) : data[fieldAValue];
      if (data[fieldAValue][0] && data[fieldAValue][1]) {
        document.querySelector(`#district${tambon.slice(-1)}`).value = data[fieldAValue][0];
        document.querySelector(`#province${tambon.slice(-1)}`).value = data[fieldAValue][1];
      }

      document.querySelector(`#${waitForProvince}${tambon.slice(-1)}`).addEventListener("blur", function () {
        const amphur = document.querySelector(`#district${tambon.slice(-1)}`).value;
        const province = document.querySelector(`#province${tambon.slice(-1)}`).value;
        if (amphur !== data[fieldAValue][0]) {
          data[fieldAValue][0] = amphur;
          chrome.storage.local.set({ form_data: data }, function () {});
        }
        if (province !== data[fieldAValue][1]) {
          data[fieldAValue][1] = province;
          chrome.storage.local.set({ form_data: data }, function () {});
        }
      });
    });
  });
}

//// deprecate
// if all item create at DOM start this will works but
// they cant select on bubble or not yet create element
// listenAllFindYou will fixed this by listen on document object
// document.querySelector(`#${tambon1}`).addEventListener("focus", addData.bind(null, tambon1));
// document.querySelector(`#${tambon2}`).addEventListener("focus", addData.bind(null, tambon2));
