# 今日班否？

## 这是啥？

这是一个部署在 [Cloudflare workers](https://workers.cloudflare.com/) 上的 API，它会根据中国国务院发布的数据来确定今天是节假日还是补班，可以用在一些需要自动化的场景。

API 地址：

```http request
GET https://siwt.jw1.dev/api/v1
```

是的你没有看错，**什么参数都不用传**！服务端也已开启跨域！

输出示例：

- 上班
  ```json
  {
    "requestTime": "<请求时间>",
    "todayIs": "weekday",
    "shouldIWorkToday": true,
    "desc": "要不删库跑路吧"
  }
  ```
- 周末
  ```json
  {
    "requestTime": "<请求时间>",
    "todayIs": "weekend",
    "shouldIWorkToday": false,
    "desc": "搞杯朗姆吃吃吧"
  }
  ```
- 节假日
  ```json
  {
    "requestTime": "<请求时间>",
    "todayIs": "off_day",
    "shouldIWorkToday": false,
    "desc": "天气不错，出去散散步？"
  }
  ```
- 调休补班
  ```json
  {
    "requestTime": "<请求时间>",
    "todayIs": "not_off_day",
    "shouldIWorkToday": true,
    "desc": "这个需求真的实现不了"
  }
  ```

## 🚧⚠️ 注意注意注意

1. 本 API 依赖于 [holiday-cn](https://github.com/NateScarlet/holiday-cn)
   提供的数据（感谢！），如果 holiday-cn 项目不维护了，那这个服务也会挂。
2. 能自建的话尽量自建吧，毕竟 Workers 是有免费额度的，一天10万请求量，个人使用的话够够的。
