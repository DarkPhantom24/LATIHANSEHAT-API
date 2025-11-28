const API_URL = 'http://localhost:3333'
let workoutsData = []
let isLoading = false
let currentDate = new Date()
let selectedDate = null
let editingWorkout = null


if (window.location.pathname.includes('dashboard.html')) {
  document.addEventListener('DOMContentLoaded', initDashboard)
}

function initDashboard() {
  console.log('Dashboard initializing...')


  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (!token) {
    window.location.href = 'login.html'
    return
  }


  if (user.name) {
    document.getElementById('userName').textContent = `Welcome, ${user.name}!`
    document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase()
  }


  document.getElementById('date').value = new Date().toISOString().split('T')[0]


  document.getElementById('workoutForm').addEventListener('submit', handleAddWorkout)
  document.getElementById('logoutBtn').addEventListener('click', handleLogout)


  loadWorkouts()
}

async function handleAddWorkout(e) {
  e.preventDefault()

  if (isLoading) return

  const name = document.getElementById('workoutName').value.trim()
  const type = document.getElementById('workoutType').value
  const duration = document.getElementById('duration').value
  const date = document.getElementById('date').value

  if (!name || !type || !duration || !date) {
    alert('Please fill all required fields')
    return
  }

  isLoading = true

  try {
    const token = localStorage.getItem('token')
    const url = editingWorkout ? `${API_URL}/latihan/${editingWorkout}` : `${API_URL}/latihan`
    const method = editingWorkout ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        type,
        duration: parseInt(duration),
        date,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      if (editingWorkout) {

        const index = workoutsData.findIndex((w) => w._id === editingWorkout)
        if (index !== -1) {
          workoutsData[index] = data.latihan
        }
        alert('Workout updated successfully!')
      } else {

        workoutsData.push(data.latihan)
        alert('Workout added successfully!')
      }
      clearForm()
      displayWorkouts()
      updateStats()
      renderCalendar()
    } else {
      alert(data.error || 'Failed to save workout')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Network error')
  } finally {
    isLoading = false
  }
}

async function loadWorkouts() {
  if (isLoading) return

  isLoading = true

  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/latihan`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      const data = await response.json()
      workoutsData = data.latihan || []
      displayWorkouts()
      updateStats()
      renderCalendar()
    } else if (response.status === 401) {
      localStorage.clear()
      window.location.href = 'login.html'
    } else {
      console.error('Failed to load workouts')
      displayWorkouts()
      updateStats()
    }
  } catch (error) {
    console.error('Network error:', error)
    displayWorkouts()
    updateStats()
  } finally {
    isLoading = false
  }
}

function displayWorkouts() {
  const container = document.getElementById('workouts-list')
  if (!container) return

  container.innerHTML = ''

  if (workoutsData.length === 0) {
    container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-dumbbell text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">Belum ada list latihan</h3>
                <p class="text-gray-500">Add your first workout to get started!</p>
            </div>
        `
    return
  }

  workoutsData.forEach((workout) => {
    const div = document.createElement('div')
    div.className = 'bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500'

    div.innerHTML = `
            <div class="mb-4">
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">${workout.type}</span>
                ${workout.status === 'terlaksana' ? '<i class="fas fa-check-circle text-green-500 text-xl float-right"></i>' : ''}
            </div>
            
            <h4 class="text-lg font-bold text-gray-800 mb-3">${workout.name}</h4>
            
            <div class="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                <div><i class="fas fa-clock mr-2"></i>${workout.duration} min</div>
                <div><i class="fas fa-calendar mr-2"></i>${new Date(workout.date).toLocaleDateString()}</div>
                <div><i class="fas fa-info-circle mr-2"></i>${workout.status}</div>
            </div>
            
            <div class="flex flex-wrap gap-3">
                ${
                  workout.status !== 'terlaksana'
                    ? `<button onclick="updateStatus('${workout._id}')" class="flex-1 min-w-0 bg-green-100 text-green-700 py-3 px-4 rounded-lg hover:bg-green-200 transition font-semibold">
                        <i class="fas fa-check mr-2"></i>Selesai
                    </button>`
                    : ''
                }
                <button onclick="editWorkout('${workout._id}')" class="flex-1 min-w-0 bg-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-200 transition font-semibold">
                    <i class="fas fa-edit mr-2"></i>Edit
                </button>
                <button onclick="deleteWorkout('${workout._id}')" class="flex-1 min-w-0 bg-red-100 text-red-700 py-3 px-4 rounded-lg hover:bg-red-200 transition font-semibold">
                    <i class="fas fa-trash mr-2"></i>Hapus
                </button>
            </div>
        `

    container.appendChild(div)
  })
}

