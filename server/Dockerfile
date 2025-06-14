# Node.js 공식 이미지 사용 (버전은 프로젝트에 맞게 조정)
FROM node:20

# 앱 디렉토리 생성
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드 (NestJS는 dist 폴더 생성)
RUN npm run build

# 3000 포트 오픈
EXPOSE 3000

# 앱 실행
CMD ["npm", "run", "start:prod"]