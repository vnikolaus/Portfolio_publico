import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    constructor() {}

    @Get('/ping')
    getPong(): string {
        return 'pong';
    }
}
