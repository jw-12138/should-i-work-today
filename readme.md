# 今日班否？

## 这是啥？

这是一个部署在 [Cloudflare workers](https://workers.cloudflare.com/) 上的 API，它会根据中国国务院发布的数据来确定今天是节假日还是补班。可以用在一些需要自动化的场景。

API 地址：

- 今儿上班吗

  ```http request
  GET https://siwt.jw1.dev/api/v1
  ```
  
- 明儿上班吗

  ```http request
  GET https://siwt.jw1.dev/api/v1/tomorrow
  ```

是的你没有看错，**什么参数都不用传**！服务端也已开启跨域！

输出示例：

- 上班
  ```json
  {
    "requestTime": {
      "text": "2023/7/6 10:36:45",
      "timestamp": 1688611005000
    },
    "requestedDate": {
      "timestamp": 1688697405000,
      "day": "星期五",
      "text": "2023/7/7 10:36:45"
    },
    "todayIs": "weekday",
    "shouldIWorkToday": true,
    "desc": "好累啊"
  }
  ```
  
- 周末
  ```json
  {
    "requestTime": {
      "text": "2023/7/6 10:38:28",
      "timestamp": 1688611108000
    },
    "requestedDate": {
      "timestamp": 1688783908000,
      "day": "星期六",
      "text": "2023/7/8 10:38:28"
    },
    "todayIs": "weekend",
    "shouldIWorkToday": false,
    "desc": "搞杯朗姆吃吃吧"
  }
  ```
  
- 节假日
  ```json
  {
    "requestTime": {
      "text": "2023/5/1 10:38:28",
      "timestamp": 1682908708000
    },
    "requestedDate": {
      "timestamp": 1682908708000,
      "day": "星期一",
      "text": "2023/5/1 10:38:28"
    },
    "todayIs": "off_day",
    "shouldIWorkToday": false,
    "desc": "好想出去旅行啊"
  }
  ```
  
- 调休补班
  ```json
  {
    "requestTime": {
      "text": "2023/6/25 10:38:28",
      "timestamp": 1687660708000
    },
    "requestedDate": {
      "timestamp": 1687660708000,
      "day": "星期天",
      "text": "2023/6/25 10:38:28"
    },
    "todayIs": "not_off_day",
    "shouldIWorkToday": true,
    "desc": "今天摸哪里的鱼呢"
  }
  ```

## 🚧⚠️ 注意注意注意

1. 本 API 依赖于 [holiday-cn](https://github.com/NateScarlet/holiday-cn)
   提供的数据（感谢！），如果 holiday-cn 项目不维护了，那这个服务也会挂。
2. 能自建的话尽量自建吧，毕竟 Workers 是有免费额度的，一天10万请求量，个人使用的话够够的。