// common func
const commonFunc = {
  isRequest: () => {
    return typeof $request != "undefined"
  },
  getUrl: () => {
    return $request.url
  },
  getResponse: () => {
    return JSON.parse($response.body)
  },
  setData: (key, value) => {
    $prefs.setValueForKey(value, key)
  },
  getData: key => {
    return $prefs.valueForKey(key)
  },
  notify: (titile, subTitle = "", content = "") => {
    $notify(titile, subTitle, content)
  },
  done: (body) => {
    typeof $request != "undefined" ? $done(body) : ""
  }
}

class CaiYun {
  config() {
    return {
      userUrl: {
        // 
        userUrl: "https://biz.caiyunapp.com/v2/user",
        rightsUrl: "https://biz.caiyunapp.com/membership_rights"
      },
      hackResult: {
        is_vip: true,
        vip_type: "s",
        "svip_expired_at": 1882066669.9452950954,
      },
      hackResultWt: {
        vip: {
          enable: true,
          svip_expired_at: 1882066669.9452950954
        }
      },
      hackRights: { "result": [{ "name": "\u514d\u5e7f\u544a", "enabled": true, "vip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/vip-ads-free.png", "vip": true, "svip": true, "_id": "5ee5eb091d28d2634a2ee08f", "svip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-ads-free.png" }, { "name": "\u591a\u5730\u5929\u6c14\u63a8\u9001", "enabled": true, "vip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/vip-custom-push.png", "vip": true, "svip": true, "_id": "5ee5eb091d28d2634a2ee090", "svip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-custom-push.png" }, { "name": "\u964d\u6c34\u63d0\u9192", "enabled": true, "vip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/vip-rain-notification.png", "vip": true, "svip": true, "_id": "5ee5eb091d28d2634a2ee091", "svip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-rain-notification.png" }, { "name": "\u536b\u661f\u4e91\u56fe", "enabled": true, "vip_icon": null, "vip": false, "svip": true, "_id": "5ee5eb091d28d2634a2ee092", "svip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-satellite-clouds.png" }, { "name": "\u4e91\u91cf", "enabled": true, "vip_icon": null, "vip": false, "svip": true, "_id": "5ee5eb091d28d2634a2ee093", "svip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-cloud-cover.png" }, { "name": "\u6c14\u6e29\u9884\u62a5", "enabled": true, "vip_icon": null, "vip": false, "svip": true, "_id": "5ee5eb091d28d2634a2ee094", "svip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-tmp-forecast.png" }, { "name": "\u9732\u70b9\u6e29\u5ea6\u9884\u62a5", "enabled": true, "vip_icon": null, "vip": false, "svip": true, "_id": "5ee5eb091d28d2634a2ee095", "svip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-dew-point-tmp-forecast.png" }, { "name": "\u77ed\u6ce2\u8f90\u5c04\u901a\u91cf", "enabled": true, "vip_icon": null, "vip": false, "svip": true, "_id": "5ee5eb091d28d2634a2ee096", "svip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-short-wave-radiation.png" }, { "name": "\u6c14\u538b", "enabled": true, "vip_icon": null, "vip": false, "svip": true, "_id": "5ee5eb091d28d2634a2ee097", "svip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-pressure.png" }, { "name": "\u80fd\u89c1\u5ea6", "enabled": true, "vip_icon": null, "vip": false, "svip": true, "_id": "5ee5eb091d28d2634a2ee098", "svip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-visibility.png" }, { "name": "\u6e7f\u5ea6\u9884\u62a5", "enabled": true, "vip_icon": null, "vip": false, "svip": true, "_id": "5ee5eb091d28d2634a2ee099", "svip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-humidity-forecast.png" }, { "name": "2\u5929\u964d\u96e8\u9884\u62a5\u56fe", "enabled": true, "vip_icon": null, "vip": false, "svip": true, "_id": "5ee5eb091d28d2634a2ee09a", "svip_icon": "https://cdn.caiyunapp.com/ad/img/membership_rights/svip-rain-forecast.png" }], "rc": 0 }
    }
  }
  hackSvip = () => {
    const { userUrl, rightsUrl, hackResult, hackResultWt, hackRights } = this.config()
    const { getResponse, getUrl, done } = commonFunc
    if (getUrl().match(userUrl)) {
      const res = getResponse()
      Object.assign(res['result'], hackResult)
      Object.assign(res['result']['wt'], hackResultWt)
      done(JSON.stringify(res))
    }
    if (getUrl().match(rightsUrl)) {
      done(JSON.stringify(hackRights))
    }
  }
}

const start = () => {
  const cy = new CaiYun()
  cy.hackSvip()
}
start()