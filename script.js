// buttons form
const showFormBtn = document.getElementById('showFormBtn');
const closeIcon = document.getElementById('closeIcon');
const closeFormDialog = document.getElementById('closeFormDialog');
const addBtn = document.getElementById('addBtn');

//Modal button
const cancelBtn = document.getElementById('cancelBtn');
const discardBtn = document.getElementById('discardBtn');
const deleteBtnDialog = document.getElementById('deleteBtnDialog');
const deleteConfirmDialog = document.getElementById('deleteConfirmDialog');

// form handler
const habitForm = document.getElementById('habitForm');
const habitList = document.getElementById('habitList');
// Get form values
const habitTitle = document.getElementById('habitTitle');
const habitGoal = document.getElementById('habitGoal');
const habitRepeat = document.getElementById('habitRepeat');
const habitTime = document.getElementById('habitTime');

// repeat option
const customDays = document.querySelector('.custom-day');
const weeklyDay = document.querySelector('.weekly-day');

let activeTimerId = null;
// let timers = {};

// Add to show form button
const showBtnToggle = () => {
    showFormBtn.classList.toggle('hidden');
    habitForm.classList.toggle('hidden');
}

showFormBtn.addEventListener('click', () => {
  showBtnToggle();
})

// Local storage
const habitData = JSON.parse(localStorage.getItem('habits')) || [];
let currentHabit = {};
formatTime();


//Show or hide custom days based on repeat selection
habitRepeat.addEventListener('change', () => {
  if (habitRepeat.value === 'every') {
    customDays.classList.remove('hidden');
    weeklyDay.classList.add('hidden');
  } else if (habitRepeat.value === 'weekly') {
    weeklyDay.classList.remove('hidden');
    customDays.classList.add('hidden');
  } else {
    customDays.classList.add('hidden');
    weeklyDay.classList.add('hidden');
  }
});

// Handle form submission
const addOrEditHabit = () => {
  const timer = currentHabit.timer || 0;
  const isRunning = currentHabit.isRunning || false;
  const lastStart = currentHabit.lastStart || null;
  const displayInterval = currentHabit.displayInterval || null;

  if(!habitTitle.value.trim()){
    alert("Please provide a title");
    return;
  }

  //Weekly Selected Day
  const selectedWeekly = document.querySelector('input[name="weekly-day"]:checked');
  const selectedWeeklyDay = selectedWeekly ? selectedWeekly.value : null; //null if not selected

  //Custom Selected Days
  const selectedCustomDays = Array.from(document.querySelectorAll('input[name="custom-day"]:checked')).map(day => day.value);

  const dataIndex = habitData.findIndex((item) => item.id === currentHabit.id);

  const habitObj = {
      id: Date.now(),
      name: habitTitle.value,
      goal: habitGoal.value,
      repeat: habitRepeat.value,
      time: habitTime.value,
      weeklyDay: selectedWeeklyDay,
      customDays: selectedCustomDays,
      timer: timer,
      isRunning: isRunning,
      lastStart: lastStart,
      displayInterval: displayInterval
      
  };
  
  if (dataIndex === -1) {
      habitData.unshift(habitObj);
  } else {
      habitData[dataIndex] = habitObj;
  }

  localStorage.setItem('habits', JSON.stringify(habitData));
  showAllHabits();
  resetForm();
  showBtnToggle();
  // habitForm.reset();
}


// Close Button
closeIcon.addEventListener('click', () => {
  const formContainValues = habitTitle.value || habitGoal.value || habitRepeat.value || habitTime.value;
  const formValuesUpdated = habitTitle.value !== currentHabit.name || habitGoal.value !== currentHabit.goal || habitRepeat.value !== currentHabit.repeat || habitTime.value !== currentHabit.time;
  
  if (formContainValues && formValuesUpdated) {
    closeFormDialog.showModal();
  } else {
    showBtnToggle();
    resetForm();
  }
});

// Confirm close form Modal buttons
cancelBtn.addEventListener("click", () => closeFormDialog.close());

discardBtn.addEventListener("click", () => {
  closeFormDialog.close();
  resetForm();
  showBtnToggle();
});

console.log(currentHabit);
console.log(habitData);

//Display added habit
const habitCard = (habit) => {
  const { name, goal, repeat, time, weeklyDay, customDays, timer } = habit;

  const card = document.createElement('div');
  card.classList.add('habit-card');
  card.id = habit.id;

  card.innerHTML = `
    <h3 class="habit-name">${name}</h3>
    <p class="habit-goal">Goal: ${goal}</p>
    <p class="habit-repeat">Repeat: ${repeat}
    ${repeat === 'weekly' ? ` on ${weeklyDay}</p>` : ''}
    ${repeat === 'every' ? ` ${customDays.join(', ')}` : ''}</p>
    <p>Start Time: ${time}</p>
    <p>Timer: <span id="timer-${habit.id}">${formatTime(habit.timer)}</span></p>

      `;

    //delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('third-btn');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.dataset.id = habit.id;

    //delete confirmation dialog
    deleteBtn.addEventListener('click', () => {
      deleteConfirmDialog.showModal();
      deleteBtnDialog.addEventListener('click', () => {
        deleteHabit(habit.id);
      })
    });
    

    card.appendChild(deleteBtn);

    //edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('primary-btn');
    editBtn.classList.add('edit-btn');
    editBtn.dataset.id = habit.id;

    editBtn.addEventListener('click', () => {
      editHabit(habit.id);
      showBtnToggle();
    })

    card.appendChild(editBtn);

    //timer button
    const timerBtn = document.createElement('button');
    timerBtn.textContent = 'Start';
    timerBtn.classList.add('secondary-btn');
    timerBtn.dataset.id = habit.id;
    timerBtn.id = `timerBtn-${habit.id}`;

    timerBtn.addEventListener('click', () => {
      toggleHabitTimer(habit.id);
    });

    card.appendChild(timerBtn);
    
    return card;
}

