document.addEventListener("DOMContentLoaded", function () {
  const appointmentSelect = document.getElementById("appointment");

  // Clear existing options except the first "Select a Time Slot"
  appointmentSelect.innerHTML = '<option value="">Select a Time Slot</option>';

  const today = new Date();
  const currentHour = today.getHours();

  // Find Monday of the current week
  const monday = new Date(today);
  const day = monday.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // If Sunday, adjust to previous Monday
  monday.setDate(monday.getDate() + diff);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = [
    { start: 8, end: 12, label: "8:00 AM to 12:00 PM" },
    { start: 12, end: 16, label: "12:00 PM to 4:00 PM" },
    { start: 16, end: 20, label: "4:00 PM to 8:00 PM" }
  ];

  for (let i = 0; i < 6; i++) {
    let currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);
    let dayName = daysOfWeek[i];

    timeSlots.forEach(slot => {
      // Skip past slots for today
      if (
        currentDay.toDateString() === today.toDateString() &&
        currentHour >= slot.end
      ) {
        return;
      }

      const dateStr = currentDay.toLocaleDateString();
      const option = document.createElement("option");
      option.value = `${dayName} (${dateStr}) - ${slot.label}`;
      option.textContent = `${dayName} (${dateStr}) - ${slot.label}`;
      appointmentSelect.appendChild(option);
    });
  }
});
