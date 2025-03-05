# Conversation Web App Template

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Config App

Create a file named `.env.local` in the current directory and copy the contents from `.env.example`. Setting the following content:

```
# APP ID: This is the unique identifier for your app. You can find it in the app's detail page URL. 
# For example, in the URL `https://cloud.dify.ai/app/xxx/workflow`, the value `xxx` is your APP ID.
NEXT_PUBLIC_APP_ID=

# APP API Key: This is the key used to authenticate your app's API requests. 
# You can generate it on the app's "API Access" page by clicking the "API Key" button in the top-right corner.
NEXT_PUBLIC_APP_KEY=

# APP URL: This is the API's base URL. If you're using the Dify cloud service, set it to: https://api.dify.ai/v1.
NEXT_PUBLIC_API_URL=
```

Config more in `config/index.ts` file:

```js
export const APP_INFO: AppInfo = {
  title: 'Chat APP',
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'zh-Hans'
}

export const isShowPrompt = true
export const promptTemplate = ''
```

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using Docker

```
docker build . -t <DOCKER_HUB_REPO>/webapp-conversation:latest
# now you can access it in port 3000
docker run -p 3000:3000 <DOCKER_HUB_REPO>/webapp-conversation:latest
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.registry "https://registry.npmmirror.com/"

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

> ⚠️ If you are using [Vercel Hobby](https://vercel.com/pricing), your message will be truncated due to the limitation of vercel.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 新增功能

### 语音输入

本项目现在支持语音输入功能，允许用户通过语音与AI助手交流：

- 点击输入框旁边的麦克风图标开始语音输入
- 说话完成后，点击停止按钮或等待自动识别完成
- 识别的文本会自动添加到输入框中
- 支持中文语音识别（默认）

#### 浏览器兼容性

语音输入功能使用Web Speech API，支持的浏览器包括：

- Chrome (桌面版和移动版)
- Edge
- Safari (iOS和macOS上最新版本)
- Firefox (部分支持)

#### 权限要求

首次使用时，浏览器会请求麦克风访问权限。用户需要允许访问才能使用语音输入功能。

## PWA和Android应用打包指南

### 将网站转换为Android应用（TWA方案）

1. **确保网站符合PWA标准**

   - 添加manifest.json（已完成）
   - 实现Service Worker（已完成）
   - 添加适当的图标（已完成）
2. **安装必要的工具**

   ```bash
   # 安装Bubblewrap CLI
   npm install -g @bubblewrap/cli

   # 确保已安装JDK 17
   brew install openjdk@17
   sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
   export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
   ```
3. **创建数字签名密钥**

   ```bash
   mkdir -p signing-keys
   keytool -genkey -v -keystore signing-keys/wisdom-island-key.keystore -alias wisdom-island -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=您的姓名, OU=Development, O=Wisdom Island, L=Unknown, ST=Unknown, C=CN" -storepass password -keypass password
   ```
4. **初始化TWA项目**

   ```bash
   mkdir -p twa-app
   cd twa-app
   bubblewrap init --manifest https://wisdom-island.vercel.app/manifest.json
   ```

   按照提示完成配置：

   - 应用名称: 智慧岛
   - 短名称: 智慧岛
   - 包名: com.derek2035.wisdomisland
   - 版本: 1.0.0
   - 启动URL: https://wisdom-island.vercel.app/
   - 签名密钥位置: ../signing-keys/wisdom-island-key.keystore
   - 密钥别名: wisdom-island
   - 密钥密码: (您设置的密码)
   - 密钥库密码: (您设置的密码)
5. **构建Android应用**

   ```bash
   bubblewrap build
   ```
6. **生成的APK文件将位于**

   ```
   ./app-release-signed.apk
   ```

### 使用Capacitor构建Android应用（替代方案）

1. **安装Capacitor**

   ```bash
   yarn add @capacitor/cli @capacitor/core @capacitor/android
   ```
2. **初始化Capacitor项目**

   ```bash
   npx cap init 智慧岛 com.derek2035.wisdomisland
   ```
3. **配置Capacitor**
   在 `capacitor.config.ts`中：

   ```typescript
   import { CapacitorConfig } from '@capacitor/cli';

   const config: CapacitorConfig = {
     appId: 'com.derek2035.wisdomisland',
     appName: '智慧岛',
     webDir: 'out',
     server: {
       androidScheme: 'https',
       cleartext: true
     },
     android: {
       buildOptions: {
         releaseType: 'AAB'
       }
     }
   };

   export default config;
   ```
4. **构建Web应用**

   ```bash
   yarn build
   ```
5. **同步到Android平台**

   ```bash
   yarn cap sync android
   ```
6. **构建Android应用**

   ```bash
   yarn cap build android
   ```
   或使用Android Studio打开项目：

   ```bash
   yarn cap open android
   ```
   然后使用Android Studio构建应用。
