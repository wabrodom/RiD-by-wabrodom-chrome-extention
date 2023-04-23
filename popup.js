document.querySelector("#export-btn").addEventListener("click", exportData);

function exportData() {
  chrome.storage.local.get("form_data", function (data) {
    const jsonData = JSON.stringify(data.form_data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url: url,
      filename: "form_data.json",
    });
  });
}

document.querySelector("#import-btn").addEventListener("click", importData);
function importData() {
  alert(`Make sure .json is in form { "keyA": ["valueB", "valueC"], }`);
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.addEventListener("change", function () {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      const jsonData = reader.result;
      const formData = JSON.parse(jsonData);

      chrome.storage.local.set({ form_data: formData }, function () {
        alert("Data imported successfully!");
      });
    };

    reader.readAsText(file);
  });

  input.click();
}

// formula programming not working
// function exportData() {
//   const data = localStorage.getItem("form_data");
//   const filename = "form_data.json";
//   const blob = new Blob([data], { type: "application/json" });
//   const url = URL.createObjectURL(blob);

//   chrome.downloads.download({
//     url: url,
//     filename: filename,
//     saveAs: true,
//   });
// }
