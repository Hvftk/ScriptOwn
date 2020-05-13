/*
name: 10010 sign
auth: pq
Create At 2020-03-06

USAGE：
1. 打开联通手机营业厅，点击签到
[task_local]
1 0 * * * path/10010.js
[rewrite_local]
^https://act.10010.com/SigninApp(*.?)/signin/(querySigninActivity|daySign).(htm|do) url script-request-header own/myQx/js/10010.js
MITM = act.10010.com
*/

// common func
const commonFunc = {
  isRequest: () => {
    return typeof $request != "undefined";
  },
  getUrl: () => {
    return $request.url;
  },
  getHeader: () => {
    return $request.headers;
  },
  setData: (key, value) => {
    $prefs.setValueForKey(value, key);
  },
  getData: key => {
    return $prefs.valueForKey(key) || '{}';
  },
  notify: (titile = "", subTitle = "", content = "") => {
    $notify(titile, subTitle, content);
  },
  done: () => {
    typeof $request != "undefined" ? $done({}) : "";
  },
  get: (params, callback) => {
    params["method"] = "GET"
    $task.fetch(params).then(res => {
      callback(null, res, res.body)
    }, err => callback(err.error, null, null))
  },
  post: (params, callback) => {
    params["method"] = "POST"
    $task.fetch(params).then(res => {
      callback(null, res, res.body)
    }, err => callback(err.error, null, null))
  }
};

// main func
class ChinaUnicom {
  config() {
    return {
      querySignUrl: "querySignUrl",
      querySignHeader: "querySignHeader",
      doSignHeader: "doSignHeader",
      needUrl: {
        // 获取签到必须参数route, jsessionid
        querySignUrl: "querySigninActivity.htm",
        // 签到
        doSignSuffix: "daySign",
        doSignUrl: "https://act.10010.com/SigninApp/signin/daySign",
        rewardUrl: 'rewardReminder.do'
      },
      content: {
        refreshContent: '获取Refresh Token成功 🎉',
        cookieContent: '获取Cookie成功 🎉',
        successContent: '签到结果: 成功 🎉',
        failContent: '签到结果: 失败 ⚠️',
        unkonwnContent: '签到结果: 已签到或cookie失效 ⚠️'
      }
    };
  }
  getCookie() {
    const { needUrl, querySignHeader, doSignHeader, querySignUrl, content } = this.config();
    if (commonFunc.getUrl().match(needUrl.querySignUrl)) {
      commonFunc.setData(querySignHeader, JSON.stringify(commonFunc.getHeader()));
      commonFunc.setData(querySignUrl, commonFunc.getUrl());
      commonFunc.notify("中国联通", "", content.refreshContent);
    }
    if (commonFunc.getUrl().match(needUrl.doSignSuffix) || commonFunc.getUrl().match(needUrl.rewardUrl)) {
      commonFunc.setData(doSignHeader, JSON.stringify(commonFunc.getHeader()));
      commonFunc.notify("中国联通", "", content.cookieContent);
    }
  }
  refreshToken() {
    return new Promise(resolve => {
      const { querySignHeader, doSignHeader, querySignUrl, content } = this.config();
      const headers = JSON.parse(commonFunc.getData(doSignHeader))
      let doSignCookie = headers['Cookie']
      const params = {
        url: commonFunc.getData(querySignUrl),
        headers: JSON.parse(commonFunc.getData(querySignHeader))
      }
      commonFunc.get(params, (err, response, data) => {
        const resCookie = response.headers['Set-Cookie']
        doSignCookie = doSignCookie.replace(/route=([^;]*)/, resCookie.match(/route=([^;]*)/)[0])
          .replace(/JSESSIONID=([^;]*)/, resCookie.match(/JSESSIONID=([^;]*)/)[0])
        headers['Cookie'] = doSignCookie
        commonFunc.setData(doSignHeader, JSON.stringify(headers))
        commonFunc.notify("中国联通", "", content.refreshContent);
        resolve('done')
      })
    })
  }
  async doSign() {
    await this.refreshToken()
    const { needUrl, doSignHeader, content } = this.config();
    const parmas = {
      url: needUrl.doSignUrl,
      body: `version=${Math.random()}`,
      headers: JSON.parse(commonFunc.getData(doSignHeader))
    }
    commonFunc.post(parmas, (err, response, data) => {
      if (err) {
        console.log(`中国联通签到失败: ${err}`)
        commonFunc.notify("中国联通", `${content.failContent}`, '查看log')
      } else {
        if (data === '{}') {
          commonFunc.notify("中国联通", `${content.unkonwnContent}`)
        } else {
          data = JSON.parse(data)
          const { newCoin, growthV, prizeCount, flowerCount } = data
          subTitle = content.successContent
          txt = `金币${newCoin}, 积分${prizeCount}, 成长值${growthV}, 鲜花${flowerCount}`
          commonFunc.notify("中国联通", subTitle, txt)
        }
      }
    })
  }
}
const start = () => {
  const cu = new ChinaUnicom();
  if (commonFunc.isRequest()) {
    cu.getCookie();
  } else {
    cu.doSign();
  }
  commonFunc.done();
};
start();
