import { Request, Response, Router } from 'express'
import { HttpExceptionHandler, ServiceUnavailableException, UnauthorizedException } from '../models/exception-http'
import { userService } from '../services/user-service'

const userController = Router()

/* criar um novo usuário */
userController.post('/', async (req: Request, res: Response) => {
   try {
      var response = await userService.createUser(req.body)
      res.status(200).json(response)
   } catch (err) { HttpExceptionHandler(res, err) }
})

/* buscar um determinado usuário */
userController.get('/:id', async (req: Request, res: Response) => {
   try {
      var response = await userService.findUserById(Number(req.params.id))
      res.status(200).json(response)
   } catch (err) { HttpExceptionHandler(res, err) }
})

/* deletar um determinado usuário */
userController.delete('/:email', async (req: Request, res: Response) => {
   try {
      var response = await userService.deleteUserById(Number(req.params.email))
      return res.status(200).json(response)
   } catch (err) { HttpExceptionHandler(res, err) }
})


export default userController