const showFormBtn = document.getElementById('showFormBtn');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancelBtn');
const habitForm = document.getElementById('habitForm');
const habitList = document.getElementById('habitList');
// Get form values
const habitTitle = document.getElementById('habitTitle');
const habitGoal = document.getElementById('habitGoal');
const habitRepeat = document.getElementById('habitRepeat');
const habitStartTime = document.getElementById('startTime');

const customDays = document.querySelector('.custom-day');
const weeklyDay = document.querySelector('.weekly-day');
    


// Add button
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
      trackedTime: trackedTime
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


// Cancel Button
cancelBtn.addEventListener('click', () => {
  showBtnToggle();
});

console.log(currentHabit);
// console.log(habitData);

//Display added habit
const habitCard = (habit) => {
  const { name, goal, repeat, startTime, weeklyDay, customDays } = habit;

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
      `;

    //delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('primary-btn');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.dataset.id = habit.id;

    deleteBtn.addEventListener('click', () => {
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

// CHECKLIST
// add icon for adding habit, 
// add icon for tracking time