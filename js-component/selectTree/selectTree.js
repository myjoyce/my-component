(function () {
    function Tab(tab) {
        this.tab = tab;
        var _this_ = this;
        // 默认配置参数，属性名为双引号，不然parseJSON转义不成功
        this.config = {
            // 用来定义鼠标的触发类型，是click还是mouseover
            "triggerType": "mouseover",
            // 用来定义内容切换效果，是直接切换，还是淡入淡出效果
            "effect": "default",
            // 默认展示第几个tab
            "invoke": 1,
            // 用来定义tab是否自动切换，指定时间为多久切换
            "auto": false
        }
        // 如果配置存在，就扩展掉原来的配置，$.extend合并
        if (this.getConfig()) {
            $.extend(this.config, this.getConfig());
        }
        // 鼠标触发功能
        var config = this.config; // 存储配置，this.config会每次查找
        this.liItem = this.tab.find('.tab-nav li'); // 获取li
        this.contentItem = this.tab.find('.content div'); // 获取内容
        // 判断如果是click。。当操作时，执行invoke方法进行切换
        if (config.triggerType === 'click') {
            this.liItem.click(function () {
                _this_.invoke($(this));
            });
        } else {
            this.liItem.mouseover(function () {
                _this_.invoke($(this));
            });
        }

        // 自动切换功能
        if (this.config.auto) {
            this.timer = null;
            this.count = 0; // 计数器
            this.autoplay();
            // 当鼠标浮在上面停止，移开时继续
            this.tab.hover(function () {
                clearInterval(_this_.timer); // 此时的this是this.tab
            }, function () {
                _this_.autoplay();
            })
        }

        // 默认显示第几个
        if (this.config.invoke > 1) {
            this.invoke(this.liItem.eq(this.config.invoke - 1)); // 直接切换
        }
    }
    // 通过init初始化
    Tab.init = function (tabs) {
        tabs.each(function () {
            new Tab($(this));
        });
    }
    Tab.prototype = {
        // 获取配置参数
        getConfig: function () {
            //把tab元素上的data-config中的内容拿出来
            var config = this.tab.attr('data-config');
            if (config && config != '') {
                return $.parseJSON(config); // 将json对象转换为js对象
            } else {
                return null;
            }
        },
        // 获取传入的li，进行切换
        invoke: function (li) {
            var index = li.index(); // 获取li的索引
            var liItem = this.liItem;
            var contentItem = this.contentItem;

            li.addClass('active').siblings().removeClass('active'); // 自身加active其他兄弟都去除
            // 淡入淡出还是默认
            var effect = this.config.effect;
            if (effect === 'default') {
                contentItem.eq(index).addClass('current').siblings().removeClass('active');
            } else {
                contentItem.eq(index).fadeIn().siblings().fadeOut();
            }
            // 当自动切换时，要更改count，否则每次都从头开始
            this.count = index;
        },
        // 自动切换
        autoplay: function () {
            var _this_ = this;
            var length = this.liItem.length; // 获取长度
            this.timer = setInterval(function () {
                _this_.count++; // 计数加一，此时的this是this.timer
                if (_this_.count >= length) {
                    _this_.count = 0;
                }
                // 第几个li触发事件
                _this_.liItem.eq(_this_.count).trigger(_this_.config.triggerType);
            }, this.config.auto);
        }
    }

    window.Tab = Tab; // 将Tab注册为window对象，不然外部无法访问  

})();
