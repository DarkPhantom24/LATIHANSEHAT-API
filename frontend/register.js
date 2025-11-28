document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.getElementById('registerForm')

  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault()

    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value.trim()


    if (!name || !email || !password) {
      showMessage('Please fill in all fields', 'error')
      return
    }

    if (name.length < 2) {
      showMessage('Name must be at least 2 characters long', 'error')
      return
    }

    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address', 'error')
      return
    }

    if (!validatePassword(password)) {
      showMessage('Password must be at least 6 characters long', 'error')
      return
    }

    await registerUser(name, email, password)
  })
})

async function registerUser(name, email, password) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()

    if (response.ok && data.token) {
      saveUserSession(data.token, data.user)
      redirectToDashboard()
    } else {
      showMessage(data.error || 'Registration failed. Please try again.', 'error')
    }
  } catch (error) {
    console.error('Registration error:', error)
    showMessage('Network error. Please check your connection.', 'error')
  }
}
