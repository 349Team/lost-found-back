import { Request, Response,  Router } from 'express'
import { HttpExceptionHandler } from '../models/exception-http'
import { authService } from '../services/auth-service'

const authController = Router()

/* enpoint login */
authController.post('/login', async (req: Request, res: Response) => {
  try {
    var response = await authService.login(req.body)
    res.status(200).json(response)
  } catch (err) { HttpExceptionHandler(res, err) }
})

/* realizar authenticação do usuário: verifica validade e autenticidade do token jwt */
authController.post('/me', async (req: Request, res: Response) => {
  try {
    await authService.auth(req.body.token)
    res.sendStatus(200)
  } catch (err) { HttpExceptionHandler(res, err) }
})

authController.post('/logout', async (req: Request, res: Response) => {
  try {
    await authService.logout(req.body.token)
    res.sendStatus(200)
  } catch (err) { HttpExceptionHandler(res, err) }
})

export default authController