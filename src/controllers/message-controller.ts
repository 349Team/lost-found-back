import { messageService } from './../services/message-service';
import { Request, Response, Router } from 'express'
import { HttpExceptionHandler, ServiceUnavailableException, UnauthorizedException } from '../models/exception-http'

const messageController = Router()

// Cria mensagem
messageController.post('/send/:idA/:idB', async (req: Request, res: Response) => {
    try {
        var response = await messageService.createMessage(req.body)
        console.log(response);
        
        res.status(201).json(response)
    }catch (err) { HttpExceptionHandler(res, err) }
})

// Lista mensagens do usuário A e B
// messageController.get('/:idA/:idB', async (req: Request, res: Response) => {
//     try {
//         var response = await messageService.findMessages(Number(req.params.idA), Number(req.params.idB))
//         res.status(201).json(response)
//     }catch (err) { HttpExceptionHandler(res, err) }
// })

export default messageController