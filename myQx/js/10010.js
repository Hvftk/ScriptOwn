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
    return $prefs.valueForKey(key);
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
        // 获取签到必须参数route5, jsessionid
        querySignUrl: "https://act.10010.com/SigninApp/signin/querySigninActivity.htm",
        // 签到
        doSignUrl: "https://act.10010.com/SigninApp3.0_huidu/signin/daySign.do"
      },
      content: {
        refreshContent: '获取Refresh Token成功 🎉',
        cookieContent: '获取Cookie成功 🎉',
        successContent: '签到结果: 成功 🎉',
        failContent: '签到结果: 失败 ⚠️',
        unkonwnContent: '签到结果: 未知 ⚠️'
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
    if (commonFunc.getUrl().match(needUrl.doSignUrl)) {
      commonFunc.setData(doSignHeader, JSON.stringify(commonFunc.getHeader()));
      commonFunc.notify("中国联通", "", content.cookieContent);
    }
  }
  refreshToken() {
    return new Promise(resolve => {
      const { querySignHeader, doSignHeader, querySignUrl } = this.config();
      const headers = JSON.parse(commonFunc.getData(doSignHeader))
      let doSignCookie = headers['Cookie']
      const params = {
        url: commonFunc.getData(querySignUrl),
        headers: JSON.parse(commonFunc.getData(querySignHeader))
      }
      commonFunc.get(params, (err, response, data) => {
        const resCookie = response.headers['Set-Cookie']
        doSignCookie = doSignCookie.replace(/route=([^;]*)/, resCookie.match(/route5=([^;]*)/)[0])
          .replace(/JSESSIONID=([^;]*)/, resCookie.match(/JSESSIONID=([^;]*)/)[0])
        headers['Cookie'] = doSignCookie
        commonFunc.setData(doSignHeader, JSON.stringify(headers))
        console.log("refresh token")
        resolve('done')
      })
    })
  }
  doSign() {
    this.refreshToken()
    const { needUrl, doSignHeader, content } = this.config();
    const parmas = {
      url: needUrl.doSignUrl,
      body: 'className=signinIndex',
      headers: JSON.parse(commonFunc.getData(doSignHeader))
    }
    commonFunc.get(parmas, (err, response, data) => {
      if (err) {
        console.log(`中国联通签到失败: ${err}`)
        commonFunc.notify("中国联通", `${content.failContent}`, '查看log')
      } else {
        if (data['msgCode']) {
          let subTitle = ''
          let txt = ''
          switch (data['msgCode']) {
            case "0000":
              const { continuCount, prizeCount, growthgetGrowScore } = data
              subTitle = content.successContent
              txt = `连续签到${continuCount}天, 金币${prizeCount}, 成长值${growthgetGrowScore}`
              break;
            case "0008":
              subTitle = content.failContent
              txt = '已签到'
              break
            default:
              subTitle = content.unkonwnContent
              break;
          }
          commonFunc.notify("中国联通", subTitle, txt)
        } else {
          if (data['loginCode']) {
            commonFunc.notify("中国联通", '签到结果: 失败', `${expectData['loginCode']}`)
          }
        }
      }
    })
  }
}
const start = () => {
  const cu = new ChinaUnicom();
  if (commonFunc.isRequest()) {
    console.log("get cookie");
    cu.getCookie();
  } else {
    console.log("sign");
    cu.doSign();
  }
  commonFunc.done();
};
start();
