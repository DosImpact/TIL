---
title: NestJS python 연동
---

## python-shell
https://www.npmjs.com/package/python-shell
https://maruzzing.github.io/study/nodejs/node.js%EC%97%90%EC%84%9C-python-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0/


---

# NestJS 커스텀 파이썬 실행 커스텀 모듈 만들기
```js
	1. 커스텀 모둘 선언
	-옵션 인터페이스
	-app 모듈장착 with options
	
	
	2. 파이썬 자식 프로세스 생성 및 이벤트 핸들링

	- 기본 파이썬 쉘 로직
	1. 파이썬 쉘 생성 ( 순수 이벤트 드리븐 로직 )
	- stdin 넣기, message 받기 이벤트, 종료 이벤트

( 이벤트 드리븐 Wrapping 하기 )
	2. 하지만 위 과정은 이벤트 드리븐으로 API request가 종료 이벤트 드리븐까지 기다릴 수 없다.
	종료 이벤트 드리븐이 안나오는 경우도 있으니까.
	
	1번의 과정을 하나의 Promise객체로 Wrapping 해야한다.
	- reject 되는 경우 : 입출력 애러, 파일경로 애러, 등등
	- resolve 되는 경우 : 무사히 종료 이벤트가 드리븐 되었을때 

https://stackoverflow.com/questions/58871017/javascript-is-not-waiting-till-the-python-execution-is-completed

```
## 한계 
	- 30초 이내에 실행되는 파이썬 가능 ( http 대기 시간이 넘어가면 소켓이 끊긴다. )

---

# 1 파이썬 쉘 커스텀 모듈 만들기

	- 파이썬 쉘의 옵션을 상속받아서 그대로 사용하고  
	- 나중에 있을 확장에 대비합니다.  
```js
import { Options } from 'python-shell';

export interface PyShellModuleOptions extends Options {
  maintainer?: string;
}

export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';


export interface ExePyInput {
  filename: string;
  args?: string[];
  inputs?: string[];
}
export interface ExePyOutput {
  ok: boolean;
  error?: string;
  result?: string[];
}
```



	- 옵션값을 제공, 서비스 제공 
```js
import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.interface';
import { PyShellModuleOptions } from './py-shell.interface';
import { PyShellService } from './py-shell.service';

@Module({})
@Global()
export class PyShellModule {
  static forRoot(pyShellModuleOptions: PyShellModuleOptions): DynamicModule {
    return {
      module: PyShellModule,
      exports: [PyShellService],
      providers: [
        { provide: PyShellService, useClass: PyShellService },
        {
          provide: CONFIG_OPTIONS,
          useValue: pyShellModuleOptions,
        },
      ],
    };
  }
}
```


	- app 모듈에 장착합니다.
```js
	PyShellModule.forRoot({
		mode: 'text',
		pythonPath: '/usr/bin/python',
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: 'py',
	}),
	
	
```


## 2 파이썬 실행함수 로직
	- 이벤트 드리븐 방식은 , 파이썬 종료 이벤트까지 기다려 주게끔 프로미스 객체로 Wrapping 해야한다.  

2.1 순수 이벤트 드리븐 로직  
2.2 Promise Wrapping 로직  


2.1 


	- 

```js
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.interface';
import { PyShellModuleOptions } from './py-shell.interface';
import { PythonShell } from 'python-shell';

@Injectable()
export class pyShellService {
	constructor(
	@Inject(CONFIG_OPTIONS)
	private readonly config: PyShellModuleOptions,
) {
		PythonShell.runString('x=1+1;print(x)', null, function (err) {
			if (err) throw err;
				console.log('x=1+1 finished');
		});
		
		
		PythonShell.run('hello.py', config, function (err) {
			if (err) throw err;
				console.log('hello finished');
		});
		
		
		
		const pyshell = new PythonShell('hello.py', config);
		
		// sends a message to the Python script via stdin
		pyshell.send('hello');
		
		pyshell.on('message', function (message) {
			// received a message sent from the Python script (a simple "print" statement)
			console.log(message);
		});
		// end the input stream and allow the process to exit
		pyshell.end(function (err, code, signal) {
			if (err) throw err;
			console.log('The exit code was: ' + code);
			console.log('The exit signal was: ' + signal);
			console.log('finished');
		});
		
	}
	
	async hello() {
		PythonShell.run('hello.py', {});
	}
}
```



	- promise객체로 wrapping 함
```js
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.interface';
import {
  ExePyInput,
  ExePyOutput,
  PyShellModuleOptions,
} from './py-shell.interface';
import { PythonShell } from 'python-shell';

@Injectable()
export class PyShellService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly config: PyShellModuleOptions,
  ) {}
  // 30초 이상 걸리는 await 라면 ?
  async exePy({ args, filename, inputs }: ExePyInput): Promise<ExePyOutput> {
    // 기존 코드 ,파이썬 실행 - 메시지 보내기, 이벤트 드리븐 : 메시지 받기 이벤트, 종료 이벤트
    // API wrapping 하려면
    // Promise객체를 생성 - 그 안에서 종료 이벤트를 받으면 리턴
    try {
      const { result, sucess, error } = await new Promise<{
        sucess: boolean;
        error?: string;
        result: string[];
      }>((res, rej) => {
        const pyShell = new PythonShell(filename, {
          ...this.config,
          args,
        });
        const outputs = Array<string>();
        for (const ins of inputs) {
          pyShell.send(ins);
        }
        pyShell.on('message', (message) => {
          if (message) outputs.push(String(message).trim());
        });
        pyShell.end((err, code, signal) => {
          res({ sucess: true, result: outputs });
        });
        // 그외 예외 처리
        // 정상 종료이여도 pyShell.end 이벤트랑 충돌
        // pyShell.on('close', () => {
        //   console.log('close event', outputs);
        //   rej({ sucess: false, error: 'closed' });
        // });
        pyShell.on('error', (error) => {
          console.log('error event', outputs);
          rej({ sucess: false, error: error.message });
        });
        pyShell.on('stderr', (error) => {
          console.log('stderr event');
          rej({ sucess: false, error: 'stderr' });
        });
      });
      if (sucess) {
        return {
          ok: true,
          result,
        };
      }
      return {
        ok: false,
        error,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}

```

