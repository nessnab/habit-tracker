
//Show or hide custom days based on repeat selection
const repeatSelect = document.getElementById('habitRepeat');
const customDays = document.querySelector('.custom-day');
const weeklyDay = document.querySelector('.weekly-day');

repeatSelect.addEventListener('change', () => {
  const value = repeatSelect.value;

  if (value === 'custom') {
    customDays.classList.remove('hidden');
    weeklyDay.classList.add('hidden');
  } else if (value === 'weekly') {
    weeklyDay.classList.remove('hidden');
    customDays.classList.add('hidden');
  } else {
    customDays.classList.add('hidden');
    weeklyDay.classList.add('hidden');
  }
});

// Handle form submission
const habitForm = document.getElementById('habitForm');

habitForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from submitting normally

    // Get form values
    const habitName = document.getElementById('habitName').value;
    const habitGoal = document.getElementById('habitGoal').value;
    const habitRepeat = document.getElementById('habitRepeat').value;
    const habitStartTime = document.getElementById('startTime').value;
    
    //Weekly Selected Day
    const selectedWeekly = document.querySelector('input[name="weekly-day"]:checked');
    const selectedWeeklyDay = selectedWeekly ? selectedWeekly.value : null; //null if not selected

    //Custom Selected Days
    const selectedCustomDays = Array.from(document.querySelectorAll('input[name="custom-day"]:checked')).map(day => day.value);

    // Create habit object
    const habit = {
        name: habitName,
        goal: habitGoal,
        repeat: habitRepeat,
        startTime: habitStartTime,
        weeklyDay: selectedWeeklyDay,
        customDays: selectedCustomDays
    };

    //Displaying Habit added
    
    const habitList = document.getElementById('habitList');
    const habitItem = document.createElement('div');
    habitItem.classList.add('habit-item');
    
    habitItem.innerHTML = `
        <h3>${habit.name}</h3>
        <p><b>Goal:</b> ${habit.goal}</p>
        <p><b>Repeat:</b> ${habit.repeat}</p>
        ${habit.repeat === 'weekly' ? `<p><b>Day:</b> ${habit.weeklyDay}</p>` : ''}
        ${habit.repeat === 'custom' ? `<p><b>Days:</b> ${habit.customDays.join(', ')}</p>` : ''}
        <p><b>Start Time:</b> ${habit.startTime}</p>
    `;
    
    habitList.appendChild(habitItem);

    // Reset form
    habitForm.reset();
});

// CHECKLIST
// add icon for adding habit, hide the rest of the form
// add icon for tracking time