  import { MailerService } from "@nestjs-modules/mailer";
import { OnQueueActive, OnQueueCompleted, OnQueueProgress, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { UserDto } from "src/modules/users/users.dto";


@Processor('sendMail-queue')
export class SendMailConsumer {

  constructor(private mailService: MailerService) {}

  @Process('sendMail-job')
  async sendMailJob(job: Job<UserDto>){
    const {data} = job;
    
    try {
      await this.mailService.sendMail({
        to: data.email,
        from: 'Team Startup name',
        subject: 'Hello, welcome!!',
        text: `Hi ${data.name}, you registered successfully!`,
      });

      // Registro de sucesso (opcional)
      console.log(`Email enviado com sucesso para ${data.email}`);
    } catch (error) {
      // Registro de erro
      console.error(`Erro ao enviar e-mail para ${data.email}:`, error);
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`on Completed ${job.name}`);
  }

  @OnQueueProgress()
  onQueueProgress(job: Job) {
    console.log(`on Progress ${job.name}`);
  }

  @OnQueueActive()
  onQueueActive(job: Job) {
    console.log(`on active ${job.name}`);
  }
}