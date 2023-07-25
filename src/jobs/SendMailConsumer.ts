import { MailerService } from "@nestjs-modules/mailer";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { UserDto } from "src/modules/users/users.dto";


@Processor('sendMail-queue')
export class SendMailConsumer {

  constructor(private mailService: MailerService) {}

  @Process('sendMail-job')
  async sendMailJob(job: Job<UserDto>){
    const {data} = job;

    await this.mailService.sendMail({
      to: data.email,
      from: 'Team Startup name',
      subject: 'Hello, welcome!!',
      text: `Hi ${data.name}, you register will make with success! `,
    });
  }
}