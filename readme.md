# Should I Work Today

中国节假日工作日判断 API，根据国务院发布的节假日安排数据，判断指定日期是否为工作日。

## API 接口

部署在 [Cloudflare Workers](https://workers.cloudflare.com/) 上，已开启跨域支持。

Base URL: `https://siwt.jw1.dev`

### 查询今天

```http
GET /api/v2
```

### 查询明天

```http
GET /api/v2/tomorrow
```

### 响应格式

```json
{
  "requestedDate": {
    "timestamp": 1768375079202,
    "day": "星期三",
    "text": "2026/1/14 15:17:59"
  },
  "needToWork": true
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `requestedDate.timestamp` | number | 查询日期的时间戳（毫秒） |
| `requestedDate.day` | string | 星期几 |
| `requestedDate.text` | string | 格式化的日期时间 |
| `needToWork` | boolean | 是否为工作日 |

### 旧版接口

[v1 接口文档](./docs/v1.md)

## 数据来源

本项目依赖 [holiday-cn](https://github.com/NateScarlet/holiday-cn) 提供的节假日数据。

## 自建部署

详见 [开发指南](./docs/dev.md)。

Workers 免费额度：每日 10 万次请求。
