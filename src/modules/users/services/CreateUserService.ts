import { hash } from "bcryptjs";
import { injectable, inject } from 'tsyringe';

import AppError from "@shared/errors/AppError";

import IUsersRepository from '../repositories/IUsersRepository';
import User from "../infra/typeorm/entities/User";

interface IRequest {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {

    constructor(@inject('UsersRepository') private usersRepository: IUsersRepository) {}

    async execute({ name, email, password }: IRequest): Promise<User> {

        const checkUserExists = await this.usersRepository.findByEmail(email); // Verifica se já tem um email cadastrado
        if (checkUserExists) {
            throw new AppError("Email address already used.");
        }

        const hashedPassword = await hash(password, 8); // Faz a criptografia da senha
        const user = await this.usersRepository.create({ name, email, password: hashedPassword }); // Armazena o objeto criado na variável user
        return user; // e retorna o usuário
    }
}

export default CreateUserService;