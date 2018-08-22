var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var CirlceControl = function () {
    function CirlceControl(elem, options) {
        _classCallCheck(this, CirlceControl);
        this.elem = elem;
        this.domElem = document.querySelector(this.elem);

        this.maxValue = options.maxValue === undefined ? 30 : options.maxValue;
        this.size = options.size;
        this.center = options.size / 2;
        this.radius = options.size / 2 - options.stroke;
        this.stroke = options.stroke;
        this.startAngle = -CirlceControl.radians(150);

        this.setValue(options.value == undefined ? 0 : options.value);

        if (options.addEventsListeners !== false) {
            this.refreshCoordinates();
            this.addEventsListeners();
        }
    }
    _createClass(CirlceControl, [{
        key: "renderInitial",
        value: function renderInitial()

        {
            this.svg = d3.
            select(this.elem).
            append("svg").
            attr("width", this.size + 1 + "px").
            attr("height", this.size + 1 + "px").
            attr("draggable", "false");

            this.svg.append("defs").html("<filter x=\"-3.9%\" y=\"-2.8%\" width=\"107.9%\" height=\"107.9%\" filterUnits=\"objectBoundingBox\" id=\"filter-2\">\n        <feOffset dx=\"0\" dy=\"2\" in=\"SourceAlpha\" result=\"shadowOffsetOuter1\"></feOffset>\n        <feGaussianBlur stdDeviation=\"2\" in=\"shadowOffsetOuter1\" result=\"shadowBlurOuter1\"></feGaussianBlur>\n        <feColorMatrix values=\"0 0 0 0 0.524208121   0 0 0 0 0.475951723   0 0 0 0 0.279116418  0 0 0 0.446388134 0\" type=\"matrix\" in=\"shadowBlurOuter1\"></feColorMatrix>\n      </filter>\n\n    <linearGradient id=\"linearGradient\" x1=\"30%\" y1=\"0%\" x2=\"80%\" y2=\"0%\" spreadMethod=\"pad\">\n      <stop offset=\"0%\"   stop-color=\"#F5A623\"/>\n   </linearGradient>");

            this.svg.
            append("circle").
            attr("fill", "none").
            attr("cx", this.center).
            attr("cy", this.center).
            attr("r", this.radius).
            attr("stroke", "#333").
            attr("stroke-width", this.stroke * 2).
            attr("draggable", "false");

            var sectorArc = d3.
            arc().
            innerRadius(this.radius).
            outerRadius(this.radius + this.stroke / 2).
            startAngle(this.startAngle).
            endAngle(this.angle);

            this.sector = this.svg.
            append("path").
            attr("fill", "none").
            attr("stroke", "url(#linearGradient)").
            attr("stroke-width", this.stroke).
            attr("transform", "translate(" + this.center + ", " + this.center + ")").
            attr("d", sectorArc).
            attr("draggable", "false");

            this.svg.
            append("circle").
            attr("fill", "none").
            attr("cx", this.center).
            attr("cy", this.center).
            attr("r", this.radius + this.stroke).
            attr("stroke", "#fff").
            attr("stroke-width", this.stroke * 2).
            attr("stroke-dasharray", "4,1").
            attr("draggable", "false");

            // Скрытие нижнего сектора
            var hideArc = d3.
            arc().
            innerRadius(this.radius).
            outerRadius(this.radius + this.stroke * 1.2).
            startAngle(this.startAngle).
            endAngle(this.startAngle - (Math.PI + this.startAngle) * 2);

            this.svg.
            append("path").
            attr("fill", "white").
            attr(
                "transform", "translate(" + (
                    this.radius + this.stroke) + ", " + (this.radius +
                    this.stroke) + ")").

            attr("d", hideArc);

            this.svg.
            append("circle").
            attr("fill", "white").
            attr("cx", this.center).
            attr("cy", this.center).
            attr("r", this.radius).
            attr("filter", "url(#filter-2)").
            attr("draggable", "false");

            this.circle = this.svg.append("g");
            this.circle.
            append("circle").
            attr("fill", "white").
            attr("cx", this.center).
            attr("cy", this.center).
            attr("r", this.radius).
            attr("draggable", "false");

            // Стрелочка
            this.circle.
            append("path").
            attr(
                "d",
                "M0.311431,5.943579 L5.036156,0.590855 C5.371306,0.211158 5.527735,0.113005 5.715788,0.048431 C5.903841,-0.016144 6.096159,-0.016144 6.284212,0.048431 C6.472265,0.113005 6.628694,0.211158 6.963844,0.590855 L11.688569,5.943579 C12.10381,6.414014 12.10381,7.176739 11.688569,7.647174 C11.489162,7.873085 11.21871,8 10.936707,8 L1.063293,8 C0.476053,8 0,7.460672 0,6.795376 C0,6.47589 0.112025,6.169489 0.311431,5.943579 Z").

            attr(
                "transform", "translate(" + (
                    this.radius + this.stroke - 6) + ", " + this.stroke + ")");


            // Индикатор текущего значения
            this.valueText = this.svg.
            append("text").
            attr("font-family", "Arial").
            attr("fill", "#333").
            attr("font-size", "66px").
            attr("font-weight", "bold").
            attr("text-anchor", "middle").
            attr("class", "circle-control__value-text").
            attr("x", this.size / 2).
            attr("y", this.size / 2 + this.size / 10);
        }
    }, {
        key: "render",
        value: function render()

        {
            var _this = this;
            if (!this.initialized) {
                this.renderInitial();
                this.initialized = true;
            }

            var sectorArc = d3.
            arc().
            innerRadius(this.radius).
            outerRadius(this.radius + this.stroke / 2).
            startAngle(this.startAngle - 0.5).
            endAngle(this.angle - 0.15);
            this.sector.attr("d", sectorArc);

            this.circle.attr("transform", function () {
                var me = _this.circle.node();
                var x1 = me.getBBox().x + me.getBBox().width / 2;
                var y1 = me.getBBox().y + me.getBBox().height / 2;

                return "rotate(" + CirlceControl.degrees(_this.angle) + ", " + x1 + ", " + y1 + ")";
            });

            var value = this.getValue();
            this.valueText.text(value);
        }
    }, {
        key: "addEventsListeners",
        value: function addEventsListeners()

        {
            var _this2 = this;
            this.domElem.addEventListener("mousemove", function (e) {
                if (e.buttons == 1) {
                    _this2.click(e.clientX - _this2.x, e.clientY - _this2.y);
                    e.preventDefault();
                }
            });
            this.domElem.addEventListener("click", function (e) {
                _this2.click(e.clientX - _this2.x, e.clientY - _this2.y);
                e.preventDefault();
            });
            this.domElem.addEventListener("touchmove", function (e) {
                _this2.click(
                    e.touches[0].clientX - _this2.x,
                    e.touches[0].clientY - _this2.y);

                e.preventDefault();
            });
            document.body.onresize = function () {
                _this2.refreshCoordinates();
            };
        }
    }, {
        key: "click",
        value: function click(

            clickX, clickY) {
            this.clickX = clickX;
            this.clickY = clickY;
            this.angle = this.calcClickAngle();
            this.render();
        }
    }, {
        key: "getValue",
        value: function getValue()

        {
            var value = Math.floor(
                (this.angle - this.startAngle) / (-this.startAngle * 2) * (
                    this.maxValue + 1));

            if (value < 0) value = 0;
            if (value > this.maxValue) value = this.maxValue;

            if (value > 0) return "+" + value;
            return value;
        }
    }, {
        key: "setValue",
        value: function setValue(

            value) {
            this.angle = -this.startAngle * 2 * value / (this.maxValue + 1) +
                this.startAngle;
            this.render();
        }
    }, {
        key: "calcClickAngle",
        value: function calcClickAngle()

        {
            var x = this.clickX,
                y = this.clickY,
                r = Math.hypot(x - this.center, y - this.center);

            var angle = Math.asin(Math.abs(this.center - x) / r);
            if (y > this.center) angle = Math.PI - angle;
            if (x < this.center) angle *= -1;

            if (angle < this.startAngle - 0.08) angle = this.startAngle - 0.08;
            if (angle > -this.startAngle + 0.08) angle = -this.startAngle + 0.08;

            return angle;
        }
    }, {
        key: "refreshCoordinates",
        value: function refreshCoordinates()

        {
            var rect = this.domElem.querySelector("svg").getBoundingClientRect();
            this.x = rect.left;
            this.y = rect.top;
        }
    }], [{
        key: "degrees",
        value: function degrees(radians) {
            return radians * 180 / Math.PI;
        }
    }, {
        key: "radians",
        value: function radians(degrees) {
            return degrees * Math.PI / 180;
        }
    }]);
    return CirlceControl;
}();


window.onload = function () {
    new CirlceControl(".control", {
        size: 220,
        stroke: 24,
        value: 19,
        maxValue: 30
    });

};