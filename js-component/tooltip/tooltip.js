function getElementPos(el) {
    let _x = 0,
        _y = 0;
    do {
        _x += el.offsetLeft;
        _y += el.offsetTop;
    } while (el = el.offsetParent);
    return {
        x: _x,
        y: _y
    };
}

var ToolTip = function () {
    var obj = {};
    obj.tip = null;
    obj.showTip = function (el, html) {
        if (obj.tip) {
            return;
        }
        var elPos = getElementPos(el);
        var posi = el.getAttribute('posi') ? el.getAttribute('posi') : "top";
        var tip = document.createElement("div");
        tip.className = 'tooltip';
        var arrow = document.createElement("div");
        arrow.className = 'tip-arrow ' + posi;
        var content = document.createElement("div");
        content.className = 'tip-content ' + posi;
        tip.appendChild(content);
        tip.appendChild(arrow);
        content.innerHTML = html;
        document.body.appendChild(tip);
        switch (posi) {
            case "top":
                {
                    tip.style.top = (elPos.y - content.offsetHeight - 7) + 'px';
                    tip.style.left = (elPos.x + el.offsetWidth / 2 - content.offsetWidth / 2) + 'px';
                }
                break;
            case "bottom":
                {
                    tip.style.top = (elPos.y + el.offsetHeight) + 'px';
                    tip.style.left = (elPos.x + el.offsetWidth / 2 - content.offsetWidth / 2) + 'px';
                }
                break;
            case "left":
                {
                    tip.style.top = (elPos.y + el.offsetHeight / 2 - content.offsetHeight / 2) + 'px';
                    tip.style.left = (elPos.x - content.offsetWidth - 7) + 'px';
                }
                break;
            case "right":
                {
                    tip.style.top = (elPos.y + el.offsetHeight / 2 - content.offsetHeight / 2) + 'px';
                    tip.style.left = (elPos.x + el.offsetWidth) + 'px';
                }
                break;
        }

        tip.addEventListener("mouseenter", function () {
            tip.setAttribute("in", true);
        });
        tip.addEventListener("mouseleave", function () {
            tip.setAttribute("in", false);
            obj.hideTip();
        });

        obj.tip = tip;
    };
    obj.hideTip = function () {
        if (this.tip && this.tip.getAttribute("in") != "true") {
            document.body.removeChild(this.tip);
            obj.tip = null;
        }
    };
    obj.init = function (el) {
        el.onmouseenter = function () {
            obj.showTip(this, this.getAttribute('tipContent'))
        };
        el.onmouseleave = function () {
            setTimeout(function () {
                obj.hideTip();
            }, 0);

        };
    };

    return obj;
}

