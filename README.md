# Ongil

## 1. Setting

```bash
# Install dependencies
yarn install

# Start development server
yarn run dev

# Build for production
yarn build

# Run tests
yarn test
```

## 2. Project Structure

```
realconnect/
├── node_modules/    
├── public/          
├── src/
│   ├── assets/             
│   ├── components/
│   ├── hooks/ 
│   ├── pages/ 
│   ├── styles/
│   ├── types/          
│   ├── App.tsx
│   ├── main.tsx       
│   └── routes.tsx     
├── package.json
├── index.html
├── vite.config.ts
└── README.md        
```

## 3. Commit Convention

### Example:
```bash
ex) feat: 로그인 기능 추가
```

- feat: 새로운 기능 추가
- add: 새로운 파일 추가
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 스타일 변경 (포맷팅, 세미콜론 추가 등)
- refactor: 코드 리팩토링 (기능 수정 없이 코드 개선)
- test: 테스트 추가/수정
- chore: 기타 작업 (빌드 프로세스, 의존성 업데이트 등)
- hotfix: 긴급 버그 수정

### 추가 규칙(선택 사항)
커밋 메시지의 본문에 추가적인 설명이 필요한 경우 추가합니다.

```bash
git commit -m "feat: 로그인 기능 추가

로그인 기능을 추가하여 사용자가 이메일과 비밀번호로 로그인할 수 있습니다.
이 기능은 세션 관리와 함께 작동합니다."
```
