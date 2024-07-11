import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AppHandler {

    @MessagePattern({cmd: 'add'})
    async add(numbers: number[]): Promise<number> {
        return numbers.reduce((p,c)=>p+c,0)
    }
}