// ==FeHelperMonkey==
// @reminder        请不要删除这部分代码注释，这是FeHelper油猴脚本能正常工作的基本条件！当然，你可以按需修改这里的内容！
// @id              mf_1596020101710
// @name            mikutool
// @url-pattern     https://tools.miku.ac/*
// @enable          true
// @require-js      
// @auto-refresh    0
// @updated         2020-07-29 19:25:14
// ==/FeHelperMonkey==


(() => {
    let dom = document.querySelector('#__nuxt');
    let vue = dom && dom.__vue__;
    if (!vue) {
        console.warn('qr vue is not detected.');
        return;
    }

    /* request success */
    vue.followedSuccess = true;
    const $state = vue.$store.app.store.state
    $state.vip = true
})();