// Render functions
const clearHabitDisplay = () => {
  habitList.innerHTML = '';
}

const showAllHabits = () => {
  clearHabitDisplay();
  habitData.forEach(habit => {
    const card = habitCard(habit);
    habitList.appendChild(card);

    // updateTimerDisplay(habit);

    if (habit.isRunning && habit.lastStart) {
      habit.displayInterval = setInterval(() => {
        updateTimerDisplay(habit);
      }, 1000);
      // startTimer(habit);
    }
  });
}

if (habitData.length > 0) {
  showAllHabits();
}
      
habitForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from submitting normally
    addOrEditHabit();
  }
)

// reset form
const resetForm = () => {
  //Clear form inputs
  habitTitle.value = '';
  habitGoal.value = '';
  habitRepeat.value = '';
  habitTime.value = '';

  //hide custom and weekly day selectors
  customDays.classList.add('hidden');
  weeklyDay.classList.add('hidden');

  //uncheck all day checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);

  currentHabit = {};
}

// Delete Habit
const deleteHabit = (id) => {
  const dataIndex = habitData.findIndex(habit => habit.id === Number(id));

  if (dataIndex !== -1) {
    habitData.splice(dataIndex, 1);
    localStorage.setItem("habits", JSON.stringify(habitData));
    showAllHabits();
  }

}

// Edit Habit
const editHabit = (id) => {
  const dataIndex = habitData.findIndex(habit => habit.id === Number(id));
  currentHabit = habitData[dataIndex];

  if (dataIndex !== -1) {
    habitTitle.value = currentHabit.name;
    habitGoal.value = currentHabit.goal;
    habitRepeat.value = currentHabit.repeat;
    habitTime.value = currentHabit.time;

    // Show/hide day selectors based on repeat value
    if (currentHabit.repeat === 'weekly') {
      weeklyDay.classList.remove('hidden');
      customDays.classList.add('hidden');
      document.querySelectorAll('input[name="weekly-day"]').forEach(input => {
        input.checked = input.value === currentHabit.weeklyDay;
      });
    } else if (currentHabit.repeat === 'every') {
      customDays.classList.remove('hidden');
      weeklyDay.classList.add('hidden');
      document.querySelectorAll('input[name="custom-day"]').forEach(input => {
        input.checked = currentHabit.customDays.includes(input.value);
      });
    } else {
      customDays.classList.add('hidden');
      weeklyDay.classList.add('hidden');
    }

    addBtn.textContent = 'Update Habit';
  }
};

// Format time 
function formatTime(sec) {
  const hrs = String(Math.floor(sec / 3600)).padStart(2, '0');
  const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const secs = String(sec % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

// Track Habit Timer
const toggleHabitTimer = (id) => {
  // const habit = habitData.find(h => h.id === Number(id));
  activeTimerId = id;
  const habit = habitData.find(h => h.id === activeTimerId);
  if (!habit) return;

  if (!habit.isRunning) {
    // Before starting, stop all other running habits
    habitData.forEach(h => {
      if (h.isRunning && h.id !== habit.id) {
        alert(`Do you want to stop "${h.name}" before starting this habit?`);
        stopTimer(h);
        return;
      }
    });

    // If no other habit is running → start this one
    startTimer(habit);

  } else if (habit.isRunning) {
    // Stop this habit
    stopTimer(habit);
  } else {
    alert("Error toggling timer");
  }



  // if(!habit.isRunning) {
  //   startTimer(habit);
  // } else if (habit.isRunning) {
  //   stopTimer(habit);
  // } else {
  //   alert("Error toggling timer");
  // }

  localStorage.setItem('habits', JSON.stringify(habitData));
}

// Start timer
const startTimer = (habit) => {
  habit.isRunning = true;
  habit.lastStart = Date.now();
  
  habit.displayInterval = setInterval(() => {
    updateTimerDisplay(habit);
  }, 1000)
}


// Stop timer
const stopTimer = (habit) => {
  const now = Date.now();
  const elapsed = Math.floor((now - habit.lastStart) / 1000);
  habit.timer += elapsed;
  habit.isRunning = false;
  habit.lastStart = null;
  
  clearInterval(habit.displayInterval);
  updateTimerDisplay(habit);
}

// Update timer display
const updateTimerDisplay = (habit) => {
  const display = document.querySelector(`#timer-${habit.id}`);
  const timerBtn = document.querySelector(`#timerBtn-${habit.id}`);

  const now = Date.now();
  const elapsed = habit.isRunning ? Math.floor((now - habit.lastStart) / 1000) : 0;

  if (habit.isRunning && habit.lastStart) {
    timerBtn.textContent = 'Stop';
    timerBtn.classList.add('third-btn');
  } else {
    timerBtn.textContent = 'Start';
    timerBtn.classList.remove('third-btn');
  }

  const totalTime = habit.timer + elapsed;
  display.textContent = formatTime(totalTime);
}


// CHECKLIST==================================================================================
// add icon for tracking time

// check done for today habit
// add notifications/reminders

// streak tracking hrs / day?
// improve styling and responsiveness

// fixing small issues when there's refresh button back to green for a sec