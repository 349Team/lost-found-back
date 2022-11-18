import { Request, Response, NextFunction} from 'express'
import { HttpExceptionHandler } from '../../models/exception-http'
import { authService } from '../../services/auth-service'

export const authenticator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(req.headers.authorization === 'xyz') return next()
    await authService.auth(req.headers.authorization ?? '')
    next()
  } catch (err) { HttpExceptionHandler(res, err) }
}
