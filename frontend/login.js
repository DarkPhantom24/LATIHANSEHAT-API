document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm')

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault()

    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value.trim()


    if (!email || !password) {
      showMessage('Please fill in all fields', 'error')
      return
    }

    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address', 'error')
      return
    }

    await loginUser(email, password)
  })
})

async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok && data.token) {
      saveUserSession(data.token, data.user)
      redirectToDashboard()
    } else {
      showMessage(data.error || 'Login failed. Please try again.', 'error')
    }
  } catch (error) {
    console.error('Login error:', error)
    showMessage('Network error. Please check your connection.', 'error')
  }
}
