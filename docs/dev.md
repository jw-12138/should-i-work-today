# 开发指南

## 环境要求

- [Bun](https://bun.sh/) >= 1.0
- [Cloudflare](https://www.cloudflare.com/) 账号（用于部署）

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/jw-12138/should-i-work-today.git
cd should-i-work-today

# 安装依赖
bun install

# 启动开发服务器
bun run dev
```

开发服务器默认运行在 `http://localhost:4011`。

## 环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

### 可选配置

| 变量 | 说明 | 必须 |
|------|------|------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | 否 |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST Token | 否 |

**注意**：Redis 缓存是可选的。如果不配置，API 会直接请求 GitHub 获取节假日数据。配置后可以减少对 GitHub 的请求频率（缓存 TTL 为 1 小时）。

## 项目结构

```
src/
├── index.ts              # 入口文件，路由定义
├── types/
│   └── index.ts          # TypeScript 类型定义
├── constants/
│   └── index.ts          # 常量（星期映射、随机文案）
├── utils/
│   └── index.ts          # 工具函数
├── services/
│   ├── cache.ts          # Redis 缓存服务
│   └── holiday.ts        # 节假日数据服务
└── handlers/
    ├── v1.ts             # v1 接口处理器
    └── v2.ts             # v2 接口处理器
```

## 可用脚本

```bash
# 本地开发
bun run dev

# 生成 TypeScript 类型
bun run typegen

# 同步 secrets 到 Cloudflare
bun run sync-secrets

# 部署到 Cloudflare Workers
bun run deploy
```

## 部署

### 首次部署

1. 登录 Cloudflare：
   ```bash
   bunx wrangler login
   ```

2. （可选）配置 Redis secrets：
   ```bash
   bun run sync-secrets
   ```

3. 部署：
   ```bash
   bun run deploy
   ```

### 后续更新

```bash
bun run deploy
```

## 数据来源

节假日数据来自 [holiday-cn](https://github.com/NateScarlet/holiday-cn)，该项目根据国务院发布的放假通知维护节假日数据。
