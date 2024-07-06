// import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
// //import { AppService } from './app.service';
// import { SwapiEndpoints } from './shared/utils';
// import { ApiOperation } from '@nestjs/swagger';
// import { LocalAuthGuard } from './auth/guards/local-auth.guard';
// import { AuthService } from './auth/auth.service';

// @Controller()
// export class AppController {
//   constructor(
//     private authService: AuthService,
//     //private readonly appService: AppService,
//   ) {}

//   // @Get()
//   // @ApiOperation({ summary: 'Get all the API resources' })
//   // async getRootResource(): Promise<SwapiEndpoints> {
//   //   return this.appService.getRootResource()
//   // }

//   @UseGuards(LocalAuthGuard)
//   @Post('auth/login')
//   async login(@Request() req) {
//     return this.authService.signIn(req.user)
//   }
// }
