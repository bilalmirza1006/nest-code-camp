import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";



@Injectable()
export class jwtStartegy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService,private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('jWT_SECRET')
        });
    }
    async validate(payload: {sub: number,email: string}) {
        const user = await this.prisma.user.findUnique({
            where:{
                id:payload.sub
            }
        })
        delete user.hash
        console.log('foosubfo', payload);
        return user;

    }
}







// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";



// @Injectable()
// export class jwtStartegy extends PassportStrategy(Strategy, 'jwt') {
//     constructor(config: ConfigService) {
//         super({
//           jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extract Bearer token from Authorization header
//           secretOrKey: config.get('JWT_SECRET'),  // Secret key used for validation
//         });
//       }
    
//       validate(payload: any) {
//         // The payload is the decoded JWT, return user information to be attached to req.user
//         return { userId: payload.sub, email: payload.email };
//       }
// }