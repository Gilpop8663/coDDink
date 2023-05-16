# 코띵크(coDDinK)

## <a href="https://www.coddink.com/">사이트 바로가기</a>

## 프로젝트 설명

개발자들이 포트폴리오를 올려 서로의 프로젝트를 구경할 수 있는 사이트를 만들고 싶었습니다.

## 실행 방법

### 0. 패키지 설치

```
yarn install
```

### 1. .env 파일 생성 후 키 입력하기

vercel에서 확인 가능!

```js
DATABASE_URL=

COOKIE_PASSWORD=
CLOUDFLARE_IMAGE_API_KEY=
CLOUDFLARE_STREAM_API_KEY=

CLOUDFLAR_ACCOUNT_ID=

NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_SECRET_PASSWORD=

NEXT_PUBLIC_FACEBOOK_APP_ID=
NEXT_PUBLIC_FACEBOOK_SECRET_CODE=

NEXT_PUBLIC_SITE_URL=https://www.coddink.com/

NEXT_PUBLIC_GOOGLE_ANALYTICS=
```

### 2. .env.development 파일 생성

vercel에서 확인 가능!

```js
DATABASE_URL=

COOKIE_PASSWORD=
CLOUDFLARE_IMAGE_API_KEY=
CLOUDFLARE_STREAM_API_KEY=
CLOUDFLAR_ACCOUNT_ID=


NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_SECRET_PASSWORD=


NEXT_PUBLIC_FACEBOOK_APP_ID=
NEXT_PUBLIC_FACEBOOK_SECRET_CODE=

NEXT_PUBLIC_SITE_URL=https://www.coddink.com/

NEXT_PUBLIC_GOOGLE_ANALYTICS=
```

### 3. pscale에 로그인 하기

```js
pscale login
```

### 4. pscale 데이터 베이스와 연결하기

```js
pscale connect carrot-market



배포 브런치  => mytutor

개발 브런치 => indexes
```

### 5. 연결하면 나오는 아이피를 .env에 연결

.env

```js
DATABASE_URL = 'mysql://${아이피}/carrot-market';
```

### 6. 실행

```js
yarn run dev
```

---