async function updateStats() {
  const total = workoutsData.length
  const completed = workoutsData.filter((w) => w.status === 'terlaksana').length
  const totalMinutes = workoutsData.reduce((sum, w) => sum + w.duration, 0)

  document.getElementById('totalWorkouts').textContent = total
  document.getElementById('completedWorkouts').textContent = completed
  document.getElementById('totalMinutes').textContent = totalMinutes
  
  // Fetch total calories
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/latihan/calories/total`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    if (response.ok) {
      const data = await response.json()
      document.getElementById('totalCalories').textContent = data.totalCalories
    } else {
      document.getElementById('totalCalories').textContent = 0
    }
  } catch (error) {
    console.error('Error fetching calories:', error)
    document.getElementById('totalCalories').textContent = 0
  }
}

function editWorkout(id) {
  const workout = workoutsData.find((w) => w._id === id)
  if (!workout) return

  editingWorkout = id
  document.getElementById('workoutName').value = workout.name
  document.getElementById('workoutType').value = workout.type
  document.getElementById('duration').value = workout.duration
  document.getElementById('date').value = new Date(workout.date).toISOString().split('T')[0]

  // Change button text
  const submitBtn = document.querySelector('#workoutForm button[type="submit"]')
  submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Update Workout'

  // Scroll to form
  document.getElementById('workoutForm').scrollIntoView({ behavior: 'smooth' })
}

async function updateStatus(id) {
  if (isLoading) return

  isLoading = true

  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/latihan/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'terlaksana' }),
    })

    if (response.ok) {

      const workout = workoutsData.find((w) => w._id === id)
      if (workout) {
        workout.status = 'terlaksana'
      }
      alert('Status updated!')
      displayWorkouts()
      updateStats()
      renderCalendar()
    } else {
      alert('Failed to update')
    }
  } catch (error) {
    alert('Network error')
  } finally {
    isLoading = false
  }
}

async function deleteWorkout(id) {
  if (!confirm('Hapus Latihan ini?') || isLoading) return

  isLoading = true

  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/latihan/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {

      workoutsData = workoutsData.filter((w) => w._id !== id)
      alert('Workout deleted!')
      displayWorkouts()
      updateStats()
      renderCalendar()
    } else {
      alert('Failed to delete')
    }
  } catch (error) {
    alert('Network error')
  } finally {
    isLoading = false
  }
}

function clearForm() {
  editingWorkout = null
  document.getElementById('workoutName').value = ''
  document.getElementById('workoutType').value = 'cardio'
  document.getElementById('duration').value = ''
  document.getElementById('date').value = new Date().toISOString().split('T')[0]


  const submitBtn = document.querySelector('#workoutForm button[type="submit"]')
  submitBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Add Workout'
}

function handleLogout() {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    localStorage.clear()
    window.location.href = 'index.html'
  }
}


function renderCalendar() {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()


  document.getElementById('currentMonth').textContent = new Date(year, month).toLocaleDateString(
    'en-US',
    { month: 'long', year: 'numeric' }
  )

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  let calendarHTML = ''


  calendarHTML += '<div class="calendar-header">'
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  dayNames.forEach((day) => {
    calendarHTML += `<div class="calendar-day-header">${day}</div>`
  })
  calendarHTML += '</div>'


  calendarHTML += '<div class="calendar-body">'


  const prevMonth = new Date(year, month - 1, 0).getDate()
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarHTML += `<div class="calendar-day other-month">`
    calendarHTML += `<div class="day-number">${prevMonth - i}</div>`
    calendarHTML += '</div>'
  }


  for (let day = 1; day <= daysInMonth; day++) {
    const currentDay = new Date(year, month, day)
    const isToday = currentDay.toDateString() === today.toDateString()
    const dayWorkouts = getWorkoutsForDate(currentDay)

    let dayClass = 'calendar-day'
    if (isToday) dayClass += ' today'
    if (dayWorkouts.length > 0) dayClass += ' has-workout'
    if (selectedDate && currentDay.toISOString().split('T')[0] === selectedDate) {
      dayClass += ' selected'
    }

    calendarHTML += `<div class="${dayClass}" onclick="selectDate('${currentDay.toISOString().split('T')[0]}')">`
    calendarHTML += `<div class="day-number font-bold mb-1">${day}</div>`


    if (dayWorkouts.length > 0) {
      calendarHTML += '<div class="workout-details">'
      dayWorkouts.slice(0, 2).forEach((workout) => {
        const statusIcon = workout.status === 'terlaksana' ? '✓' : '○'
        const statusClass = workout.status === 'terlaksana' ? 'text-green-600' : 'text-gray-400'
        calendarHTML += `<div class="text-xs p-1 bg-blue-50 rounded mb-1">`
        calendarHTML += `<div class="font-semibold truncate" title="${workout.name}">${workout.name.substring(0, 10)}${workout.name.length > 10 ? '...' : ''}</div>`
        calendarHTML += `<div class="flex justify-between items-center text-gray-600">`
        calendarHTML += `<span>${workout.duration}m</span>`
        calendarHTML += `<span class="${statusClass}">${statusIcon}</span>`
        calendarHTML += '</div></div>'
      })

      if (dayWorkouts.length > 2) {
        calendarHTML += `<div class="text-xs text-center text-gray-500">+${dayWorkouts.length - 2} more</div>`
      }
      calendarHTML += '</div>'
    }

    calendarHTML += '</div>'
  }


  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7
  const remainingCells = totalCells - (firstDay + daysInMonth)
  for (let day = 1; day <= remainingCells; day++) {
    calendarHTML += `<div class="calendar-day other-month">`
    calendarHTML += `<div class="day-number">${day}</div>`
    calendarHTML += '</div>'
  }

  calendarHTML += '</div>'
  document.getElementById('calendar').innerHTML = calendarHTML
}

function getWorkoutsForDate(date) {
  const dateStr = date.toISOString().split('T')[0]
  return workoutsData.filter((workout) => {
    const workoutDate = new Date(workout.date).toISOString().split('T')[0]
    return workoutDate === dateStr
  })
}

function selectDate(dateStr) {
  selectedDate = dateStr
  document.getElementById('date').value = dateStr


  const dayWorkouts = workoutsData.filter((workout) => {
    const workoutDate = new Date(workout.date).toISOString().split('T')[0]
    return workoutDate === dateStr
  })


  if (dayWorkouts.length > 0) {
    displaySelectedDateWorkouts(dayWorkouts)
  } else {
    displayWorkouts()
  }

  renderCalendar()
}

function displaySelectedDateWorkouts(workouts) {
  const container = document.getElementById('workouts-list')
  if (!container) return

  container.innerHTML = `
        <div class="col-span-full mb-4">
            <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 class="font-semibold text-indigo-800 mb-2">
                    <i class="fas fa-calendar-day mr-2"></i>
                    Workouts for ${new Date(selectedDate + 'T00:00:00').toLocaleDateString()}
                </h4>
                <button onclick="showAllWorkouts()" class="text-indigo-600 hover:text-indigo-800 text-sm">
                    <i class="fas fa-arrow-left mr-1"></i>Show all workouts
                </button>
            </div>
        </div>
    `

  workouts.forEach((workout) => {
    const div = document.createElement('div')
    div.className = 'bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500'

    div.innerHTML = `
            <div class="mb-4">
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">${workout.type}</span>
                ${workout.status === 'terlaksana' ? '<i class="fas fa-check-circle text-green-500 text-xl float-right"></i>' : ''}
            </div>
            
            <h4 class="text-lg font-bold text-gray-800 mb-3">${workout.name}</h4>
            
            <div class="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                <div><i class="fas fa-clock mr-2"></i>${workout.duration} min</div>
                <div><i class="fas fa-calendar mr-2"></i>${new Date(workout.date).toLocaleDateString()}</div>
                <div><i class="fas fa-info-circle mr-2"></i>${workout.status}</div>
            </div>
            
            <div class="flex flex-wrap gap-3">
                ${
                  workout.status !== 'terlaksana'
                    ? `<button onclick="updateStatus('${workout._id}')" class="flex-1 min-w-0 bg-green-100 text-green-700 py-3 px-4 rounded-lg hover:bg-green-200 transition font-semibold">
                        <i class="fas fa-check mr-2"></i>Complete
                    </button>`
                    : ''
                }
                <button onclick="editWorkout('${workout._id}')" class="flex-1 min-w-0 bg-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-200 transition font-semibold">
                    <i class="fas fa-edit mr-2"></i>Edit
                </button>
                <button onclick="deleteWorkout('${workout._id}')" class="flex-1 min-w-0 bg-red-100 text-red-700 py-3 px-4 rounded-lg hover:bg-red-200 transition font-semibold">
                    <i class="fas fa-trash mr-2"></i>Delete
                </button>
            </div>
        `

    container.appendChild(div)
  })
}

function showAllWorkouts() {
  selectedDate = null
  displayWorkouts()
  renderCalendar()
}

function changeMonth(direction) {
  currentDate.setMonth(currentDate.getMonth() + direction)
  renderCalendar()
}


async function applyFilter() {
  const showName = document.getElementById('showName').checked
  const showType = document.getElementById('showType').checked
  const showDuration = document.getElementById('showDuration').checked
  const showDate = document.getElementById('showDate').checked
  const showStatus = document.getElementById('showStatus').checked


  let fields = ['_id']
  if (showName) fields.push('name')
  if (showType) fields.push('type')
  if (showDuration) fields.push('duration')
  if (showDate) fields.push('date')
  if (showStatus) fields.push('status')

  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `{
                    latihan {
                        ${fields.join('\n                        ')}
                    }
                }`,
      }),
    })

    const data = await response.json()

    if (response.ok && data.data) {
      displayFilteredWorkouts(data.data.latihan, {
        showName,
        showType,
        showDuration,
        showDate,
        showStatus,
      })
    } else {
      alert('Filter failed')
    }
  } catch (error) {
    console.error('Filter error:', error)
    alert('Network error')
  }
}

function displayFilteredWorkouts(workouts, filters) {
  const container = document.getElementById('workouts-list')
  if (!container) return

  container.innerHTML = `
        <div class="col-span-full mb-4">
            <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 class="font-semibold text-indigo-800 mb-2">
                    <i class="fas fa-filter mr-2"></i>
                    Filtered View (${workouts.length} workouts)
                </h4>
                <button onclick="displayWorkouts()" class="text-indigo-600 hover:text-indigo-800 text-sm">
                    <i class="fas fa-arrow-left mr-1"></i>Show full view
                </button>
            </div>
        </div>
    `

  if (workouts.length === 0) {
    const div = document.createElement('div')
    div.className = 'col-span-full text-center py-12'
    div.innerHTML = `
            <i class="fas fa-filter text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">Tidak ada latihan ditemukan</h3>
            <p class="text-gray-500">Coba gunakan filter</p>
        `
    container.appendChild(div)
    return
  }

  workouts.forEach((workout) => {
    const div = document.createElement('div')
    div.className = 'bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500'

    let workoutHTML = ''


    if (filters.showType && workout.type) {
      workoutHTML += `
                <div class="mb-4">
                    <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">${workout.type}</span>
                    ${filters.showStatus && workout.status === 'terlaksana' ? '<i class="fas fa-check-circle text-green-500 text-xl float-right"></i>' : ''}
                </div>
            `
    }


    if (filters.showName && workout.name) {
      workoutHTML += `<h4 class="text-lg font-bold text-gray-800 mb-3">${workout.name}</h4>`
    }


    let detailsHTML = ''
    if (filters.showDuration && workout.duration) {
      detailsHTML += `<div><i class="fas fa-clock mr-2"></i>${workout.duration} min</div>`
    }
    if (filters.showDate && workout.date) {
      detailsHTML += `<div><i class="fas fa-calendar mr-2"></i>${new Date(workout.date).toLocaleDateString()}</div>`
    }
    if (filters.showStatus && workout.status) {
      detailsHTML += `<div><i class="fas fa-info-circle mr-2"></i>${workout.status}</div>`
    }

    if (detailsHTML) {
      workoutHTML += `
                <div class="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    ${detailsHTML}
                </div>
            `
    }


    workoutHTML += `
            <div class="flex flex-wrap gap-3">
                ${
                  filters.showStatus && workout.status !== 'terlaksana'
                    ? `<button onclick="updateStatus('${workout._id}')" class="flex-1 min-w-0 bg-green-100 text-green-700 py-3 px-4 rounded-lg hover:bg-green-200 transition font-semibold">
                        <i class="fas fa-check mr-2"></i>Selesai
                    </button>`
                    : ''
                }
                <button onclick="editWorkout('${workout._id}')" class="flex-1 min-w-0 bg-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-200 transition font-semibold">
                    <i class="fas fa-edit mr-2"></i>Edit
                </button>
                <button onclick="deleteWorkout('${workout._id}')" class="flex-1 min-w-0 bg-red-100 text-red-700 py-3 px-4 rounded-lg hover:bg-red-200 transition font-semibold">
                    <i class="fas fa-trash mr-2"></i>Hapus
                </button>
            </div>
        `

    div.innerHTML = workoutHTML
    container.appendChild(div)
  })
}
