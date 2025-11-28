/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const LatihanController = () => import('#controllers/latihan_controller')
const GraphqlController = () => import('#controllers/graphql_controller')

router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router.post('/logout', [AuthController, 'logout'])

router.get('/users', [UsersController, 'index'])
router.delete('/users/:id', [UsersController, 'destroy'])

router
  .group(() => {
    router.post('/latihan', [LatihanController, 'store'])
    router.get('/latihan', [LatihanController, 'index'])
    router.put('/latihan/:id', [LatihanController, 'update'])
    router.delete('/latihan/:id', [LatihanController, 'destroy'])
  })
  .use(middleware.auth())

router.post('/graphql', [GraphqlController, 'query']).use(middleware.auth())
