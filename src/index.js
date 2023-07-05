import {Router, json, error, createCors} from 'itty-router'

const router = Router()
const {preflight, corsify} = createCors()

const at_work_sentences = [
  '「国粹」',
  '要不删库跑路吧',
  '让我写js，还是让我去死，这是个问题',
  '今天摸哪里的鱼呢',
  '生产队的驴休息了吗？',
  '今天应该不加班了吧',
  '这个bug怎么就解决不了呢',
  '工作太苦，我想吃点甜的',
  '代码提交了，先去搞杯咖啡',
  '有人看见我的电脑了吗',
  '这个需求真的实现不了',
  '好累啊',
  '还有几天放假呢？',
  '同事们都好厉害，我好菜啊',
  '我发誓这代码昨天还是好好的'
]

const at_home_sentences = [
  '芜湖~',
  '今天玩啥游戏呢',
  '晚上要不约个饭吧',
  '今天也是赖床的一天',
  '打本吗朋友',
  '搞杯朗姆吃吃吧',
  '好想出去旅行啊',
  '天气不错，出去散散步？',
  '看看有啥好看电影',
  '无聊炸了',
  '一天就这么过去了',
  '老子今天不上班，爽翻',
  '今天啥计划呢',
  '喜欢一个人的时候，心情真的很好'
]

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomSentence(shouldWork) {
  if (shouldWork) {
    let random_index = getRandomInt(0, at_work_sentences.length - 1)
    return at_work_sentences[random_index]
  } else {
    let random_index = getRandomInt(0, at_home_sentences.length - 1)
    return at_home_sentences[random_index]
  }
}

async function getOffDays(year) {
  let nextYear = year + 1
  let thisYearOffDays = null

  try {
    thisYearOffDays = await fetch('https://cdn.jsdelivr.net/gh/NateScarlet/holiday-cn@master/' + year + '.json')
  } catch (e) {
    console.log(e)
    throw new Error('获取节假日失败')
  }

  let nextYearOffDays = null
  try {
    nextYearOffDays = await fetch('https://cdn.jsdelivr.net/gh/NateScarlet/holiday-cn@master/' + nextYear + '.json')
  } catch (e) {
    console.log(e)
    throw new Error('获取节假日失败')
  }

  let thisYearOffDaysJson = await thisYearOffDays.json()
  let nextYearOffDaysJson = await nextYearOffDays.json()

  return thisYearOffDaysJson.days.concat(nextYearOffDaysJson.days)
}

async function getRealTime() {
  let time = ''
  try {
    time = await fetch('https://worldtimeapi.org/api/timezone/Asia/Shanghai')
  } catch (e) {
    console.log(e)
    throw new Error('获取时间失败')
  }

  return await time.json()
}

async function makeResponse() {
  // get time
  console.log('getting time ...')
  let time = await getRealTime()
  console.log(time)

  // get date object from time
  let dateObj = new Date(time.datetime)

  // get full year
  let fullYear = dateObj.getFullYear()

  // get off days
  console.log('getting off days ...')
  let offDays = await getOffDays(fullYear)

  // yyyy-MM-dd
  let today = dateObj.toISOString().split('T')[0]

  let todayIsOffDay = null
  offDays.forEach((day) => {
    if (day.date === today) {
      todayIsOffDay = day.isOffDay
    }
  })

  let resText = ''
  let shouldIWork = false // wish this won't change bruh

  if (todayIsOffDay === null) {
    if (dateObj.getDay() === 0 || dateObj.getDay() === 6) {
      // weekend
      // go touch some grass
      console.log('weekend')
      resText = 'weekend'
      shouldIWork = false
    } else {
      // weekday
      console.log('weekday')
      resText = 'another day in the office'
      shouldIWork = true
    }
  } else if (typeof todayIsOffDay === 'boolean') {
    if (todayIsOffDay) {
      // play some games, Zelda maybe?
      console.log('off day, should be home')
      resText = 'off day'
      shouldIWork = false
    } else {
      // should be at work, :)
      console.log('not off day, should be at work')
      resText = 'not off day'
      shouldIWork = true
    }
  }

  return {
    todayIs: resText,
    shouldIWorkToday: shouldIWork,
    desc: getRandomSentence(shouldIWork)
  }
}

router.all('*', preflight)

router.get('/', () => {
  return new Response('Hello there!')
})

router.get('/api/v1', async () => {
  let res = await makeResponse()

  return json(res)
})

router.get('*', () => error(404))

export default {
  fetch: (req, ...args) => router
    .handle(req, ...args)
    .then(json)
    .catch(error)
    .then(corsify)
}
