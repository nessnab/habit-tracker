const habitForm = document.getElementById('habitForm');
const habitList = document.getElementById('habitList');
// Get form values
const habitTitle = document.getElementById('habitTitle');
const habitGoal = document.getElementById('habitGoal');
const habitRepeat = document.getElementById('habitRepeat');
const habitStartTime = document.getElementById('startTime');

const customDays = document.querySelector('.custom-day');
const weeklyDay = document.querySelector('.weekly-day');
    


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

//try using toggle


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
      customDays: selectedCustomDays
  };
  
  if (dataIndex === -1) {
      habitData.unshift(habitObj);
  } else {
      habitData[dataIndex] = habitObj;
  }

  localStorage.setItem('habits', JSON.stringify(habitData));
  showAllHabits();
  resetForm();
  // habitForm.reset();
}

// console.log(currentHabit);
console.log(habitData);

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
    ${repeat === 'weekly' ? ` ${weeklyDay}</p>` : ''}
    ${repeat === 'every' ? ` ${customDays.join(', ')}` : ''}</p>
    <p class="habit-start-time">Start Time: ${startTime}</p>
      `;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('primary-btn');
    deleteBtn.classList.add('delete');
    deleteBtn.dataset.id = habit.id;

    deleteBtn.addEventListener('click', () => {
      deleteHabit(habit.id);
    })

    card.appendChild(deleteBtn);

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



const deleteHabit = (id) => {
  const dataIndex = habitData.findIndex(habit => habit.id === Number(id));

  if (dataIndex !== -1) {
    habitData.splice(dataIndex, 1);
    localStorage.setItem("habits", JSON.stringify(habitData));
    showAllHabits();
  }

}



// CHECKLIST
// add icon for adding habit, hide the rest of the form
// add icon for tracking time