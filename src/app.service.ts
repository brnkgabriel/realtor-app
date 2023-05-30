import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService { 
  hello() {
    return 'Hello World'
  }
}

// 1) Install Postfres on local machine
// 2) Host Postgres in cloud
