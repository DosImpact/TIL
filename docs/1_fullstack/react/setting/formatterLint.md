

---
title: React Setting
---

정리 

	1. 프리티어가 아예 작동 안 할 때
예상 원인 : Problems 탭을 보고 확인, 이후 재설치



	2. 프리티어가 먹는데 자동 포멧팅이 안될때
	예상 원인 : save on format : true 확인


	예상 원인 : 기본 포멧터 설정이 뭐로 되어있나 확인
	- prettier 설치되고 오류도 인지하는데, 이상하게 작동이 안된다. 알고보니 다른 포멧터가 기본으로 셋되어 있다.


"editor.codeActionsOnSave": {
      // For ESLint
      "source.fixAll.eslint": true
    },
    "[typescript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },

출처: <https://github.com/microsoft/vscode/issues/108447> 

	3. 프리 티어 상세 오류

원인 : 맥은 LF, 윈도우는 CR 을 원해서 충돌날때 # 오류 - CRLF,LF
	- 맥은 CR도 ok 하지만 까탈스럽게 맥에서 LF로 저장하면 윈도우에서 오류
	- 해결 : 자동 endOfLine

https://noogoonaa.tistory.com/62



module.exports = {
  extends: ['react-app', 'prettier', 'plugin:prettier/recommended', 'plugin:@typescript-eslint/eslint-recommended'],
  plugins: ['react', 'prettier', '@typescript-eslint'],
  env: {
    browser: true,
    jest: true
  },
  rules: {
    camelcase: 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ]
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect'
    }
  },
  parser: 'babel-eslint'
}

원인 : Replace `··` with `↹`
	- 윈도랑 맥이랑 띄어쓰기?탭? 을 주는 방식이 다른가봄
	- 자동 포멧팅 해결

원인 : 쌍따움표 , 싱글쿼드 
	-  "singleQuote": true 




  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },

{
  "useTabs": false,
  "singleQuote": true,
  "trailingComma": "all"
}


---

 ## 포멧터 적용 안됄때

	1. save on format 확인
	2. foramat with 무엇으로 셋팅되어 있는지 확인 - 프리티어, 기본TS,JS 포멧터, 뷰리파이 등 누가 오버라이딩 중인지 모른다. 



## VS Code 프리티어가 안됄때

https://stackoverflow.com/questions/52586965/why-prettier-does-not-format-code-in-vscode/62826397#62826397


##
윈도우 맥 같이 사용할때 프리티어 오류
https://simsimjae.medium.com/vscode%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%A0%EB%95%8C-%EC%9C%88%EB%8F%84%EC%9A%B0%EC%9D%98-crlf%EC%99%80-%EB%A7%A5%EC%9D%98-lf-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0-51ba3fb76cc3

##





##  디폴트 포멧터 오류 - 파이썬 노드 충돌
https://github.com/microsoft/vscode/issues/108447#issuecomment-707609648
	- vscode setting에 블랙으로 셋팅되어 있으니
	python만 포멧팅이 되고 js,ts는 안먹더라

	- 반대로 prettier 셋팅 되어 있으면 python은 포멧팅이 안되더라

	- 주의 : python과 node를 연결하는 프로젝트에서 발생

	
## 포멧터 이후에도 계속 프리티어가 작동 안함 
	- format on save 해도 , 다른 포멧터로 되더라.
	- 알고보니 settings.json이 오버라이드? 하는중

Replace `··` with `↹`


  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "jupyter.sendSelectionToInteractiveWindow": false,
  "material-icon-theme.activeIconPack": "nest",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },



