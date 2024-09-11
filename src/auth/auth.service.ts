import { argon2d } from 'argon2';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    signup(dto : AuthDto) {
        const hash = await argon2d
        return 'I am signup';
    }

    signin() {
        return 'I am signin';
    }
}

