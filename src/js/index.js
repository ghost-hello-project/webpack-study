$(() => {
    layui.use(function () {
        const laypage = layui.laypage
        laypage.render({
            elem: 'article-page', // 元素 id
            count: 100, // 数据总数
            layout: ['count', 'prev', 'page', 'next', 'refresh', 'skip'], // 功能布局
            jump: function (obj) {
                // console.log(obj)
            }
        })
    })
})
