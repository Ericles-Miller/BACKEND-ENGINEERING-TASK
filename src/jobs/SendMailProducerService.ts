import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { UserDto } from "src/modules/users/users.dto";


@Injectable()
export class SendMailProducerService {

  constructor(
    @InjectQueue('sendMail-queue') 
    private queue: Queue
  ) {}

  async sendMail(user: UserDto) {
    await this.queue.add("sendMail-job", user, {
      
    })
  }
}