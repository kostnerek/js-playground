import { Body, Controller, Get, Inject } from "@nestjs/common";
import { Client, ClientProxy, Transport } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Controller('calculator')
export class CalculatorController {
    constructor(@Inject('CALCULATOR_SERVICE') private client: ClientProxy) {}
    
    @Get('add')
    async add(@Body() body: {numbers: number[]}) {
        const result = this.client.send<number>({cmd: 'add'}, body.numbers)
        return await firstValueFrom(result);
    }
}