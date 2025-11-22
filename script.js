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
const habitStartTime = document.getElementById('startTime');

// repeat option
const customDays = document.querySelector('.custom-day');
const weeklyDay = document.querySelector('.weekly-day');

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
let timers = {};
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
      startTime: habitStartTime.value,
      weeklyDay: selectedWeeklyDay,
      customDays: selectedCustomDays,
      timer: timer
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
  const formContainValues = habitTitle.value || habitGoal.value || habitRepeat.value || habitStartTime.value;
  const formValuesUpdated = habitTitle.value !== currentHabit.name ||habitGoal.value !== currentHabit.goal || habitRepeat.value !== currentHabit.repeat || habitStartTime.value !== currentHabit.startTime;
  
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
// console.log(habitData);

//Display added habit
const habitCard = (habit) => {
  const { name, goal, repeat, startTime, weeklyDay, customDays, timer } = habit;

  const card = document.createElement('div');
  card.classList.add('habit-card');
  card.id = habit.id;

  card.innerHTML = `
    <h3 class="habit-name">${name}</h3>
    <p class="habit-goal">Goal: ${goal}</p>
    <p class="habit-repeat">Repeat: ${repeat}
    ${repeat === 'weekly' ? ` on ${weeklyDay}</p>` : ''}
    ${repeat === 'every' ? ` ${customDays.join(', ')}` : ''}</p>
    <p class="habit-start-time">Start Time: ${startTime}</p>
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
    });
    
    deleteBtnDialog.addEventListener('click', () => {
      deleteHabit(habit.id);
    })

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
      trackHabitTimer(habit.id);
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
  habitStartTime.value = '';

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

  if (timers[id]) {
    clearInterval(timers[id]);
    delete timers[id];
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
    habitStartTime.value = currentHabit.startTime;

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
const trackHabitTimer = (id) => {
  const dataIndex = habitData.findIndex(habit => habit.id === Number(id));
  const habit = habitData[dataIndex];
  const timerDisplay = document.getElementById(`timer-${id}`);
  const timerBtn = document.getElementById(`timerBtn-${id}`);

  if (!timers[id]) {
    //Start timer
    timers[id] = setInterval(() => {
      habit.timer ++;
      timerDisplay.textContent = formatTime(habit.timer);
    }, 1000);
    timerBtn.textContent = 'Stop';
    timerBtn.classList.toggle('third-btn');
  } else if (timers[id]) {
    //Stop Timer
    clearInterval(timers[id]);
    delete timers[id];
    timerBtn.textContent = 'Start';
    timerBtn.classList.toggle('third-btn');
    localStorage.setItem('habits', JSON.stringify(habitData));
  }
}



// CHECKLIST
// fixing issues when there's refresh while timer is running

// add icon for tracking time

// check done for today habit
// add confirmation for deleting habit
// add notifications/reminders

// streak tracking hrs / day?
// improve styling and responsiveness