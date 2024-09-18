// Function to extract timetable data and structure it as requested
function extractTimetableData() {
  // Mapping of Turkish and English day names to English
  const dayNameMap = {
    Pazartesi: "Monday",
    Salı: "Tuesday",
    Çarşamba: "Wednesday",
    Perşembe: "Thursday",
    Cuma: "Friday",
    Cumartesi: "Saturday",
    Pazar: "Sunday",
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
    SUNDAY: "Sunday",
  };

  const dayElements = document.querySelectorAll(
    ".schedule-table-heading ul li"
  );
  const days = Array.from(dayElements)
    .slice(1)
    .map((dayEl) => {
      const dayText = dayEl.innerText.trim();
      return dayNameMap[dayText] || dayText; // Map to English or keep as is
    });

  const timeSlots = document.querySelectorAll(".schedule-table-content ul");
  const timetableByCourse = {};

  // Loop through each time slot
  timeSlots.forEach((slot) => {
    const times = slot.children[0].innerText.trim();
    const [startTime, endTime] = times.split("-").map((t) => t.trim());
    const classes = Array.from(slot.children).slice(1);

    // Loop through each day's class in that time slot
    classes.forEach((classElement, dayIndex) => {
      const courseLinks = classElement.querySelectorAll("a");
      if (courseLinks.length > 0) {
        courseLinks.forEach((courseElement) => {
          const courseInfo = courseElement.innerText.split("/");
          const courseName = courseInfo[0];
          const classLocation = courseInfo[1];
          const courseLink = courseElement.href;

          const timetableEntry = {
            day: days[dayIndex],
            time_start: startTime,
            time_end: endTime,
            class: classLocation,
            class_location: courseLink,
          };

          if (!timetableByCourse[courseName]) {
            timetableByCourse[courseName] = {
              course: courseName,
              timetable: [],
            };
          }

          timetableByCourse[courseName].timetable.push(timetableEntry);
        });
      }
    });
  });

  return Object.values(timetableByCourse);
}

// Function to download the JSON file
function downloadTimetableJSON() {
  const data = extractTimetableData();
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "timetable.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Make sure to expose the function to the global window object
window.downloadTimetableJSON = downloadTimetableJSON;
