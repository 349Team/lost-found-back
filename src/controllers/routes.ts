import { Router } from 'express'

import authController from './auth-controller'
import userController from './user-controller'
import objectController from './object-controller'
import imageController from './image-controller'
import tagController from './tag-controller'
import messageController from './message-controller'
import { authenticator } from '../middleware/auth/authenticator'

const routes = Router()

routes.use('/auth', authController)
routes.use('/user', userController)
routes.use('/object', authenticator, objectController)
routes.use('/images', imageController)
routes.use('/tag', tagController)
routes.use('/message', messageController)

export default routes
