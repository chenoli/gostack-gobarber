import { container } from 'tsyringe';
import { Request, Response } from 'express';

import SendPasswordRecoveryEmailService from '@modules/users/services/SendPasswordRecoveryEmailService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendPasswordRecoveryEmailService = container.resolve(
      SendPasswordRecoveryEmailService,
    );

    await sendPasswordRecoveryEmailService.execute({
      email,
    });

    return response.status(204).send();
  }
}
