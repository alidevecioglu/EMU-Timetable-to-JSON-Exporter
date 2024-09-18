// Check the current tab's URL and enable/disable the button
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];

  // Check if the current tab's URL is the timetable page
  const correctUrl = "https://student.emu.edu.tr/Academic/TimeTable";
  if (currentTab.url.startsWith(correctUrl)) {
    document.getElementById("status").textContent =
      "You are on the correct page!";
    document.getElementById("exportBtn").disabled = false;
  } else {
    document.getElementById("status").textContent =
      "Please visit the Timetable page.";
    document.getElementById("exportBtn").disabled = true;
  }
});

// When the button is clicked, trigger the download
document.getElementById("exportBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];

    // Inject the content script and call the downloadTimetableJSON function
    chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      function: () => {
        // Call the function from content.js to download the timetable
        if (typeof window.downloadTimetableJSON === "function") {
          window.downloadTimetableJSON();
        } else {
          console.error("downloadTimetableJSON is not defined");
        }
      },
    });
  });
});
