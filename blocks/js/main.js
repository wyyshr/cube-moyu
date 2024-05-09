/*
 TweenJS
 Visit http://createjs.com/ for documentation, updates and examples.

 Copyright (c) 2010 gskinner.com, inc.

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 Platform.js <https://mths.be/platform>
 Copyright 2014-2018 Benjamin Tan <https://bnjmnt4n.now.sh/>
 Copyright 2011-2013 John-David Dalton
 Available under MIT license <https://mths.be/mit>
*/
this.createjs = this.createjs || {};
createjs.extend = function(a, c) {
    function b() {
        this.constructor = a
    }
    b.prototype = c.prototype;
    return a.prototype = new b
}
;
this.createjs = this.createjs || {};
createjs.promote = function(a, c) {
    var b = a.prototype
      , d = Object.getPrototypeOf && Object.getPrototypeOf(b) || b.__proto__;
    if (d) {
        b[(c += "_") + "constructor"] = d.constructor;
        for (var e in d)
            b.hasOwnProperty(e) && "function" == typeof d[e] && (b[c + e] = d[e])
    }
    return a
}
;
this.createjs = this.createjs || {};
createjs.deprecate = function(a, c) {
    return function() {
        var b = "Deprecated property or method '" + c + "'. See docs for info.";
        console && (console.warn ? console.warn(b) : console.log(b));
        return a && a.apply(this, arguments)
    }
}
;
this.createjs = this.createjs || {};
(function() {
    function a(a, c, e) {
        this.type = a;
        this.currentTarget = this.target = null;
        this.eventPhase = 0;
        this.bubbles = !!c;
        this.cancelable = !!e;
        this.timeStamp = (new Date).getTime();
        this.removed = this.immediatePropagationStopped = this.propagationStopped = this.defaultPrevented = !1
    }
    var c = a.prototype;
    c.preventDefault = function() {
        this.defaultPrevented = this.cancelable && !0
    }
    ;
    c.stopPropagation = function() {
        this.propagationStopped = !0
    }
    ;
    c.stopImmediatePropagation = function() {
        this.immediatePropagationStopped = this.propagationStopped = !0
    }
    ;
    c.remove = function() {
        this.removed = !0
    }
    ;
    c.clone = function() {
        return new a(this.type,this.bubbles,this.cancelable)
    }
    ;
    c.set = function(a) {
        for (var b in a)
            this[b] = a[b];
        return this
    }
    ;
    c.toString = function() {
        return "[Event (type=" + this.type + ")]"
    }
    ;
    createjs.Event = a
}
)();
this.createjs = this.createjs || {};
(function() {
    function a() {
        this._captureListeners = this._listeners = null
    }
    var c = a.prototype;
    a.initialize = function(a) {
        a.addEventListener = c.addEventListener;
        a.on = c.on;
        a.removeEventListener = a.off = c.removeEventListener;
        a.removeAllEventListeners = c.removeAllEventListeners;
        a.hasEventListener = c.hasEventListener;
        a.dispatchEvent = c.dispatchEvent;
        a._dispatchEvent = c._dispatchEvent;
        a.willTrigger = c.willTrigger
    }
    ;
    c.addEventListener = function(a, c, e) {
        var b = e ? this._captureListeners = this._captureListeners || {} : this._listeners = this._listeners || {};
        var d = b[a];
        d && this.removeEventListener(a, c, e);
        (d = b[a]) ? d.push(c) : b[a] = [c];
        return c
    }
    ;
    c.on = function(a, c, e, f, g, h) {
        c.handleEvent && (e = e || c,
        c = c.handleEvent);
        e = e || this;
        return this.addEventListener(a, function(a) {
            c.call(e, a, g);
            f && a.remove()
        }, h)
    }
    ;
    c.removeEventListener = function(a, c, e) {
        if (e = e ? this._captureListeners : this._listeners) {
            var b = e[a];
            if (b)
                for (var d = 0, h = b.length; d < h; d++)
                    if (b[d] == c) {
                        1 == h ? delete e[a] : b.splice(d, 1);
                        break
                    }
        }
    }
    ;
    c.off = c.removeEventListener;
    c.removeAllEventListeners = function(a) {
        a ? (this._listeners && delete this._listeners[a],
        this._captureListeners && delete this._captureListeners[a]) : this._listeners = this._captureListeners = null
    }
    ;
    c.dispatchEvent = function(a, c, e) {
        if ("string" == typeof a) {
            var b = this._listeners;
            if (!(c || b && b[a]))
                return !0;
            a = new createjs.Event(a,c,e)
        } else
            a.target && a.clone && (a = a.clone());
        try {
            a.target = this
        } catch (g) {}
        if (a.bubbles && this.parent) {
            e = this;
            for (c = [e]; e.parent; )
                c.push(e = e.parent);
            b = c.length;
            for (e = b - 1; 0 <= e && !a.propagationStopped; e--)
                c[e]._dispatchEvent(a, 1 + (0 == e));
            for (e = 1; e < b && !a.propagationStopped; e++)
                c[e]._dispatchEvent(a, 3)
        } else
            this._dispatchEvent(a, 2);
        return !a.defaultPrevented
    }
    ;
    c.hasEventListener = function(a) {
        var b = this._listeners
          , c = this._captureListeners;
        return !!(b && b[a] || c && c[a])
    }
    ;
    c.willTrigger = function(a) {
        for (var b = this; b; ) {
            if (b.hasEventListener(a))
                return !0;
            b = b.parent
        }
        return !1
    }
    ;
    c.toString = function() {
        return "[EventDispatcher]"
    }
    ;
    c._dispatchEvent = function(a, c) {
        var b, d, g = 2 >= c ? this._captureListeners : this._listeners;
        if (a && g && (d = g[a.type]) && (b = d.length)) {
            try {
                a.currentTarget = this
            } catch (k) {}
            try {
                a.eventPhase = c | 0
            } catch (k) {}
            a.removed = !1;
            d = d.slice();
            for (g = 0; g < b && !a.immediatePropagationStopped; g++) {
                var h = d[g];
                h.handleEvent ? h.handleEvent(a) : h(a);
                a.removed && (this.off(a.type, h, 1 == c),
                a.removed = !1)
            }
        }
        2 === c && this._dispatchEvent(a, 2.1)
    }
    ;
    createjs.EventDispatcher = a
}
)();
this.createjs = this.createjs || {};
(function() {
    function a() {
        throw "Ticker cannot be instantiated.";
    }
    a.RAF_SYNCHED = "synched";
    a.RAF = "raf";
    a.TIMEOUT = "timeout";
    a.timingMode = null;
    a.maxDelta = 0;
    a.paused = !1;
    a.removeEventListener = null;
    a.removeAllEventListeners = null;
    a.dispatchEvent = null;
    a.hasEventListener = null;
    a._listeners = null;
    createjs.EventDispatcher.initialize(a);
    a._addEventListener = a.addEventListener;
    a.addEventListener = function() {
        !a._inited && a.init();
        return a._addEventListener.apply(a, arguments)
    }
    ;
    a._inited = !1;
    a._startTime = 0;
    a._pausedTime = 0;
    a._ticks = 0;
    a._pausedTicks = 0;
    a._interval = 50;
    a._lastTime = 0;
    a._times = null;
    a._tickTimes = null;
    a._timerId = null;
    a._raf = !0;
    a._setInterval = function(b) {
        a._interval = b;
        a._inited && a._setupTick()
    }
    ;
    a.setInterval = createjs.deprecate(a._setInterval, "Ticker.setInterval");
    a._getInterval = function() {
        return a._interval
    }
    ;
    a.getInterval = createjs.deprecate(a._getInterval, "Ticker.getInterval");
    a._setFPS = function(b) {
        a._setInterval(1E3 / b)
    }
    ;
    a.setFPS = createjs.deprecate(a._setFPS, "Ticker.setFPS");
    a._getFPS = function() {
        return 1E3 / a._interval
    }
    ;
    a.getFPS = createjs.deprecate(a._getFPS, "Ticker.getFPS");
    try {
        Object.defineProperties(a, {
            interval: {
                get: a._getInterval,
                set: a._setInterval
            },
            framerate: {
                get: a._getFPS,
                set: a._setFPS
            }
        })
    } catch (d) {
        console.log(d)
    }
    a.init = function() {
        a._inited || (a._inited = !0,
        a._times = [],
        a._tickTimes = [],
        a._startTime = a._getTime(),
        a._times.push(a._lastTime = 0),
        a.interval = a._interval)
    }
    ;
    a.reset = function() {
        if (a._raf) {
            var b = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
            b && b(a._timerId)
        } else
            clearTimeout(a._timerId);
        a.removeAllEventListeners("tick");
        a._timerId = a._times = a._tickTimes = null;
        a._startTime = a._lastTime = a._ticks = a._pausedTime = 0;
        a._inited = !1
    }
    ;
    a.getMeasuredTickTime = function(b) {
        var c = 0
          , d = a._tickTimes;
        if (!d || 1 > d.length)
            return -1;
        b = Math.min(d.length, b || a._getFPS() | 0);
        for (var g = 0; g < b; g++)
            c += d[g];
        return c / b
    }
    ;
    a.getMeasuredFPS = function(b) {
        var c = a._times;
        if (!c || 2 > c.length)
            return -1;
        b = Math.min(c.length - 1, b || a._getFPS() | 0);
        return 1E3 / ((c[0] - c[b]) / b)
    }
    ;
    a.getTime = function(b) {
        return a._startTime ? a._getTime() - (b ? a._pausedTime : 0) : -1
    }
    ;
    a.getEventTime = function(b) {
        return a._startTime ? (a._lastTime || a._startTime) - (b ? a._pausedTime : 0) : -1
    }
    ;
    a.getTicks = function(b) {
        return a._ticks - (b ? a._pausedTicks : 0)
    }
    ;
    a._handleSynch = function() {
        a._timerId = null;
        a._setupTick();
        a._getTime() - a._lastTime >= .97 * (a._interval - 1) && a._tick()
    }
    ;
    a._handleRAF = function() {
        a._timerId = null;
        a._setupTick();
        a._tick()
    }
    ;
    a._handleTimeout = function() {
        a._timerId = null;
        a._setupTick();
        a._tick()
    }
    ;
    a._setupTick = function() {
        if (null == a._timerId) {
            var b = a.timingMode;
            if (b == a.RAF_SYNCHED || b == a.RAF) {
                var c = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
                if (c) {
                    a._timerId = c(b == a.RAF ? a._handleRAF : a._handleSynch);
                    a._raf = !0;
                    return
                }
            }
            a._raf = !1;
            a._timerId = setTimeout(a._handleTimeout, a._interval)
        }
    }
    ;
    a._tick = function() {
        var b = a.paused
          , c = a._getTime()
          , f = c - a._lastTime;
        a._lastTime = c;
        a._ticks++;
        b && (a._pausedTicks++,
        a._pausedTime += f);
        if (a.hasEventListener("tick")) {
            var g = new createjs.Event("tick")
              , h = a.maxDelta;
            g.delta = h && f > h ? h : f;
            g.paused = b;
            g.time = c;
            g.runTime = c - a._pausedTime;
            a.dispatchEvent(g)
        }
        for (a._tickTimes.unshift(a._getTime() - c); 100 < a._tickTimes.length; )
            a._tickTimes.pop();
        for (a._times.unshift(c); 100 < a._times.length; )
            a._times.pop()
    }
    ;
    var c = window
      , b = c.performance.now || c.performance.mozNow || c.performance.msNow || c.performance.oNow || c.performance.webkitNow;
    a._getTime = function() {
        return (b && b.call(c.performance) || (new Date).getTime()) - a._startTime
    }
    ;
    createjs.Ticker = a
}
)();
this.createjs = this.createjs || {};
(function() {
    function a(a) {
        this.EventDispatcher_constructor();
        this.ignoreGlobalPause = !1;
        this.loop = 0;
        this.bounce = this.reversed = this.useTicks = !1;
        this.timeScale = 1;
        this.position = this.duration = 0;
        this.rawPosition = -1;
        this._paused = !0;
        this._labelList = this._labels = this._parent = this._prev = this._next = null;
        a && (this.useTicks = !!a.useTicks,
        this.ignoreGlobalPause = !!a.ignoreGlobalPause,
        this.loop = !0 === a.loop ? -1 : a.loop || 0,
        this.reversed = !!a.reversed,
        this.bounce = !!a.bounce,
        this.timeScale = a.timeScale || 1,
        a.onChange && this.addEventListener("change", a.onChange),
        a.onComplete && this.addEventListener("complete", a.onComplete))
    }
    var c = createjs.extend(a, createjs.EventDispatcher);
    c._setPaused = function(a) {
        createjs.Tween._register(this, a);
        return this
    }
    ;
    c.setPaused = createjs.deprecate(c._setPaused, "AbstractTween.setPaused");
    c._getPaused = function() {
        return this._paused
    }
    ;
    c.getPaused = createjs.deprecate(c._getPaused, "AbstactTween.getPaused");
    c._getCurrentLabel = function(a) {
        var b = this.getLabels();
        null == a && (a = this.position);
        for (var c = 0, f = b.length; c < f && !(a < b[c].position); c++)
            ;
        return 0 === c ? null : b[c - 1].label
    }
    ;
    c.getCurrentLabel = createjs.deprecate(c._getCurrentLabel, "AbstractTween.getCurrentLabel");
    try {
        Object.defineProperties(c, {
            paused: {
                set: c._setPaused,
                get: c._getPaused
            },
            currentLabel: {
                get: c._getCurrentLabel
            }
        })
    } catch (b) {}
    c.advance = function(a, c) {
        this.setPosition(this.rawPosition + a * this.timeScale, c)
    }
    ;
    c.setPosition = function(a, c, e, f) {
        var b = this.duration
          , d = this.loop
          , k = this.rawPosition
          , q = 0;
        0 > a && (a = 0);
        if (0 === b) {
            var m = !0;
            if (-1 !== k)
                return m
        } else {
            var n = a / b | 0;
            q = a - n * b;
            (m = -1 !== d && a >= d * b + b) && (a = (q = b) * (n = d) + b);
            if (a === k)
                return m;
            !this.reversed !== !(this.bounce && n % 2) && (q = b - q)
        }
        this.position = q;
        this.rawPosition = a;
        this._updatePosition(e, m);
        m && (this.paused = !0);
        f && f(this);
        c || this._runActions(k, a, e, !e && -1 === k);
        this.dispatchEvent("change");
        m && this.dispatchEvent("complete")
    }
    ;
    c.calculatePosition = function(a) {
        var b = this.duration
          , c = this.loop
          , f = 0;
        if (0 === b)
            return 0;
        -1 !== c && a >= c * b + b ? (a = b,
        f = c) : 0 > a ? a = 0 : (f = a / b | 0,
        a -= f * b);
        return !this.reversed !== !(this.bounce && f % 2) ? b - a : a
    }
    ;
    c.getLabels = function() {
        var a = this._labelList;
        if (!a) {
            a = this._labelList = [];
            var c = this._labels, e;
            for (e in c)
                a.push({
                    label: e,
                    position: c[e]
                });
            a.sort(function(a, b) {
                return a.position - b.position
            })
        }
        return a
    }
    ;
    c.setLabels = function(a) {
        this._labels = a;
        this._labelList = null
    }
    ;
    c.addLabel = function(a, c) {
        this._labels || (this._labels = {});
        this._labels[a] = c;
        var b = this._labelList;
        if (b) {
            for (var d = 0, g = b.length; d < g && !(c < b[d].position); d++)
                ;
            b.splice(d, 0, {
                label: a,
                position: c
            })
        }
    }
    ;
    c.gotoAndPlay = function(a) {
        this.paused = !1;
        this._goto(a)
    }
    ;
    c.gotoAndStop = function(a) {
        this.paused = !0;
        this._goto(a)
    }
    ;
    c.resolve = function(a) {
        var b = Number(a);
        isNaN(b) && (b = this._labels && this._labels[a]);
        return b
    }
    ;
    c.toString = function() {
        return "[AbstractTween]"
    }
    ;
    c.clone = function() {
        throw "AbstractTween can not be cloned.";
    }
    ;
    c._init = function(a) {
        a && a.paused || (this.paused = !1);
        a && null != a.position && this.setPosition(a.position)
    }
    ;
    c._updatePosition = function(a, c) {}
    ;
    c._goto = function(a) {
        a = this.resolve(a);
        null != a && this.setPosition(a, !1, !0)
    }
    ;
    c._runActions = function(a, c, e, f) {
        if (this._actionHead || this.tweens) {
            var b = this.duration, d = this.reversed, k = this.bounce, q = this.loop, m, n, p;
            if (0 === b) {
                var t = m = n = p = 0;
                d = k = !1
            } else
                t = a / b | 0,
                m = c / b | 0,
                n = a - t * b,
                p = c - m * b;
            -1 !== q && (m > q && (p = b,
            m = q),
            t > q && (n = b,
            t = q));
            if (e)
                return this._runActionsRange(p, p, e, f);
            if (t !== m || n !== p || e || f) {
                -1 === t && (t = n = 0);
                a = a <= c;
                c = t;
                do {
                    q = c === t ? n : a ? 0 : b;
                    var r = c === m ? p : a ? b : 0;
                    !d !== !(k && c % 2) && (q = b - q,
                    r = b - r);
                    if ((!k || c === t || q !== r) && this._runActionsRange(q, r, e, f || c !== t && !k))
                        return !0;
                    f = !1
                } while (a && ++c <= m || !a && --c >= m)
            }
        }
    }
    ;
    c._runActionsRange = function(a, c, e, f) {}
    ;
    createjs.AbstractTween = createjs.promote(a, "EventDispatcher")
}
)();
this.createjs = this.createjs || {};
(function() {
    function a(b, d) {
        this.AbstractTween_constructor(d);
        this.pluginData = null;
        this.target = b;
        this.passive = !1;
        this._stepTail = this._stepHead = new c(null,0,0,{},null,!0);
        this._stepPosition = 0;
        this._injected = this._pluginIds = this._plugins = this._actionTail = this._actionHead = null;
        d && (this.pluginData = d.pluginData,
        d.override && a.removeTweens(b));
        this.pluginData || (this.pluginData = {});
        this._init(d)
    }
    function c(a, b, c, d, k, q) {
        this.next = null;
        this.prev = a;
        this.t = b;
        this.d = c;
        this.props = d;
        this.ease = k;
        this.passive = q;
        this.index = a ? a.index + 1 : 0
    }
    function b(a, b, c, d, k) {
        this.next = null;
        this.prev = a;
        this.t = b;
        this.d = 0;
        this.scope = c;
        this.funct = d;
        this.params = k
    }
    var d = createjs.extend(a, createjs.AbstractTween);
    a.IGNORE = {};
    a._tweens = [];
    a._plugins = null;
    a._tweenHead = null;
    a._tweenTail = null;
    a.get = function(b, c) {
        return new a(b,c)
    }
    ;
    a.tick = function(b, c) {
        for (var e = a._tweenHead; e; ) {
            var d = e._next;
            c && !e.ignoreGlobalPause || e._paused || e.advance(e.useTicks ? 1 : b);
            e = d
        }
    }
    ;
    a.handleEvent = function(a) {
        "tick" === a.type && this.tick(a.delta, a.paused)
    }
    ;
    a.removeTweens = function(b) {
        if (b.tweenjs_count) {
            for (var c = a._tweenHead; c; ) {
                var e = c._next;
                c.target === b && a._register(c, !0);
                c = e
            }
            b.tweenjs_count = 0
        }
    }
    ;
    a.removeAllTweens = function() {
        for (var b = a._tweenHead; b; ) {
            var c = b._next;
            b._paused = !0;
            b.target && (b.target.tweenjs_count = 0);
            b._next = b._prev = null;
            b = c
        }
        a._tweenHead = a._tweenTail = null
    }
    ;
    a.hasActiveTweens = function(b) {
        return b ? !!b.tweenjs_count : !!a._tweenHead
    }
    ;
    a._installPlugin = function(b) {
        for (var c = b.priority = b.priority || 0, d = a._plugins = a._plugins || [], e = 0, k = d.length; e < k && !(c < d[e].priority); e++)
            ;
        d.splice(e, 0, b)
    }
    ;
    a._register = function(b, c) {
        var d = b.target;
        if (!c && b._paused)
            d && (d.tweenjs_count = d.tweenjs_count ? d.tweenjs_count + 1 : 1),
            (d = a._tweenTail) ? (a._tweenTail = d._next = b,
            b._prev = d) : a._tweenHead = a._tweenTail = b,
            !a._inited && createjs.Ticker && (createjs.Ticker.addEventListener("tick", a),
            a._inited = !0);
        else if (c && !b._paused) {
            d && d.tweenjs_count--;
            d = b._next;
            var e = b._prev;
            d ? d._prev = e : a._tweenTail = e;
            e ? e._next = d : a._tweenHead = d;
            b._next = b._prev = null
        }
        b._paused = c
    }
    ;
    d.wait = function(a, b) {
        0 < a && this._addStep(+a, this._stepTail.props, null, b);
        return this
    }
    ;
    d.to = function(a, b, c) {
        if (null == b || 0 > b)
            b = 0;
        b = this._addStep(+b, null, c);
        this._appendProps(a, b);
        return this
    }
    ;
    d.label = function(a) {
        this.addLabel(a, this.duration);
        return this
    }
    ;
    d.call = function(a, b, c) {
        return this._addAction(c || this.target, a, b || [this])
    }
    ;
    d.set = function(a, b) {
        return this._addAction(b || this.target, this._set, [a])
    }
    ;
    d.play = function(a) {
        return this._addAction(a || this, this._set, [{
            paused: !1
        }])
    }
    ;
    d.pause = function(a) {
        return this._addAction(a || this, this._set, [{
            paused: !0
        }])
    }
    ;
    d.w = d.wait;
    d.t = d.to;
    d.c = d.call;
    d.s = d.set;
    d.toString = function() {
        return "[Tween]"
    }
    ;
    d.clone = function() {
        throw "Tween can not be cloned.";
    }
    ;
    d._addPlugin = function(a) {
        var b = this._pluginIds || (this._pluginIds = {})
          , c = a.ID;
        if (c && !b[c]) {
            b[c] = !0;
            b = this._plugins || (this._plugins = []);
            c = a.priority || 0;
            for (var d = 0, e = b.length; d < e; d++)
                if (c < b[d].priority) {
                    b.splice(d, 0, a);
                    return
                }
            b.push(a)
        }
    }
    ;
    d._updatePosition = function(a, b) {
        var c = this._stepHead.next
          , d = this.position
          , e = this.duration;
        if (this.target && c) {
            for (var f = c.next; f && f.t <= d; )
                c = c.next,
                f = c.next;
            this._updateTargetProps(c, b ? 0 === e ? 1 : d / e : (d - c.t) / c.d, b)
        }
        this._stepPosition = c ? d - c.t : 0
    }
    ;
    d._updateTargetProps = function(b, c, d) {
        if (!(this.passive = !!b.passive)) {
            var e, f = b.prev.props, g = b.props;
            if (e = b.ease)
                c = e(c, 0, 1, 1);
            e = this._plugins;
            var m;
            a: for (m in f) {
                var n = f[m];
                var p = g[m];
                n = n !== p && "number" === typeof n ? n + (p - n) * c : 1 <= c ? p : n;
                if (e) {
                    p = 0;
                    for (var t = e.length; p < t; p++) {
                        var r = e[p].change(this, b, m, n, c, d);
                        if (r === a.IGNORE)
                            continue a;
                        void 0 !== r && (n = r)
                    }
                }
                this.target[m] = n
            }
        }
    }
    ;
    d._runActionsRange = function(a, b, c, d) {
        var e = (c = a > b) ? this._actionTail : this._actionHead
          , f = b
          , h = a;
        c && (f = a,
        h = b);
        for (var g = this.position; e; ) {
            var p = e.t;
            if (p === b || p > h && p < f || d && p === a)
                if (e.funct.apply(e.scope, e.params),
                g !== this.position)
                    return !0;
            e = c ? e.prev : e.next
        }
    }
    ;
    d._appendProps = function(b, c, d) {
        var e = this._stepHead.props, f = this.target, g = a._plugins, m, n, p = c.prev, t = p.props, r = c.props || (c.props = this._cloneProps(t)), A = {};
        for (m in b)
            if (b.hasOwnProperty(m) && (A[m] = r[m] = b[m],
            void 0 === e[m])) {
                var v = void 0;
                if (g)
                    for (n = g.length - 1; 0 <= n; n--) {
                        var z = g[n].init(this, m, v);
                        void 0 !== z && (v = z);
                        if (v === a.IGNORE) {
                            delete r[m];
                            delete A[m];
                            break
                        }
                    }
                v !== a.IGNORE && (void 0 === v && (v = f[m]),
                t[m] = void 0 === v ? null : v)
            }
        for (m in A) {
            var D;
            for (b = p; (D = b) && (b = D.prev); )
                if (b.props !== D.props) {
                    if (void 0 !== b.props[m])
                        break;
                    b.props[m] = t[m]
                }
        }
        if (!1 !== d && (g = this._plugins))
            for (n = g.length - 1; 0 <= n; n--)
                g[n].step(this, c, A);
        if (d = this._injected)
            this._injected = null,
            this._appendProps(d, c, !1)
    }
    ;
    d._injectProp = function(a, b) {
        (this._injected || (this._injected = {}))[a] = b
    }
    ;
    d._addStep = function(a, b, d, h) {
        b = new c(this._stepTail,this.duration,a,b,d,h || !1);
        this.duration += a;
        return this._stepTail = this._stepTail.next = b
    }
    ;
    d._addAction = function(a, c, d) {
        a = new b(this._actionTail,this.duration,a,c,d);
        this._actionTail ? this._actionTail.next = a : this._actionHead = a;
        this._actionTail = a;
        return this
    }
    ;
    d._set = function(a) {
        for (var b in a)
            this[b] = a[b]
    }
    ;
    d._cloneProps = function(a) {
        var b = {}, c;
        for (c in a)
            b[c] = a[c];
        return b
    }
    ;
    createjs.Tween = createjs.promote(a, "AbstractTween")
}
)();
this.createjs = this.createjs || {};
(function() {
    function a(a) {
        if (a instanceof Array || null == a && 1 < arguments.length) {
            var b = a;
            var c = arguments[1];
            a = arguments[2]
        } else
            a && (b = a.tweens,
            c = a.labels);
        this.AbstractTween_constructor(a);
        this.tweens = [];
        b && this.addTween.apply(this, b);
        this.setLabels(c);
        this._init(a)
    }
    var c = createjs.extend(a, createjs.AbstractTween);
    c.addTween = function(a) {
        a._parent && a._parent.removeTween(a);
        var b = arguments.length;
        if (1 < b) {
            for (var c = 0; c < b; c++)
                this.addTween(arguments[c]);
            return arguments[b - 1]
        }
        if (0 === b)
            return null;
        this.tweens.push(a);
        a._parent = this;
        a.paused = !0;
        b = a.duration;
        0 < a.loop && (b *= a.loop + 1);
        b > this.duration && (this.duration = b);
        0 <= this.rawPosition && a.setPosition(this.rawPosition);
        return a
    }
    ;
    c.removeTween = function(a) {
        var b = arguments.length;
        if (1 < b) {
            for (var c = !0, f = 0; f < b; f++)
                c = c && this.removeTween(arguments[f]);
            return c
        }
        if (0 === b)
            return !0;
        b = this.tweens;
        for (f = b.length; f--; )
            if (b[f] === a)
                return b.splice(f, 1),
                a._parent = null,
                a.duration >= this.duration && this.updateDuration(),
                !0;
        return !1
    }
    ;
    c.updateDuration = function() {
        for (var a = this.duration = 0, c = this.tweens.length; a < c; a++) {
            var e = this.tweens[a]
              , f = e.duration;
            0 < e.loop && (f *= e.loop + 1);
            f > this.duration && (this.duration = f)
        }
    }
    ;
    c.toString = function() {
        return "[Timeline]"
    }
    ;
    c.clone = function() {
        throw "Timeline can not be cloned.";
    }
    ;
    c._updatePosition = function(a, c) {
        for (var b = this.position, d = 0, g = this.tweens.length; d < g; d++)
            this.tweens[d].setPosition(b, !0, a)
    }
    ;
    c._runActionsRange = function(a, c, e, f) {
        for (var b = this.position, d = 0, k = this.tweens.length; d < k; d++)
            if (this.tweens[d]._runActions(a, c, e, f),
            b !== this.position)
                return !0
    }
    ;
    createjs.Timeline = createjs.promote(a, "AbstractTween")
}
)();
this.createjs = this.createjs || {};
(function() {
    function a() {
        throw "Ease cannot be instantiated.";
    }
    a.linear = function(a) {
        return a
    }
    ;
    a.none = a.linear;
    a.get = function(a) {
        -1 > a ? a = -1 : 1 < a && (a = 1);
        return function(b) {
            return 0 == a ? b : 0 > a ? b * (b * -a + 1 + a) : b * ((2 - b) * a + (1 - a))
        }
    }
    ;
    a.getPowIn = function(a) {
        return function(b) {
            return Math.pow(b, a)
        }
    }
    ;
    a.getPowOut = function(a) {
        return function(b) {
            return 1 - Math.pow(1 - b, a)
        }
    }
    ;
    a.getPowInOut = function(a) {
        return function(b) {
            return 1 > (b *= 2) ? .5 * Math.pow(b, a) : 1 - .5 * Math.abs(Math.pow(2 - b, a))
        }
    }
    ;
    a.quadIn = a.getPowIn(2);
    a.quadOut = a.getPowOut(2);
    a.quadInOut = a.getPowInOut(2);
    a.cubicIn = a.getPowIn(3);
    a.cubicOut = a.getPowOut(3);
    a.cubicInOut = a.getPowInOut(3);
    a.quartIn = a.getPowIn(4);
    a.quartOut = a.getPowOut(4);
    a.quartInOut = a.getPowInOut(4);
    a.quintIn = a.getPowIn(5);
    a.quintOut = a.getPowOut(5);
    a.quintInOut = a.getPowInOut(5);
    a.sineIn = function(a) {
        return 1 - Math.cos(a * Math.PI / 2)
    }
    ;
    a.sineOut = function(a) {
        return Math.sin(a * Math.PI / 2)
    }
    ;
    a.sineInOut = function(a) {
        return -.5 * (Math.cos(Math.PI * a) - 1)
    }
    ;
    a.getBackIn = function(a) {
        return function(b) {
            return b * b * ((a + 1) * b - a)
        }
    }
    ;
    a.backIn = a.getBackIn(1.7);
    a.getBackOut = function(a) {
        return function(b) {
            return --b * b * ((a + 1) * b + a) + 1
        }
    }
    ;
    a.backOut = a.getBackOut(1.7);
    a.getBackInOut = function(a) {
        a *= 1.525;
        return function(b) {
            return 1 > (b *= 2) ? .5 * b * b * ((a + 1) * b - a) : .5 * ((b -= 2) * b * ((a + 1) * b + a) + 2)
        }
    }
    ;
    a.backInOut = a.getBackInOut(1.7);
    a.circIn = function(a) {
        return -(Math.sqrt(1 - a * a) - 1)
    }
    ;
    a.circOut = function(a) {
        return Math.sqrt(1 - --a * a)
    }
    ;
    a.circInOut = function(a) {
        return 1 > (a *= 2) ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
    }
    ;
    a.bounceIn = function(c) {
        return 1 - a.bounceOut(1 - c)
    }
    ;
    a.bounceOut = function(a) {
        return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
    }
    ;
    a.bounceInOut = function(c) {
        return .5 > c ? .5 * a.bounceIn(2 * c) : .5 * a.bounceOut(2 * c - 1) + .5
    }
    ;
    a.getElasticIn = function(a, b) {
        var c = 2 * Math.PI;
        return function(d) {
            if (0 == d || 1 == d)
                return d;
            var e = b / c * Math.asin(1 / a);
            return -(a * Math.pow(2, 10 * --d) * Math.sin((d - e) * c / b))
        }
    }
    ;
    a.elasticIn = a.getElasticIn(1, .3);
    a.getElasticOut = function(a, b) {
        var c = 2 * Math.PI;
        return function(d) {
            return 0 == d || 1 == d ? d : a * Math.pow(2, -10 * d) * Math.sin((d - b / c * Math.asin(1 / a)) * c / b) + 1
        }
    }
    ;
    a.elasticOut = a.getElasticOut(1, .3);
    a.getElasticInOut = function(a, b) {
        var c = 2 * Math.PI;
        return function(d) {
            var e = b / c * Math.asin(1 / a);
            return 1 > (d *= 2) ? -.5 * a * Math.pow(2, 10 * --d) * Math.sin((d - e) * c / b) : a * Math.pow(2, -10 * --d) * Math.sin((d - e) * c / b) * .5 + 1
        }
    }
    ;
    a.elasticInOut = a.getElasticInOut(1, .3 * 1.5);
    createjs.Ease = a
}
)();
this.createjs = this.createjs || {};
(function() {
    function a() {
        throw "MotionGuidePlugin cannot be instantiated.";
    }
    a.priority = 0;
    a.ID = "MotionGuide";
    a.install = function() {
        createjs.Tween._installPlugin(a);
        return createjs.Tween.IGNORE
    }
    ;
    a.init = function(c, b, d) {
        "guide" == b && c._addPlugin(a)
    }
    ;
    a.step = function(c, b, d) {
        for (var e in d)
            if ("guide" === e) {
                var f = b.props.guide
                  , g = a._solveGuideData(d.guide, f);
                f.valid = !g;
                var h = f.endData;
                c._injectProp("x", h.x);
                c._injectProp("y", h.y);
                if (g || !f.orient)
                    break;
                f.startOffsetRot = (void 0 === b.prev.props.rotation ? c.target.rotation || 0 : b.prev.props.rotation) - f.startData.rotation;
                if ("fixed" == f.orient)
                    f.endAbsRot = h.rotation + f.startOffsetRot,
                    f.deltaRotation = 0;
                else {
                    g = void 0 === d.rotation ? c.target.rotation || 0 : d.rotation;
                    h = g - f.endData.rotation - f.startOffsetRot;
                    var k = h % 360;
                    f.endAbsRot = g;
                    switch (f.orient) {
                    case "auto":
                        f.deltaRotation = h;
                        break;
                    case "cw":
                        f.deltaRotation = (k + 360) % 360 + 360 * Math.abs(h / 360 | 0);
                        break;
                    case "ccw":
                        f.deltaRotation = (k - 360) % 360 + -360 * Math.abs(h / 360 | 0)
                    }
                }
                c._injectProp("rotation", f.endAbsRot)
            }
    }
    ;
    a.change = function(c, b, d, e, f, g) {
        if ((e = b.props.guide) && b.props !== b.prev.props && e !== b.prev.props.guide) {
            if ("guide" === d && !e.valid || "x" == d || "y" == d || "rotation" === d && e.orient)
                return createjs.Tween.IGNORE;
            a._ratioToPositionData(f, e, c.target)
        }
    }
    ;
    a.debug = function(c, b, d) {
        c = c.guide || c;
        var e = a._findPathProblems(c);
        e && console.error("MotionGuidePlugin Error found: \n" + e);
        if (!b)
            return e;
        var f, g = c.path, h = g.length;
        b.save();
        b.lineCap = "round";
        b.lineJoin = "miter";
        b.beginPath();
        b.moveTo(g[0], g[1]);
        for (f = 2; f < h; f += 4)
            b.quadraticCurveTo(g[f], g[f + 1], g[f + 2], g[f + 3]);
        b.strokeStyle = "black";
        b.lineWidth = 4.5;
        b.stroke();
        b.strokeStyle = "white";
        b.lineWidth = 3;
        b.stroke();
        b.closePath();
        g = d.length;
        if (d && g) {
            h = {};
            var k = {};
            a._solveGuideData(c, h);
            for (f = 0; f < g; f++)
                h.orient = "fixed",
                a._ratioToPositionData(d[f], h, k),
                b.beginPath(),
                b.moveTo(k.x, k.y),
                b.lineTo(k.x + 9 * Math.cos(.0174533 * k.rotation), k.y + 9 * Math.sin(.0174533 * k.rotation)),
                b.strokeStyle = "black",
                b.lineWidth = 4.5,
                b.stroke(),
                b.strokeStyle = "red",
                b.lineWidth = 3,
                b.stroke(),
                b.closePath()
        }
        b.restore();
        return e
    }
    ;
    a._solveGuideData = function(c, b) {
        var d;
        if (d = a.debug(c))
            return d;
        var e = b.path = c.path;
        b.orient = c.orient;
        b.subLines = [];
        b.totalLength = 0;
        b.startOffsetRot = 0;
        b.deltaRotation = 0;
        b.startData = {
            ratio: 0
        };
        b.endData = {
            ratio: 1
        };
        b.animSpan = 1;
        var f = e.length, g, h = {};
        var k = e[0];
        var q = e[1];
        for (d = 2; d < f; d += 4) {
            var m = e[d];
            var n = e[d + 1];
            var p = e[d + 2];
            var t = e[d + 3];
            var r = {
                weightings: [],
                estLength: 0,
                portion: 0
            }
              , A = k;
            var v = q;
            for (g = 1; 10 >= g; g++)
                a._getParamsForCurve(k, q, m, n, p, t, g / 10, !1, h),
                A = h.x - A,
                v = h.y - v,
                v = Math.sqrt(A * A + v * v),
                r.weightings.push(v),
                r.estLength += v,
                A = h.x,
                v = h.y;
            b.totalLength += r.estLength;
            for (g = 0; 10 > g; g++)
                v = r.estLength,
                r.weightings[g] /= v;
            b.subLines.push(r);
            k = p;
            q = t
        }
        v = b.totalLength;
        e = b.subLines.length;
        for (d = 0; d < e; d++)
            b.subLines[d].portion = b.subLines[d].estLength / v;
        d = isNaN(c.start) ? 0 : c.start;
        e = isNaN(c.end) ? 1 : c.end;
        a._ratioToPositionData(d, b, b.startData);
        a._ratioToPositionData(e, b, b.endData);
        b.startData.ratio = d;
        b.endData.ratio = e;
        b.animSpan = b.endData.ratio - b.startData.ratio
    }
    ;
    a._ratioToPositionData = function(c, b, d) {
        var e = b.subLines, f, g = 0, h = c * b.animSpan + b.startData.ratio;
        var k = e.length;
        for (f = 0; f < k; f++) {
            var q = e[f].portion;
            if (g + q >= h) {
                var m = f;
                break
            }
            g += q
        }
        void 0 === m && (m = k - 1,
        g -= q);
        e = e[m].weightings;
        var n = q;
        k = e.length;
        for (f = 0; f < k; f++) {
            q = e[f] * n;
            if (g + q >= h)
                break;
            g += q
        }
        m = 4 * m + 2;
        k = b.path;
        a._getParamsForCurve(k[m - 2], k[m - 1], k[m], k[m + 1], k[m + 2], k[m + 3], f / 10 + (h - g) / q * .1, b.orient, d);
        b.orient && (d.rotation = .99999 <= c && 1.00001 >= c && void 0 !== b.endAbsRot ? b.endAbsRot : d.rotation + (b.startOffsetRot + c * b.deltaRotation));
        return d
    }
    ;
    a._getParamsForCurve = function(a, b, d, e, f, g, h, k, q) {
        var c = 1 - h;
        q.x = c * c * a + 2 * c * h * d + h * h * f;
        q.y = c * c * b + 2 * c * h * e + h * h * g;
        k && (q.rotation = 57.2957795 * Math.atan2((e - b) * c + (g - e) * h, (d - a) * c + (f - d) * h))
    }
    ;
    a._findPathProblems = function(a) {
        var b = a.path
          , c = b && b.length || 0;
        if (6 > c || (c - 2) % 4)
            return "\tCannot parse 'path' array due to invalid number of entries in path. There should be an odd number of points, at least 3 points, and 2 entries per point (x & y). See 'CanvasRenderingContext2D.quadraticCurveTo' for details as 'path' models a quadratic bezier.\n\nOnly [ " + (c + " ] values found. Expected: " + Math.max(4 * Math.ceil((c - 2) / 4) + 2, 6));
        for (var e = 0; e < c; e++)
            if (isNaN(b[e]))
                return "All data in path array must be numeric";
        b = a.start;
        if (isNaN(b) && void 0 !== b)
            return "'start' out of bounds. Expected 0 to 1, got: " + b;
        b = a.end;
        if (isNaN(b) && void 0 !== b)
            return "'end' out of bounds. Expected 0 to 1, got: " + b;
        if ((a = a.orient) && "fixed" != a && "auto" != a && "cw" != a && "ccw" != a)
            return 'Invalid orientation value. Expected ["fixed", "auto", "cw", "ccw", undefined], got: ' + a
    }
    ;
    createjs.MotionGuidePlugin = a
}
)();
this.createjs = this.createjs || {};
(function() {
    var a = createjs.TweenJS = createjs.TweenJS || {};
    a.version = "1.0.0";
    a.buildDate = "Thu, 14 Sep 2017 19:47:47 GMT"
}
)();
(function() {
    var a = "undefined" !== typeof window && "undefined" !== typeof window.document ? window.document : {}
      , c = "undefined" !== typeof module && module.exports
      , b = "undefined" !== typeof Element && "ALLOW_KEYBOARD_INPUT"in Element
      , d = function() {
        for (var b, c = ["requestFullscreen exitFullscreen fullscreenElement fullscreenEnabled fullscreenchange fullscreenerror".split(" "), "webkitRequestFullscreen webkitExitFullscreen webkitFullscreenElement webkitFullscreenEnabled webkitfullscreenchange webkitfullscreenerror".split(" "), "webkitRequestFullScreen webkitCancelFullScreen webkitCurrentFullScreenElement webkitCancelFullScreen webkitfullscreenchange webkitfullscreenerror".split(" "), "mozRequestFullScreen mozCancelFullScreen mozFullScreenElement mozFullScreenEnabled mozfullscreenchange mozfullscreenerror".split(" "), "msRequestFullscreen msExitFullscreen msFullscreenElement msFullscreenEnabled MSFullscreenChange MSFullscreenError".split(" ")], d = 0, e = c.length, f = {}; d < e; d++)
            if ((b = c[d]) && b[1]in a) {
                for (d = 0; d < b.length; d++)
                    f[c[0][d]] = b[d];
                return f
            }
        return !1
    }()
      , e = {
        change: d.fullscreenchange,
        error: d.fullscreenerror
    }
      , f = {
        request: function(c) {
            var e = d.requestFullscreen;
            c = c || a.documentElement;
            if (/5\.1[.\d]* Safari/.test(navigator.userAgent))
                c[e]();
            else
                c[e](b && Element.ALLOW_KEYBOARD_INPUT)
        },
        exit: function() {
            a[d.exitFullscreen]()
        },
        toggle: function(a) {
            this.isFullscreen ? this.exit() : this.request(a)
        },
        onchange: function(a) {
            this.on("change", a)
        },
        onerror: function(a) {
            this.on("error", a)
        },
        on: function(b, c) {
            var d = e[b];
            d && a.addEventListener(d, c, !1)
        },
        off: function(b, c) {
            var d = e[b];
            d && a.removeEventListener(d, c, !1)
        },
        raw: d
    };
    d ? (Object.defineProperties(f, {
        isFullscreen: {
            get: function() {
                return !!a[d.fullscreenElement]
            }
        },
        element: {
            enumerable: !0,
            get: function() {
                return a[d.fullscreenElement]
            }
        },
        enabled: {
            enumerable: !0,
            get: function() {
                return !!a[d.fullscreenEnabled]
            }
        }
    }),
    c ? module.exports = f : window.screenfull = f) : c ? module.exports = !1 : window.screenfull = !1
}
)();
(function() {
    function a(a) {
        a = String(a);
        return a.charAt(0).toUpperCase() + a.slice(1)
    }
    function c(a, b) {
        var c = -1
          , e = a ? a.length : 0;
        if ("number" == typeof e && -1 < e && e <= t)
            for (; ++c < e; )
                b(a[c], c, a);
        else
            d(a, b)
    }
    function b(b) {
        b = String(b).replace(/^ +| +$/g, "");
        return /^(?:webOS|i(?:OS|P))/.test(b) ? b : a(b)
    }
    function d(a, b) {
        for (var c in a)
            A.call(a, c) && b(a[c], c, a)
    }
    function e(b) {
        return null == b ? a(b) : v.call(b).slice(8, -1)
    }
    function f(a, b) {
        var c = null != a ? typeof a[b] : "number";
        return !/^(?:boolean|number|string|undefined)$/.test(c) && ("object" == c ? !!a[b] : !0)
    }
    function g(a) {
        return String(a).replace(/([ -])(?!$)/g, "$1?")
    }
    function h(a, b) {
        var d = null;
        c(a, function(c, e) {
            d = b(d, c, e, a)
        });
        return d
    }
    function k(a) {
        function c(c) {
            return h(c, function(c, d) {
                var e = d.pattern || g(d);
                !c && (c = RegExp("\\b" + e + " *\\d+[.\\w_]*", "i").exec(a) || RegExp("\\b" + e + " *\\w+-[\\w]*", "i").exec(a) || RegExp("\\b" + e + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)", "i").exec(a)) && ((c = String(d.label && !RegExp(e, "i").test(d.label) ? d.label : c).split("/"))[1] && !/[\d.]+/.test(c[0]) && (c[0] += " " + c[1]),
                d = d.label || d,
                c = b(c[0].replace(RegExp(e, "i"), d).replace(RegExp("; *(?:" + d + "[_-])?", "i"), " ").replace(RegExp("(" + d + ")[-_.]?(\\w)", "i"), "$1 $2")));
                return c
            })
        }
        function n(b) {
            return h(b, function(b, c) {
                return b || (RegExp(c + "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)", "i").exec(a) || 0)[1] || null
            })
        }
        var y = m
          , x = a && "object" == typeof a && "String" != e(a);
        x && (y = a,
        a = null);
        var q = y.navigator || {}
          , p = q.userAgent || "";
        a || (a = p);
        var t = x ? !!q.likeChrome : /\bChrome\b/.test(a) && !/internal|\n/i.test(v.toString())
          , A = x ? "Object" : "ScriptBridgingProxyObject"
          , z = x ? "Object" : "Environment"
          , D = x && y.java ? "JavaPackage" : e(y.java)
          , R = x ? "Object" : "RuntimeObject";
        z = (D = /\bJava/.test(D) && y.java) && e(y.environment) == z;
        var S = D ? "a" : "\u03b1", T = D ? "b" : "\u03b2", N = y.document || {}, G = y.operamini || y.opera, K = r.test(K = x && G ? G["[[Class]]"] : e(G)) ? K : G = null, l, L = a;
        x = [];
        var M = null
          , H = a == p;
        p = H && G && "function" == typeof G.version && G.version();
        var B = function(b) {
            return h(b, function(b, c) {
                return b || RegExp("\\b" + (c.pattern || g(c)) + "\\b", "i").exec(a) && (c.label || c)
            })
        }([{
            label: "EdgeHTML",
            pattern: "Edge"
        }, "Trident", {
            label: "WebKit",
            pattern: "AppleWebKit"
        }, "iCab", "Presto", "NetFront", "Tasman", "KHTML", "Gecko"])
          , u = function(b) {
            return h(b, function(b, c) {
                return b || RegExp("\\b" + (c.pattern || g(c)) + "\\b", "i").exec(a) && (c.label || c)
            })
        }(["Adobe AIR", "Arora", "Avant Browser", "Breach", "Camino", "Electron", "Epiphany", "Fennec", "Flock", "Galeon", "GreenBrowser", "iCab", "Iceweasel", "K-Meleon", "Konqueror", "Lunascape", "Maxthon", {
            label: "Microsoft Edge",
            pattern: "Edge"
        }, "Midori", "Nook Browser", "PaleMoon", "PhantomJS", "Raven", "Rekonq", "RockMelt", {
            label: "Samsung Internet",
            pattern: "SamsungBrowser"
        }, "SeaMonkey", {
            label: "Silk",
            pattern: "(?:Cloud9|Silk-Accelerated)"
        }, "Sleipnir", "SlimBrowser", {
            label: "SRWare Iron",
            pattern: "Iron"
        }, "Sunrise", "Swiftfox", "Waterfox", "WebPositive", "Opera Mini", {
            label: "Opera Mini",
            pattern: "OPiOS"
        }, "Opera", {
            label: "Opera",
            pattern: "OPR"
        }, "Chrome", {
            label: "Chrome Mobile",
            pattern: "(?:CriOS|CrMo)"
        }, {
            label: "Firefox",
            pattern: "(?:Firefox|Minefield)"
        }, {
            label: "Firefox for iOS",
            pattern: "FxiOS"
        }, {
            label: "IE",
            pattern: "IEMobile"
        }, {
            label: "IE",
            pattern: "MSIE"
        }, "Safari"])
          , C = c([{
            label: "BlackBerry",
            pattern: "BB10"
        }, "BlackBerry", {
            label: "Galaxy S",
            pattern: "GT-I9000"
        }, {
            label: "Galaxy S2",
            pattern: "GT-I9100"
        }, {
            label: "Galaxy S3",
            pattern: "GT-I9300"
        }, {
            label: "Galaxy S4",
            pattern: "GT-I9500"
        }, {
            label: "Galaxy S5",
            pattern: "SM-G900"
        }, {
            label: "Galaxy S6",
            pattern: "SM-G920"
        }, {
            label: "Galaxy S6 Edge",
            pattern: "SM-G925"
        }, {
            label: "Galaxy S7",
            pattern: "SM-G930"
        }, {
            label: "Galaxy S7 Edge",
            pattern: "SM-G935"
        }, "Google TV", "Lumia", "iPad", "iPod", "iPhone", "Kindle", {
            label: "Kindle Fire",
            pattern: "(?:Cloud9|Silk-Accelerated)"
        }, "Nexus", "Nook", "PlayBook", "PlayStation Vita", "PlayStation", "TouchPad", "Transformer", {
            label: "Wii U",
            pattern: "WiiU"
        }, "Wii", "Xbox One", {
            label: "Xbox 360",
            pattern: "Xbox"
        }, "Xoom"])
          , F = function(b) {
            return h(b, function(b, c, d) {
                return b || (c[C] || c[/^[a-z]+(?: +[a-z]+\b)*/i.exec(C)] || RegExp("\\b" + g(d) + "(?:\\b|\\w*\\d)", "i").exec(a)) && d
            })
        }({
            Apple: {
                iPad: 1,
                iPhone: 1,
                iPod: 1
            },
            Archos: {},
            Amazon: {
                Kindle: 1,
                "Kindle Fire": 1
            },
            Asus: {
                Transformer: 1
            },
            "Barnes & Noble": {
                Nook: 1
            },
            BlackBerry: {
                PlayBook: 1
            },
            Google: {
                "Google TV": 1,
                Nexus: 1
            },
            HP: {
                TouchPad: 1
            },
            HTC: {},
            LG: {},
            Microsoft: {
                Xbox: 1,
                "Xbox One": 1
            },
            Motorola: {
                Xoom: 1
            },
            Nintendo: {
                "Wii U": 1,
                Wii: 1
            },
            Nokia: {
                Lumia: 1
            },
            Samsung: {
                "Galaxy S": 1,
                "Galaxy S2": 1,
                "Galaxy S3": 1,
                "Galaxy S4": 1
            },
            Sony: {
                PlayStation: 1,
                "PlayStation Vita": 1
            }
        })
          , w = function(c) {
            return h(c, function(c, d) {
                var e = d.pattern || g(d);
                if (!c && (c = RegExp("\\b" + e + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(a))) {
                    var f = c
                      , h = d.label || d
                      , m = {
                        "10.0": "10",
                        "6.4": "10 Technical Preview",
                        "6.3": "8.1",
                        "6.2": "8",
                        "6.1": "Server 2008 R2 / 7",
                        "6.0": "Server 2008 / Vista",
                        "5.2": "Server 2003 / XP 64-bit",
                        "5.1": "XP",
                        "5.01": "2000 SP1",
                        "5.0": "2000",
                        "4.0": "NT",
                        "4.90": "ME"
                    };
                    e && h && /^Win/i.test(f) && !/^Windows Phone /i.test(f) && (m = m[/[\d.]+$/.exec(f)]) && (f = "Windows " + m);
                    f = String(f);
                    e && h && (f = f.replace(RegExp(e, "i"), h));
                    c = f = b(f.replace(/ ce$/i, " CE").replace(/\bhpw/i, "web").replace(/\bMacintosh\b/, "Mac OS").replace(/_PowerPC\b/i, " OS").replace(/\b(OS X) [^ \d]+/i, "$1").replace(/\bMac (OS X)\b/, "$1").replace(/\/(\d)/, " $1").replace(/_/g, ".").replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "").replace(/\bx86\.64\b/gi, "x86_64").replace(/\b(Windows Phone) OS\b/, "$1").replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1").split(" on ")[0])
                }
                return c
            })
        }(["Windows Phone", "Android", "CentOS", {
            label: "Chrome OS",
            pattern: "CrOS"
        }, "Debian", "Fedora", "FreeBSD", "Gentoo", "Haiku", "Kubuntu", "Linux Mint", "OpenBSD", "Red Hat", "SuSE", "Ubuntu", "Xubuntu", "Cygwin", "Symbian OS", "hpwOS", "webOS ", "webOS", "Tablet OS", "Tizen", "Linux", "Mac OS X", "Macintosh", "Mac", "Windows 98;", "Windows "]);
        B && (B = [B]);
        F && !C && (C = c([F]));
        if (l = /\bGoogle TV\b/.exec(C))
            C = l[0];
        /\bSimulator\b/i.test(a) && (C = (C ? C + " " : "") + "Simulator");
        "Opera Mini" == u && /\bOPiOS\b/.test(a) && x.push("running in Turbo/Uncompressed mode");
        "IE" == u && /\blike iPhone OS\b/.test(a) ? (l = k(a.replace(/like iPhone OS/, "")),
        F = l.manufacturer,
        C = l.product) : /^iP/.test(C) ? (u || (u = "Safari"),
        w = "iOS" + ((l = / OS ([\d_]+)/i.exec(a)) ? " " + l[1].replace(/_/g, ".") : "")) : "Konqueror" != u || /buntu/i.test(w) ? F && "Google" != F && (/Chrome/.test(u) && !/\bMobile Safari\b/i.test(a) || /\bVita\b/.test(C)) || /\bAndroid\b/.test(w) && /^Chrome/.test(u) && /\bVersion\//i.test(a) ? (u = "Android Browser",
        w = /\bAndroid\b/.test(w) ? w : "Android") : "Silk" == u ? (/\bMobi/i.test(a) || (w = "Android",
        x.unshift("desktop mode")),
        /Accelerated *= *true/i.test(a) && x.unshift("accelerated")) : "PaleMoon" == u && (l = /\bFirefox\/([\d.]+)\b/.exec(a)) ? x.push("identifying as Firefox " + l[1]) : "Firefox" == u && (l = /\b(Mobile|Tablet|TV)\b/i.exec(a)) ? (w || (w = "Firefox OS"),
        C || (C = l[1])) : !u || (l = !/\bMinefield\b/i.test(a) && /\b(?:Firefox|Safari)\b/.exec(u)) ? (u && !C && /[\/,]|^[^(]+?\)/.test(a.slice(a.indexOf(l + "/") + 8)) && (u = null),
        (l = C || F || w) && (C || F || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(w)) && (u = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(w) ? w : l) + " Browser")) : "Electron" == u && (l = (/\bChrome\/([\d.]+)\b/.exec(a) || 0)[1]) && x.push("Chromium " + l) : w = "Kubuntu";
        p || (p = n(["(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))", "Version", g(u), "(?:Firefox|Minefield|NetFront)"]));
        if (l = "iCab" == B && 3 < parseFloat(p) && "WebKit" || /\bOpera\b/.test(u) && (/\bOPR\b/.test(a) ? "Blink" : "Presto") || /\b(?:Midori|Nook|Safari)\b/i.test(a) && !/^(?:Trident|EdgeHTML)$/.test(B) && "WebKit" || !B && /\bMSIE\b/i.test(a) && ("Mac OS" == w ? "Tasman" : "Trident") || "WebKit" == B && /\bPlayStation\b(?! Vita\b)/i.test(u) && "NetFront")
            B = [l];
        "IE" == u && (l = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(a) || 0)[1]) ? (u += " Mobile",
        w = "Windows Phone " + (/\+$/.test(l) ? l : l + ".x"),
        x.unshift("desktop mode")) : /\bWPDesktop\b/i.test(a) ? (u = "IE Mobile",
        w = "Windows Phone 8.x",
        x.unshift("desktop mode"),
        p || (p = (/\brv:([\d.]+)/.exec(a) || 0)[1])) : "IE" != u && "Trident" == B && (l = /\brv:([\d.]+)/.exec(a)) && (u && x.push("identifying as " + u + (p ? " " + p : "")),
        u = "IE",
        p = l[1]);
        if (H) {
            if (f(y, "global"))
                if (D && (l = D.lang.System,
                L = l.getProperty("os.arch"),
                w = w || l.getProperty("os.name") + " " + l.getProperty("os.version")),
                z) {
                    try {
                        p = y.require("ringo/engine").version.join("."),
                        u = "RingoJS"
                    } catch (Q) {
                        (l = y.system) && l.global.system == y.system && (u = "Narwhal",
                        w || (w = l[0].os || null))
                    }
                    u || (u = "Rhino")
                } else
                    "object" == typeof y.process && !y.process.browser && (l = y.process) && ("object" == typeof l.versions && ("string" == typeof l.versions.electron ? (x.push("Node " + l.versions.node),
                    u = "Electron",
                    p = l.versions.electron) : "string" == typeof l.versions.nw && (x.push("Chromium " + p, "Node " + l.versions.node),
                    u = "NW.js",
                    p = l.versions.nw)),
                    u || (u = "Node.js",
                    L = l.arch,
                    w = l.platform,
                    p = (p = /[\d.]+/.exec(l.version)) ? p[0] : null));
            else
                e(l = y.runtime) == A ? (u = "Adobe AIR",
                w = l.flash.system.Capabilities.os) : e(l = y.phantom) == R ? (u = "PhantomJS",
                p = (l = l.version || null) && l.major + "." + l.minor + "." + l.patch) : "number" == typeof N.documentMode && (l = /\bTrident\/(\d+)/i.exec(a)) ? (p = [p, N.documentMode],
                (l = +l[1] + 4) != p[1] && (x.push("IE " + p[1] + " mode"),
                B && (B[1] = ""),
                p[1] = l),
                p = "IE" == u ? String(p[1].toFixed(1)) : p[0]) : "number" == typeof N.documentMode && /^(?:Chrome|Firefox)\b/.test(u) && (x.push("masking as " + u + " " + p),
                u = "IE",
                p = "11.0",
                B = ["Trident"],
                w = "Windows");
            w = w && b(w)
        }
        p && (l = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(p) || /(?:alpha|beta)(?: ?\d)?/i.exec(a + ";" + (H && q.appMinorVersion)) || /\bMinefield\b/i.test(a) && "a") && (M = /b/i.test(l) ? "beta" : "alpha",
        p = p.replace(RegExp(l + "\\+?$"), "") + ("beta" == M ? T : S) + (/\d+\+?/.exec(l) || ""));
        if ("Fennec" == u || "Firefox" == u && /\b(?:Android|Firefox OS)\b/.test(w))
            u = "Firefox Mobile";
        else if ("Maxthon" == u && p)
            p = p.replace(/\.[\d.]+/, ".x");
        else if (/\bXbox\b/i.test(C))
            "Xbox 360" == C && (w = null),
            "Xbox 360" == C && /\bIEMobile\b/.test(a) && x.unshift("mobile mode");
        else if (!/^(?:Chrome|IE|Opera)$/.test(u) && (!u || C || /Browser|Mobi/.test(u)) || "Windows CE" != w && !/Mobi/i.test(a))
            if ("IE" == u && H)
                try {
                    null === y.external && x.unshift("platform preview")
                } catch (Q) {
                    x.unshift("embedded")
                }
            else
                (/\bBlackBerry\b/.test(C) || /\bBB10\b/.test(a)) && (l = (RegExp(C.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(a) || 0)[1] || p) ? (l = [l, /BB10/.test(a)],
                w = (l[1] ? (C = null,
                F = "BlackBerry") : "Device Software") + " " + l[0],
                p = null) : this != d && "Wii" != C && (H && G || /Opera/.test(u) && /\b(?:MSIE|Firefox)\b/i.test(a) || "Firefox" == u && /\bOS X (?:\d+\.){2,}/.test(w) || "IE" == u && (w && !/^Win/.test(w) && 5.5 < p || /\bWindows XP\b/.test(w) && 8 < p || 8 == p && !/\bTrident\b/.test(a))) && !r.test(l = k.call(d, a.replace(r, "") + ";")) && l.name && (l = "ing as " + l.name + ((l = l.version) ? " " + l : ""),
                r.test(u) ? (/\bIE\b/.test(l) && "Mac OS" == w && (w = null),
                l = "identify" + l) : (l = "mask" + l,
                u = K ? b(K.replace(/([a-z])([A-Z])/g, "$1 $2")) : "Opera",
                /\bIE\b/.test(l) && (w = null),
                H || (p = null)),
                B = ["Presto"],
                x.push(l));
        else
            u += " Mobile";
        if (l = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(a) || 0)[1]) {
            l = [parseFloat(l.replace(/\.(\d)$/, ".0$1")), l];
            if ("Safari" == u && "+" == l[1].slice(-1))
                u = "WebKit Nightly",
                M = "alpha",
                p = l[1].slice(0, -1);
            else if (p == l[1] || p == (l[2] = (/\bSafari\/([\d.]+\+?)/i.exec(a) || 0)[1]))
                p = null;
            l[1] = (/\bChrome\/([\d.]+)/i.exec(a) || 0)[1];
            537.36 == l[0] && 537.36 == l[2] && 28 <= parseFloat(l[1]) && "WebKit" == B && (B = ["Blink"]);
            H && (t || l[1]) ? (B && (B[1] = "like Chrome"),
            l = l[1] || (l = l[0],
            530 > l ? 1 : 532 > l ? 2 : 532.05 > l ? 3 : 533 > l ? 4 : 534.03 > l ? 5 : 534.07 > l ? 6 : 534.1 > l ? 7 : 534.13 > l ? 8 : 534.16 > l ? 9 : 534.24 > l ? 10 : 534.3 > l ? 11 : 535.01 > l ? 12 : 535.02 > l ? "13+" : 535.07 > l ? 15 : 535.11 > l ? 16 : 535.19 > l ? 17 : 536.05 > l ? 18 : 536.1 > l ? 19 : 537.01 > l ? 20 : 537.11 > l ? "21+" : 537.13 > l ? 23 : 537.18 > l ? 24 : 537.24 > l ? 25 : 537.36 > l ? 26 : "Blink" != B ? "27" : "28")) : (B && (B[1] = "like Safari"),
            l = (l = l[0],
            400 > l ? 1 : 500 > l ? 2 : 526 > l ? 3 : 533 > l ? 4 : 534 > l ? "4+" : 535 > l ? 5 : 537 > l ? 6 : 538 > l ? 7 : 601 > l ? 8 : "8"));
            B && (B[1] += " " + (l += "number" == typeof l ? ".x" : /[.+]/.test(l) ? "" : "+"));
            "Safari" == u && (!p || 45 < parseInt(p)) && (p = l)
        }
        "Opera" == u && (l = /\bzbov|zvav$/.exec(w)) ? (u += " ",
        x.unshift("desktop mode"),
        "zvav" == l ? (u += "Mini",
        p = null) : u += "Mobile",
        w = w.replace(RegExp(" *" + l + "$"), "")) : "Safari" == u && /\bChrome\b/.exec(B && B[1]) && (x.unshift("desktop mode"),
        u = "Chrome Mobile",
        p = null,
        /\bOS X\b/.test(w) ? (F = "Apple",
        w = "iOS 4.3+") : w = null);
        p && 0 == p.indexOf(l = /[\d.]+$/.exec(w)) && -1 < a.indexOf("/" + l + "-") && (w = String(w.replace(l, "")).replace(/^ +| +$/g, ""));
        B && !/\b(?:Avant|Nook)\b/.test(u) && (/Browser|Lunascape|Maxthon/.test(u) || "Safari" != u && /^iOS/.test(w) && /\bSafari\b/.test(B[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(u) && B[1]) && (l = B[B.length - 1]) && x.push(l);
        x.length && (x = ["(" + x.join("; ") + ")"]);
        F && C && 0 > C.indexOf(F) && x.push("on " + F);
        C && x.push((/^on /.test(x[x.length - 1]) ? "" : "on ") + C);
        if (w) {
            var P = (l = / ([\d.+]+)$/.exec(w)) && "/" == w.charAt(w.length - l[0].length - 1);
            w = {
                architecture: 32,
                family: l && !P ? w.replace(l[0], "") : w,
                version: l ? l[1] : null,
                toString: function() {
                    var a = this.version;
                    return this.family + (a && !P ? " " + a : "") + (64 == this.architecture ? " 64-bit" : "")
                }
            }
        }
        (l = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(L)) && !/\bi686\b/i.test(L) ? (w && (w.architecture = 64,
        w.family = w.family.replace(RegExp(" *" + l), "")),
        u && (/\bWOW64\b/i.test(a) || H && /\w(?:86|32)$/.test(q.cpuClass || q.platform) && !/\bWin64; x64\b/i.test(a)) && x.unshift("32-bit")) : w && /^OS X/.test(w.family) && "Chrome" == u && 39 <= parseFloat(p) && (w.architecture = 64);
        a || (a = null);
        y = {};
        y.description = a;
        y.layout = B && B[0];
        y.manufacturer = F;
        y.name = u;
        y.prerelease = M;
        y.product = C;
        y.ua = a;
        y.version = u && p;
        y.os = w || {
            architecture: null,
            family: null,
            version: null,
            toString: function() {
                return "null"
            }
        };
        y.parse = k;
        y.toString = function() {
            return this.description || ""
        }
        ;
        y.version && x.unshift(p);
        y.name && x.unshift(u);
        w && u && (w != String(w).split(" ")[0] || w != u.split(" ")[0] && !C) && x.push(C ? "(" + w + ")" : "on " + w);
        x.length && (y.description = x.join(" "));
        return y
    }
    var q = {
        "function": !0,
        object: !0
    }
      , m = q[typeof window] && window || this
      , n = q[typeof exports] && exports;
    q = q[typeof module] && module && !module.nodeType && module;
    var p = n && q && "object" == typeof global && global;
    !p || p.global !== p && p.window !== p && p.self !== p || (m = p);
    var t = Math.pow(2, 53) - 1
      , r = /\bOpera/;
    p = Object.prototype;
    var A = p.hasOwnProperty
      , v = p.toString
      , z = k();
    "function" == typeof define && "object" == typeof define.amd && define.amd ? (m.platform = z,
    define(function() {
        return z
    })) : n && q ? d(z, function(a, b) {
        n[b] = a
    }) : m.platform = z
}
).call(this);
var s_bLandscape = !0, s_iScaleFactor = 1, s_bIsIphone = !1, s_iOffsetX, s_iOffsetY;
(function(a) {
    (jQuery.browser = jQuery.browser || {}).mobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
}
)(navigator.userAgent || navigator.vendor || window.opera);
$(window).resize(function() {
    sizeHandler()
});
function trace(a) {
    console.log(a)
}
function isChrome() {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
}
function isIOS() {
    var a = "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";");
    for (-1 !== navigator.userAgent.toLowerCase().indexOf("iphone") && (s_bIsIphone = !0); a.length; )
        if (navigator.platform === a.pop())
            return !0;
    return s_bIsIphone = !1
}
function getSize(a) {
    var c = a.toLowerCase()
      , b = window.document
      , d = b.documentElement;
    if (void 0 === window["inner" + a])
        a = d["client" + a];
    else if (window["inner" + a] != d["client" + a]) {
        var e = b.createElement("body");
        e.id = "vpw-test-b";
        e.style.cssText = "overflow:scroll";
        var f = b.createElement("div");
        f.id = "vpw-test-d";
        f.style.cssText = "position:absolute;top:-1000px";
        f.innerHTML = "<style>@media(" + c + ":" + d["client" + a] + "px){body#vpw-test-b div#vpw-test-d{" + c + ":7px!important}}</style>";
        e.appendChild(f);
        d.insertBefore(e, b.head);
        a = 7 == f["offset" + a] ? d["client" + a] : window["inner" + a];
        d.removeChild(e)
    } else
        a = window["inner" + a];
    return a
}
window.addEventListener("orientationchange", onOrientationChange);
function onOrientationChange() {
    window.matchMedia("(orientation: portrait)").matches && sizeHandler();
    window.matchMedia("(orientation: landscape)").matches && sizeHandler()
}
function getIOSWindowHeight() {
    return document.documentElement.clientWidth / window.innerWidth * window.innerHeight
}
function getHeightOfIOSToolbars() {
    var a = (0 === window.orientation ? screen.height : screen.width) - getIOSWindowHeight();
    return 1 < a ? a : 0
}
function sizeHandler() {
    window.scrollTo(0, 1);
    if ($("#canvas")) {
        var a = "safari" === platform.name.toLowerCase() ? getIOSWindowHeight() : getSize("Height");
        var c = getSize("Width")
          , b = Math.min(a / CANVAS_HEIGHT, c / CANVAS_WIDTH);
        c > a ? (EDGEBOARD_X = 0,
        EDGEBOARD_Y = 570,
        s_bLandscape = !0) : (EDGEBOARD_X = 350,
        EDGEBOARD_Y = 0,
        s_bLandscape = !1);
        var d = Math.round(CANVAS_WIDTH * b);
        b = Math.round(CANVAS_HEIGHT * b);
        if (b < a) {
            var e = a - b;
            b += e;
            d += CANVAS_WIDTH / CANVAS_HEIGHT * e
        } else
            d < c && (e = c - d,
            d += e,
            b += CANVAS_HEIGHT / CANVAS_WIDTH * e);
        e = a / 2 - b / 2;
        var f = c / 2 - d / 2
          , g = CANVAS_WIDTH / d;
        if (f * g < -EDGEBOARD_X || e * g < -EDGEBOARD_Y)
            b = Math.min(a / (CANVAS_HEIGHT - 2 * EDGEBOARD_Y), c / (CANVAS_WIDTH - 2 * EDGEBOARD_X)),
            d = CANVAS_WIDTH * b,
            b *= CANVAS_HEIGHT,
            e = (a - b) / 2,
            f = (c - d) / 2,
            g = CANVAS_WIDTH / d;
        s_iOffsetX = -1 * f * g;
        s_iOffsetY = -1 * e * g;
        0 <= e && (s_iOffsetY = 0);
        0 <= f && (s_iOffsetX = 0);
        null !== s_oGame && s_oGame.refreshButtonPos();
        null !== s_oMenu && s_oMenu.refreshButtonPos();
        s_iScaleFactor = Math.min(d / CANVAS_WIDTH, b / CANVAS_HEIGHT);
        s_bIsIphone ? (canvas = document.getElementById("canvas"),
        s_oStage.canvas.width = 2 * d,
        s_oStage.canvas.height = 2 * b,
        canvas.style.width = d + "px",
        canvas.style.height = b + "px",
        s_iScaleFactor = 2 * Math.min(d / CANVAS_WIDTH, b / CANVAS_HEIGHT),
        s_oStage.scaleX = s_oStage.scaleY = s_iScaleFactor) : s_bMobile || isChrome() ? ($("#canvas").css("width", d + "px"),
        $("#canvas").css("height", b + "px")) : (s_oStage.canvas.width = d,
        s_oStage.canvas.height = b,
        s_oStage.scaleX = s_oStage.scaleY = s_iScaleFactor);
        0 > e || (e = (a - b) / 2);
        $("#canvas").css("top", e + "px");
        $("#canvas").css("left", f + "px");
        fullscreenHandler()
    }
}
function createBitmap(a, c, b) {
    var d = new createjs.Bitmap(a)
      , e = new createjs.Shape;
    c && b ? e.graphics.beginFill("#fff").drawRect(0, 0, c, b) : e.graphics.beginFill("#ff0").drawRect(0, 0, a.width, a.height);
    d.hitArea = e;
    return d
}
function createSprite(a, c, b, d, e, f) {
    a = null !== c ? new createjs.Sprite(a,c) : new createjs.Sprite(a);
    c = new createjs.Shape;
    c.graphics.beginFill("#000000").drawRect(-b, -d, e, f);
    a.hitArea = c;
    return a
}
function randomFloatBetween(a, c, b) {
    "undefined" === typeof b && (b = 2);
    return parseFloat(Math.min(a + Math.random() * (c - a), c).toFixed(b))
}
function rotateVector2D(a, c) {
    var b = c.getX() * Math.cos(a) + c.getY() * Math.sin(a)
      , d = c.getX() * -Math.sin(a) + c.getY() * Math.cos(a);
    c.set(b, d)
}
function tweenVectorsOnX(a, c, b) {
    return a + b * (c - a)
}
this.tweenVectors = function(a, c, b) {
    var d = new CVector2;
    d.set(a.getX() + b * (c.getX() - a.getX()), a.getY() + b * (c.getY() - a.getY()));
    return d
}
;
function shuffle(a) {
    for (var c = a.length, b, d; 0 !== c; )
        d = Math.floor(Math.random() * c),
        --c,
        b = a[c],
        a[c] = a[d],
        a[d] = b;
    return a
}
function bubbleSort(a) {
    do {
        var c = !1;
        for (var b = 0; b < a.length - 1; b++)
            a[b] > a[b + 1] && (c = a[b],
            a[b] = a[b + 1],
            a[b + 1] = c,
            c = !0)
    } while (c)
}
function compare(a, c) {
    return a.index > c.index ? -1 : a.index < c.index ? 1 : 0
}
function easeLinear(a, c, b, d) {
    return b * a / d + c
}
function easeInQuad(a, c, b, d) {
    return b * (a /= d) * a + c
}
function easeInSine(a, c, b, d) {
    return -b * Math.cos(a / d * (Math.PI / 2)) + b + c
}
function easeInCubic(a, c, b, d) {
    return b * (a /= d) * a * a + c
}
function getTrajectoryPoint(a, c) {
    var b = new createjs.Point
      , d = (1 - a) * (1 - a)
      , e = a * a;
    b.x = d * c.start.x + 2 * (1 - a) * a * c.traj.x + e * c.end.x;
    b.y = d * c.start.y + 2 * (1 - a) * a * c.traj.y + e * c.end.y;
    return b
}
function formatTime(a) {
    a /= 1E3;
    var c = Math.floor(a / 60);
    a = Math.floor(a - 60 * c);
    var b = "";
    b = 10 > c ? b + ("0" + c + ":") : b + (c + ":");
    return 10 > a ? b + ("0" + a) : b + a
}
function degreesToRadians(a) {
    return a * Math.PI / 180
}
function checkRectCollision(a, c) {
    var b = getBounds(a, .9);
    var d = getBounds(c, .98);
    return calculateIntersection(b, d)
}
function distance(a, c) {
    return Math.sqrt((c.x - a.x) * (c.x - a.x) + (c.y - a.y) * (c.y - a.y))
}
function collisionWithCircle(a, c, b) {
    var d = a.getX() - c.getX();
    a = a.getY() - c.getY();
    return Math.sqrt(d * d + a * a) < PLAYER_RADIUS * b + CELL_SIZE * b ? !0 : !1
}
function calculateIntersection(a, c) {
    var b, d, e, f;
    var g = a.x + (b = a.width / 2);
    var h = a.y + (d = a.height / 2);
    var k = c.x + (e = c.width / 2);
    var q = c.y + (f = c.height / 2);
    g = Math.abs(g - k) - (b + e);
    h = Math.abs(h - q) - (d + f);
    return 0 > g && 0 > h ? (g = Math.min(Math.min(a.width, c.width), -g),
    h = Math.min(Math.min(a.height, c.height), -h),
    {
        x: Math.max(a.x, c.x),
        y: Math.max(a.y, c.y),
        width: g,
        height: h,
        rect1: a,
        rect2: c
    }) : null
}
function getBounds(a, c) {
    var b = {
        x: Infinity,
        y: Infinity,
        width: 0,
        height: 0
    };
    if (a instanceof createjs.Container) {
        b.x2 = -Infinity;
        b.y2 = -Infinity;
        var d = a.children, e = d.length, f;
        for (f = 0; f < e; f++) {
            var g = getBounds(d[f], 1);
            g.x < b.x && (b.x = g.x);
            g.y < b.y && (b.y = g.y);
            g.x + g.width > b.x2 && (b.x2 = g.x + g.width);
            g.y + g.height > b.y2 && (b.y2 = g.y + g.height)
        }
        Infinity == b.x && (b.x = 0);
        Infinity == b.y && (b.y = 0);
        Infinity == b.x2 && (b.x2 = 0);
        Infinity == b.y2 && (b.y2 = 0);
        b.width = b.x2 - b.x;
        b.height = b.y2 - b.y;
        delete b.x2;
        delete b.y2
    } else {
        if (a instanceof createjs.Bitmap) {
            e = a.sourceRect || a.image;
            f = e.width * c;
            var h = e.height * c
        } else if (a instanceof createjs.Sprite)
            if (a.spriteSheet._frames && a.spriteSheet._frames[a.currentFrame] && a.spriteSheet._frames[a.currentFrame].image) {
                e = a.spriteSheet.getFrame(a.currentFrame);
                f = e.rect.width;
                h = e.rect.height;
                d = e.regX;
                var k = e.regY
            } else
                b.x = a.x || 0,
                b.y = a.y || 0;
        else
            b.x = a.x || 0,
            b.y = a.y || 0;
        d = d || 0;
        f = f || 0;
        k = k || 0;
        h = h || 0;
        b.regX = d;
        b.regY = k;
        e = a.localToGlobal(0 - d, 0 - k);
        g = a.localToGlobal(f - d, h - k);
        f = a.localToGlobal(f - d, 0 - k);
        d = a.localToGlobal(0 - d, h - k);
        b.x = Math.min(Math.min(Math.min(e.x, g.x), f.x), d.x);
        b.y = Math.min(Math.min(Math.min(e.y, g.y), f.y), d.y);
        b.width = Math.max(Math.max(Math.max(e.x, g.x), f.x), d.x) - b.x;
        b.height = Math.max(Math.max(Math.max(e.y, g.y), f.y), d.y) - b.y
    }
    return b
}
function NoClickDelay(a) {
    this.element = a;
    window.Touch && this.element.addEventListener("touchstart", this, !1)
}
function shuffle(a) {
    for (var c = a.length, b, d; 0 < c; )
        d = Math.floor(Math.random() * c),
        c--,
        b = a[c],
        a[c] = a[d],
        a[d] = b;
    return a
}
NoClickDelay.prototype = {
    handleEvent: function(a) {
        switch (a.type) {
        case "touchstart":
            this.onTouchStart(a);
            break;
        case "touchmove":
            this.onTouchMove(a);
            break;
        case "touchend":
            this.onTouchEnd(a)
        }
    },
    onTouchStart: function(a) {
        a.preventDefault();
        this.moved = !1;
        this.element.addEventListener("touchmove", this, !1);
        this.element.addEventListener("touchend", this, !1)
    },
    onTouchMove: function(a) {
        this.moved = !0
    },
    onTouchEnd: function(a) {
        this.element.removeEventListener("touchmove", this, !1);
        this.element.removeEventListener("touchend", this, !1);
        if (!this.moved) {
            a = document.elementFromPoint(a.changedTouches[0].clientX, a.changedTouches[0].clientY);
            3 == a.nodeType && (a = a.parentNode);
            var c = document.createEvent("MouseEvents");
            c.initEvent("click", !0, !0);
            a.dispatchEvent(c)
        }
    }
};
(function() {
    function a(a) {
        var b = {
            focus: "visible",
            focusin: "visible",
            pageshow: "visible",
            blur: "hidden",
            focusout: "hidden",
            pagehide: "hidden"
        };
        a = a || window.event;
        a.type in b ? document.body.className = b[a.type] : (document.body.className = this[c] ? "hidden" : "visible",
        "hidden" === document.body.className ? s_oMain.stopUpdate() : s_oMain.startUpdate())
    }
    var c = "hidden";
    c in document ? document.addEventListener("visibilitychange", a) : (c = "mozHidden")in document ? document.addEventListener("mozvisibilitychange", a) : (c = "webkitHidden")in document ? document.addEventListener("webkitvisibilitychange", a) : (c = "msHidden")in document ? document.addEventListener("msvisibilitychange", a) : "onfocusin"in document ? document.onfocusin = document.onfocusout = a : window.onpageshow = window.onpagehide = window.onfocus = window.onblur = a
}
)();
function ctlArcadeResume() {
    null !== s_oMain && s_oMain.startUpdate()
}
function ctlArcadePause() {
    null !== s_oMain && s_oMain.stopUpdate()
}
function getParamValue(a) {
    for (var c = window.location.search.substring(1).split("&"), b = 0; b < c.length; b++) {
        var d = c[b].split("=");
        if (d[0] == a)
            return d[1]
    }
}
function playSound(a, c, b) {
    return !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (s_aSounds[a].play(),
    s_aSounds[a].volume(c),
    s_aSounds[a].loop(b),
    s_aSounds[a]) : null
}
function stopSound(a) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[a].stop()
}
function setVolume(a, c) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[a].volume(c)
}
function setMute(a, c) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[a].mute(c)
}
function fullscreenHandler() {
    ENABLE_FULLSCREEN && screenfull.enabled && (s_bFullscreen = screenfull.isFullscreen,
    null !== s_oInterface && s_oInterface.resetFullscreenBut(),
    null !== s_oMenu && s_oMenu.resetFullscreenBut())
}
if (screenfull.enabled)
    screenfull.on("change", function() {
        s_bFullscreen = screenfull.isFullscreen;
        null !== s_oInterface && s_oInterface.resetFullscreenBut();
        null !== s_oMenu && s_oMenu.resetFullscreenBut()
    });
function saveItem(a, c) {
    s_bStorageAvailable && localStorage.setItem(a, c)
}
function getItem(a) {
    return s_bStorageAvailable ? localStorage.getItem(a) : null
}
function CSpriteLibrary() {
    var a = {}, c, b, d, e, f, g;
    this.init = function(a, k, q) {
        c = {};
        d = b = 0;
        e = a;
        f = k;
        g = q
    }
    ;
    this.addSprite = function(d, e) {
        if (!a.hasOwnProperty(d)) {
            var f = new Image;
            a[d] = c[d] = {
                szPath: e,
                oSprite: f,
                bLoaded: !1
            };
            b++
        }
    }
    ;
    this.getSprite = function(b) {
        return a.hasOwnProperty(b) ? a[b].oSprite : null
    }
    ;
    this._onSpritesLoaded = function() {
        b = 0;
        f.call(g)
    }
    ;
    this._onSpriteLoaded = function() {
        e.call(g);
        ++d === b && this._onSpritesLoaded()
    }
    ;
    this.loadSprites = function() {
        for (var a in c)
            c[a].oSprite.oSpriteLibrary = this,
            c[a].oSprite.szKey = a,
            c[a].oSprite.onload = function() {
                this.oSpriteLibrary.setLoaded(this.szKey);
                this.oSpriteLibrary._onSpriteLoaded(this.szKey)
            }
            ,
            c[a].oSprite.onerror = function(a) {
                var b = a.currentTarget;
                setTimeout(function() {
                    c[b.szKey].oSprite.src = c[b.szKey].szPath
                }, 500)
            }
            ,
            c[a].oSprite.src = c[a].szPath
    }
    ;
    this.setLoaded = function(b) {
        a[b].bLoaded = !0
    }
    ;
    this.isLoaded = function(b) {
        return a[b].bLoaded
    }
    ;
    this.getNumSprites = function() {
        return b
    }
}
var GAME_NAME = "gummy_block", CANVAS_WIDTH = 1920, CANVAS_HEIGHT = 1920, EDGEBOARD_X = 0, EDGEBOARD_Y = 0, FONT = "bubblegumregular", ENABLE_FULLSCREEN, FPS = 30, DISABLE_SOUND_MOBILE = !1, STATE_LOADING = 0, STATE_MENU = 1, STATE_MODE = 2, STATE_GAME = 3, ON_MOUSE_DOWN = 0, ON_MOUSE_UP = 1, ON_MOUSE_OVER = 2, ON_MOUSE_OUT = 3, ON_BUT_YES_DOWN = 4, ON_BUT_NO_DOWN = 5, ON_SELECT_PIECE = 6, ON_END_CELL_MOVE = 7, DIR_LEFT = 0, DIR_TOP = 1, DIR_RIGHT = 2, DIR_BOTTOM = 3, LABEL_EMPTY = -1, CUR_GRID_SCALE = 1, MAX_TABLE_HEIGHT = 1802, NUM_ROWS = 10, NUM_COLS = 10, CELL_WIDTH = 96, CELL_HEIGHT = 106, CELL_HEIGHT_FAKE = 98, CELL_X = 526, CELL_Y = 476, NUM_PIECES, PIECE_TO_PLACE = 3, NUM_TYPES = 9, Y_PIECE_ATTACH = CANVAS_HEIGHT - 300, SCALE_STARTING_PIECE = .7, NUM_HIT_AIR_STRIKE = 5, TIME_CHANGE_COLOR = 2E3, OFFSET_PIECE_Y = 300, TIME_ALERT_ANIM = 5E3, SOUNDTRACK_VOLUME_IN_GAME = .5;
function CMain(a) {
    var c, b = 0, d = 0, e = STATE_LOADING, f, g;
    this.initContainer = function() {
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        createjs.Touch.enable(s_oStage);
        s_oStage.preventSelection = !1;
        s_bMobile = jQuery.browser.mobile;
        !1 === s_bMobile && s_oStage.enableMouseOver(20);
        s_iPrevTime = (new Date).getTime();
        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;
        navigator.userAgent.match(/Windows Phone/i) && (DISABLE_SOUND_MOBILE = !0);
        s_oSpriteLibrary = new CSpriteLibrary;
        f = new CPreloader
        // seekAndDestroy() ? f = new CPreloader : window.location.href = "http://www.codethislab.com/contact-us.html"
    }
    ;
    this.preloaderReady = function() {
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || this._initSounds();
        this._loadImages();
        c = !0
    }
    ;
    this.soundLoaded = function() {
        b++;
        f.refreshLoader(Math.floor(b / d * 100))
    }
    ;
    this._initSounds = function() {
        Howler.mute(!s_bAudioActive);
        s_aSoundsInfo = [];
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "click",
            loop: !1,
            volume: 1,
            ingamename: "click"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "combo",
            loop: !1,
            volume: 1,
            ingamename: "combo"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "combo_plus",
            loop: !1,
            volume: 1,
            ingamename: "combo_plus"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "game_over",
            loop: !1,
            volume: 1,
            ingamename: "game_over"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "position",
            loop: !1,
            volume: 1,
            ingamename: "position"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "swish",
            loop: !1,
            volume: 1,
            ingamename: "swish"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "soundtrack",
            loop: !0,
            volume: 1,
            ingamename: "soundtrack"
        });
        d += s_aSoundsInfo.length;
        s_aSounds = [];
        for (var a = 0; a < s_aSoundsInfo.length; a++)
            this.tryToLoadSound(s_aSoundsInfo[a], !1)
    }
    ;
    this.tryToLoadSound = function(a, b) {
        setTimeout(function() {
            s_aSounds[a.ingamename] = new Howl({
                src: [a.path + a.filename + ".mp3"],
                autoplay: !1,
                preload: !0,
                loop: a.loop,
                volume: a.volume,
                onload: s_oMain.soundLoaded,
                onloaderror: function(a, b) {
                    for (var c = 0; c < s_aSoundsInfo.length; c++)
                        if (a === s_aSounds[s_aSoundsInfo[c].ingamename]._sounds[0]._id) {
                            s_oMain.tryToLoadSound(s_aSoundsInfo[c], !0);
                            break
                        }
                },
                onplayerror: function(a) {
                    for (var b = 0; b < s_aSoundsInfo.length; b++)
                        if (a === s_aSounds[s_aSoundsInfo[b].ingamename]._sounds[0]._id) {
                            s_aSounds[s_aSoundsInfo[b].ingamename].once("unlock", function() {
                                s_aSounds[s_aSoundsInfo[b].ingamename].play();
                                "soundtrack" === s_aSoundsInfo[b].ingamename && null !== s_oGame && setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME)
                            });
                            break
                        }
                }
            })
        }, b ? 200 : 0)
    }
    ;
    this._loadImages = function() {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_start", "./sprites/but_start.png");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
        // s_oSpriteLibrary.addSprite("ctl_logo", "./sprites/ctl_logo.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_help", "./sprites/but_help.png");
        s_oSpriteLibrary.addSprite("but_settings", "./sprites/but_settings.png");
        s_oSpriteLibrary.addSprite("msg_box_help", "./sprites/msg_box_help.png");
        s_oSpriteLibrary.addSprite("cloud_mask", "./sprites/cloud_mask.png");
        s_oSpriteLibrary.addSprite("clouds_back", "./sprites/clouds_back.png");
        s_oSpriteLibrary.addSprite("cell_bg", "./sprites/cell_bg.png");
        s_oSpriteLibrary.addSprite("cubes_sprite", "./sprites/cubes_sprite.png");
        s_oSpriteLibrary.addSprite("rank_panel", "./sprites/rank_panel.png");
        s_oSpriteLibrary.addSprite("score_panel", "./sprites/score_panel.png");
        s_oSpriteLibrary.addSprite("but_restart_big", "./sprites/but_restart_big.png");
        d += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites()
    }
    ;
    this._onImagesLoaded = function() {
        b++;
        f.refreshLoader(Math.floor(b / d * 100))
    }
    ;
    this._onRemovePreloader = function() {
        f.unload();
        try {
            saveItem("ls_available", "ok"),
            s_iBestScore = getBestScore()
        } catch (h) {
            s_bStorageAvailable = !1
        }
        s_oSoundTrack = playSound("soundtrack", 1, !0);
        this.gotoMenu()
    }
    ;
    this._onAllImagesLoaded = function() {}
    ;
    this.onAllPreloaderImagesLoaded = function() {
        this._loadImages()
    }
    ;
    this.gotoMenu = function() {
        new CMenu;
        e = STATE_MENU
    }
    ;
    this.gotoGame = function() {
        g = new CGame;
        e = STATE_GAME
    }
    ;
    this.stopUpdateNoBlock = function() {
        c = !1;
        createjs.Ticker.paused = !0
    }
    ;
    this.startUpdateNoBlock = function() {
        s_iPrevTime = (new Date).getTime();
        c = !0;
        createjs.Ticker.paused = !1
    }
    ;
    this.stopUpdate = function() {
        c = !1;
        createjs.Ticker.paused = !0;
        $("#block_game").css("display", "block");
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || Howler.mute(!0)
    }
    ;
    this.startUpdate = function() {
        s_iPrevTime = (new Date).getTime();
        c = !0;
        createjs.Ticker.paused = !1;
        $("#block_game").css("display", "none");
        (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) && s_bAudioActive && Howler.mute(!1)
    }
    ;
    this._update = function(a) {
        if (!1 !== c) {
            var b = (new Date).getTime();
            s_iTimeElaps = b - s_iPrevTime;
            s_iCntTime += s_iTimeElaps;
            s_iCntFps++;
            s_iPrevTime = b;
            1E3 <= s_iCntTime && (s_iCurFps = s_iCntFps,
            s_iCntTime -= 1E3,
            s_iCntFps = 0);
            e === STATE_GAME && g.update();
            s_oStage.update(a)
        }
    }
    ;
    s_oMain = this;
    ENABLE_FULLSCREEN = a.fullscreen;
    this.initContainer()
}
var s_bMobile, s_bAudioActive = !1, s_iCntTime = 0, s_iTimeElaps = 0, s_iPrevTime = 0, s_iCntFps = 0, s_iCurFps = 0, s_oStage, s_oMain, s_oSpriteLibrary, s_oSoundTrack = null, s_oCanvas, s_bFullscreen = !1, s_aSounds, s_oPieceSettings, s_iBestScore = 0, s_bStorageAvailable = !0, s_aSoundsInfo, TEXT_PRELOADER_CONTINUE = "START", 
TEXT_ARE_YOU_SURE = "退出?", TEXT_ARE_YOU_SURE_RESTART = "重来?", TEXT_SCORE = "SCORE", TEXT_BEST_SCORE = "BEST", TEXT_GAME_OVER = "GAME OVER", 
TEXT_HELP = "拖下面的方块", 
TEXT_DEVELOPED = "测试", 
TEXT_ERR_LS = "YOUR WEB BROWSER DOES NOT SUPPORT LOCAL STORAGE. IF YOU'RE USING SAFARI, IT MAY BE RELATED TO PRIVATE BROWSING. AS A RESULT, SOME INFO MAY NOT BE SAVED OR SOME FEATURES MAY NOT BE AVAILABLE.", 
TEXT_SHARE_IMAGE = "200x200.jpg", TEXT_SHARE_TITLE = "Congratulations!", TEXT_SHARE_MSG1 = "You collected <strong>", TEXT_SHARE_MSG2 = " points</strong>!<br><br>Share your score with your friends!", TEXT_SHARE_SHARE1 = "My score is ", TEXT_SHARE_SHARE2 = "points! Can you do better";
function CPreloader() {
    var a, c, b, d, e, f, g, h, k, q;
    this._init = function() {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
        s_oSpriteLibrary.addSprite("progress_bar", "./sprites/progress_bar.png");
        s_oSpriteLibrary.addSprite("200x200", "./sprites/200x200.jpg");
        s_oSpriteLibrary.addSprite("but_start", "./sprites/but_start.png");
        s_oSpriteLibrary.loadSprites();
        q = new createjs.Container;
        s_oStage.addChild(q)
    }
    ;
    this.unload = function() {
        q.removeAllChildren();
        k.unload()
    }
    ;
    this._onImagesLoaded = function() {}
    ;
    this._onAllImagesLoaded = function() {
        this.attachSprites();
        s_oMain.preloaderReady()
    }
    ;
    this.attachSprites = function() {
        var m = new createjs.Shape;
        m.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        q.addChild(m);
        m = s_oSpriteLibrary.getSprite("200x200");
        g = createBitmap(m);
        g.regX = .5 * m.width;
        g.regY = .5 * m.height;
        g.x = CANVAS_WIDTH / 2;
        g.y = CANVAS_HEIGHT / 2 - 180;
        q.addChild(g);
        h = new createjs.Shape;
        h.graphics.beginFill("rgba(0,0,0,0.01)").drawRoundRect(g.x - 100, g.y - 100, 200, 200, 10);
        q.addChild(h);
        g.mask = h;
        m = s_oSpriteLibrary.getSprite("progress_bar");
        d = createBitmap(m);
        d.x = CANVAS_WIDTH / 2 - m.width / 2;
        d.y = CANVAS_HEIGHT / 2 + 50;
        q.addChild(d);
        a = m.width;
        c = m.height;
        e = new createjs.Shape;
        e.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(d.x, d.y, 1, c);
        q.addChild(e);
        d.mask = e;
        b = new createjs.Text("","40px " + FONT,"#fff");
        b.x = CANVAS_WIDTH / 2;
        b.y = CANVAS_HEIGHT / 2 + 110;
        b.textBaseline = "alphabetic";
        b.textAlign = "center";
        q.addChild(b);
        m = s_oSpriteLibrary.getSprite("but_start");
        k = new CTextButton(CANVAS_WIDTH / 2,CANVAS_HEIGHT / 2,m,TEXT_PRELOADER_CONTINUE,"Arial","#000","bold 50",q);
        k.addEventListener(ON_MOUSE_UP, this._onButStartRelease, this);
        k.setVisible(!1);
        f = new createjs.Shape;
        f.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        q.addChild(f);
        createjs.Tween.get(f).to({
            alpha: 0
        }, 500).call(function() {
            createjs.Tween.removeTweens(f);
            q.removeChild(f)
        })
    }
    ;
    this._onButStartRelease = function() {
        s_oMain._onRemovePreloader()
    }
    ;
    this.refreshLoader = function(f) {
        b.text = f + "%";
        100 === f && (s_oMain._onRemovePreloader(),
        b.visible = !1,
        d.visible = !1);
        e.graphics.clear();
        f = Math.floor(f * a / 100);
        e.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(d.x, d.y, f, c)
    }
    ;
    this._init()
}
function CTextButton(a, c, b, d, e, f, g, h) {
    var k, q, m, n, p, t, r, A, v, z, D, E;
    this._init = function(a, b, c, d, e, f, g, h) {
        k = !1;
        n = [];
        p = [];
        E = createBitmap(c);
        q = c.width;
        m = c.height;
        var r = Math.ceil(g / 20);
        z = new createjs.Text(d,g + "px " + e,"#000000");
        var y = z.getBounds();
        z.textAlign = "center";
        z.lineWidth = .9 * q;
        z.textBaseline = "alphabetic";
        z.x = c.width / 2 + r;
        z.y = Math.floor(c.height / 2) + y.height / 3 + r;
        D = new createjs.Text(d,g + "px " + e,f);
        D.textAlign = "center";
        D.textBaseline = "alphabetic";
        D.lineWidth = .9 * q;
        D.x = c.width / 2;
        D.y = Math.floor(c.height / 2) + y.height / 3;
        v = new createjs.Container;
        v.x = a;
        v.y = b;
        v.regX = c.width / 2;
        v.regY = c.height / 2;
        s_bMobile || (v.cursor = "pointer");
        v.addChild(E, z, D);
        !1 !== h && s_oStage.addChild(v);
        this._initListener()
    }
    ;
    this.unload = function() {
        v.off("mousedown", t);
        v.off("pressup", r);
        s_oStage.removeChild(v)
    }
    ;
    this.setVisible = function(a) {
        v.visible = a
    }
    ;
    this.setAlign = function(a) {
        D.textAlign = a;
        z.textAlign = a
    }
    ;
    this.enable = function() {
        k = !1;
        E.filters = [];
        E.cache(0, 0, q, m)
    }
    ;
    this.disable = function() {
        k = !0;
        var a = (new createjs.ColorMatrix).adjustSaturation(-100).adjustBrightness(40);
        E.filters = [new createjs.ColorMatrixFilter(a)];
        E.cache(0, 0, q, m)
    }
    ;
    this._initListener = function() {
        t = v.on("mousedown", this.buttonDown);
        r = v.on("pressup", this.buttonRelease)
    }
    ;
    this.addEventListener = function(a, b, c) {
        n[a] = b;
        p[a] = c
    }
    ;
    this.addEventListenerWithParams = function(a, b, c, d) {
        n[a] = b;
        p[a] = c;
        A = d
    }
    ;
    this.buttonRelease = function() {
        k || (playSound("click", 1, !1),
        v.scaleX = 1,
        v.scaleY = 1,
        n[ON_MOUSE_UP] && n[ON_MOUSE_UP].call(p[ON_MOUSE_UP], A))
    }
    ;
    this.buttonDown = function() {
        k || (v.scaleX = .9,
        v.scaleY = .9,
        n[ON_MOUSE_DOWN] && n[ON_MOUSE_DOWN].call(p[ON_MOUSE_DOWN]))
    }
    ;
    this.setPosition = function(a, b) {
        v.x = a;
        v.y = b
    }
    ;
    this.changeText = function(a) {
        D.text = a;
        z.text = a
    }
    ;
    this.setX = function(a) {
        v.x = a
    }
    ;
    this.setY = function(a) {
        v.y = a
    }
    ;
    this.getButtonImage = function() {
        return v
    }
    ;
    this.getX = function() {
        return v.x
    }
    ;
    this.getY = function() {
        return v.y
    }
    ;
    this.getSprite = function() {
        return v
    }
    ;
    this._init(a, c, b, d, e, f, g, h);
    return this
}
function CToggle(a, c, b, d, e) {
    var f, g, h, k = [], q, m, n;
    this._init = function(a, b, c, d) {
        g = [];
        h = [];
        var m = new createjs.SpriteSheet({
            images: [c],
            frames: {
                width: c.width / 2,
                height: c.height,
                regX: c.width / 2 / 2,
                regY: c.height / 2
            },
            animations: {
                state_true: 0,
                state_false: 1
            }
        });
        f = d;
        n = createSprite(m, "state_" + f, c.width / 2 / 2, c.height / 2, c.width / 2, c.height);
        n.mouseEnabled = !0;
        n.x = a;
        n.y = b;
        n.cursor = "pointer";
        e.addChild(n);
        this._initListener()
    }
    ;
    this.unload = function() {
        n.off("mousedown", q);
        n.off("pressup", m);
        n.mouseEnabled = !1;
        e.removeChild(n)
    }
    ;
    this._initListener = function() {
        q = n.on("mousedown", this.buttonDown);
        m = n.on("pressup", this.buttonRelease)
    }
    ;
    this.addEventListener = function(a, b, c) {
        g[a] = b;
        h[a] = c
    }
    ;
    this.addEventListenerWithParams = function(a, b, c, d) {
        g[a] = b;
        h[a] = c;
        k = d
    }
    ;
    this.setActive = function(a) {
        f = a;
        n.gotoAndStop("state_" + f)
    }
    ;
    this.buttonRelease = function() {
        n.scaleX = 1;
        n.scaleY = 1;
        playSound("click", 1, !1);
        f = !f;
        n.gotoAndStop("state_" + f);
        g[ON_MOUSE_UP] && g[ON_MOUSE_UP].call(h[ON_MOUSE_UP], k)
    }
    ;
    this.buttonDown = function() {
        n.scaleX = .9;
        n.scaleY = .9;
        g[ON_MOUSE_DOWN] && g[ON_MOUSE_DOWN].call(h[ON_MOUSE_DOWN], k)
    }
    ;
    this.setPosition = function(a, b) {
        n.x = a;
        n.y = b
    }
    ;
    this.setVisible = function(a) {
        n.visible = a
    }
    ;
    this.setMask = function(a) {
        n.mask = a
    }
    ;
    this.getButtonImage = function() {
        return n
    }
    ;
    this._init(a, c, b, d)
}
function CGfxButton(a, c, b, d) {
    var e, f, g, h, k, q, m = [], n, p = this;
    this._init = function(a, b, c) {
        e = !0;
        f = 1;
        k = [];
        q = [];
        n = createBitmap(c);
        n.x = a;
        n.y = b;
        n.regX = c.width / 2;
        n.regY = c.height / 2;
        n.cursor = "pointer";
        t.addChild(n);
        this._initListener()
    }
    ;
    this.unload = function() {
        n.off("mousedown", g);
        n.off("pressup", h);
        t.removeChild(n)
    }
    ;
    this.setVisible = function(a) {
        n.visible = a
    }
    ;
    this.setScale = function(a) {
        f = a;
        n.scaleX = n.scaleY = f
    }
    ;
    this.activate = function() {
        e = !0
    }
    ;
    this.deactivate = function() {
        e = !1
    }
    ;
    this._initListener = function() {
        g = n.on("mousedown", this.buttonDown);
        h = n.on("pressup", this.buttonRelease)
    }
    ;
    this.addEventListener = function(a, b, c) {
        k[a] = b;
        q[a] = c
    }
    ;
    this.addEventListenerWithParams = function(a, b, c, d) {
        k[a] = b;
        q[a] = c;
        m = d
    }
    ;
    this.buttonRelease = function() {
        !1 !== e && (n.scaleX = f,
        n.scaleY = f,
        k[ON_MOUSE_UP] && k[ON_MOUSE_UP].call(q[ON_MOUSE_UP], m))
    }
    ;
    this.buttonDown = function() {
        !1 !== e && (n.scaleX = .9 * f,
        n.scaleY = .9 * f,
        playSound("click", 1, !1),
        k[ON_MOUSE_DOWN] && k[ON_MOUSE_DOWN].call(q[ON_MOUSE_DOWN], m))
    }
    ;
    this.setScale = function(a) {
        f = a;
        n.scaleX = a;
        n.scaleY = a
    }
    ;
    this.setPosition = function(a, b) {
        n.x = a;
        n.y = b
    }
    ;
    this.pulseAnimation = function() {
        createjs.Tween.get(n).to({
            scaleX: 1.1 * f,
            scaleY: 1.1 * f
        }, 850, createjs.Ease.quadOut).to({
            scaleX: f,
            scaleY: f
        }, 650, createjs.Ease.quadIn).call(function() {
            p.pulseAnimation()
        })
    }
    ;
    this.setX = function(a) {
        n.x = a
    }
    ;
    this.setY = function(a) {
        n.y = a
    }
    ;
    this.setMask = function(a) {
        n.mask = a
    }
    ;
    this.getButtonImage = function() {
        return n
    }
    ;
    this.getX = function() {
        return n.x
    }
    ;
    this.getY = function() {
        return n.y
    }
    ;
    var t = d;
    this._init(a, c, b);
    return this
}
function CMenu() {
    var a, c, b, d, e, f, g, h, k = null, q = null, m, n, p;
    this._init = function() {
        m = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
        s_oStage.addChild(m);
        g = new CGfxButton(CANVAS_WIDTH / 2,CANVAS_HEIGHT / 2 + 300,s_oSpriteLibrary.getSprite("but_play"),s_oStage);
        g.pulseAnimation();
        g.addEventListener(ON_MOUSE_UP, this._onStart, this, 0);
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) {
            var t = s_oSpriteLibrary.getSprite("audio_icon");
            e = CANVAS_WIDTH - t.height / 2 - 10;
            f = t.height / 2 + 10;
            n = new CToggle(e,f,t,s_bAudioActive,s_oStage);
            n.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this)
        }
        t = s_oSpriteLibrary.getSprite("but_credits");
        b = t.width / 2 + 10;
        d = t.height / 2 + 10;
        h = new CGfxButton(b,d,t,s_oStage);
        h.addEventListener(ON_MOUSE_UP, this._onCreditsBut, this);
        t = window.document;
        var r = t.documentElement;
        k = r.requestFullscreen || r.mozRequestFullScreen || r.webkitRequestFullScreen || r.msRequestFullscreen;
        q = t.exitFullscreen || t.mozCancelFullScreen || t.webkitExitFullscreen || t.msExitFullscreen;
        !1 === ENABLE_FULLSCREEN && (k = !1);
        k && screenfull.enabled && (t = s_oSpriteLibrary.getSprite("but_fullscreen"),
        a = b + t.width / 2 + 10,
        c = t.height / 2 + 10,
        p = new CToggle(a,c,t,s_bFullscreen,s_oStage),
        p.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this));
        var A = new createjs.Shape;
        A.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(A);
        createjs.Tween.get(A).to({
            alpha: 0
        }, 1E3).call(function() {
            A.visible = !1
        });
        setVolume("soundtrack", 1);
        this.refreshButtonPos()
    }
    ;
    this.unload = function() {
        g.unload();
        h.unload();
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
            n.unload(),
            n = null;
        k && screenfull.enabled && p.unload();
        s_oMenu = null;
        s_oStage.removeAllChildren()
    }
    ;
    this.refreshButtonPos = function() {
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || n.setPosition(e - s_iOffsetX, s_iOffsetY + f);
        k && screenfull.enabled && p.setPosition(a + s_iOffsetX, c + s_iOffsetY);
        h.setPosition(b + s_iOffsetX, s_iOffsetY + d)
    }
    ;
    this._onStart = function() {
        $(s_oMain).trigger("start_session");
        s_oMenu.unload();
        s_oMain.gotoGame()
    }
    ;
    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    }
    ;
    this._onCreditsBut = function() {
        new CCreditsPanel
    }
    ;
    this.resetFullscreenBut = function() {
        k && screenfull.enabled && p.setActive(s_bFullscreen)
    }
    ;
    this._onFullscreenRelease = function() {
        s_bFullscreen ? q.call(window.document) : k.call(window.document.documentElement);
        sizeHandler()
    }
    ;
    s_oMenu = this;
    this._init()
}
var s_oMenu = null;
function CGame() {
    var a, c, b, d, e, f;
    this._init = function() {
        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
        s_oPieceSettings = new CPieceSettings;
        var g = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
        s_oStage.addChild(g);
        b = new CBoard(CANVAS_WIDTH / 2,CANVAS_HEIGHT / 2,s_oStage);
        d = new CInterface;
        c = getScoreSaved();
        d.refreshScore(c);
        f = new CGameOver;
        e = new CHelp;
        e.show();
        this.refreshButtonPos();
        a = !0
    }
    ;
    this.unload = function() {
        d.unload();
        e.unload();
        s_oGame = null;
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren()
    }
    ;
    this.refreshButtonPos = function() {
        this.refreshGridScale();
        d.refreshButtonPos()
    }
    ;
    this.refreshGridScale = function() {
        CUR_GRID_SCALE = (CANVAS_HEIGHT - 2 * s_iOffsetY) / MAX_TABLE_HEIGHT;
        1 >= CUR_GRID_SCALE && (CUR_GRID_SCALE = parseFloat(CUR_GRID_SCALE.toFixed(2)));
        b.refreshGridScale();
        d.refreshGridScale()
    }
    ;
    this.restart = function() {
        c = 0;
        d.refreshScore(c);
        b.reset();
        a = !0
    }
    ;
    this.refreshScore = function(a) {
        c += a;
        d.refreshScore(c)
    }
    ;
    this.saveGameState = function(a, b) {
        saveScore(c);
        saveBoardState(a);
        saveBoardPieces(b)
    }
    ;
    this.gameOver = function() {
        s_iBestScore < c && (s_iBestScore = c,
        d.refreshBestScore(),
        saveBestScore(c));
        f.show(c)
    }
    ;
    this.onExit = function() {
        this.unload();
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
        s_oMain.gotoMenu()
    }
    ;
    this.update = function() {
        a && b.update()
    }
    ;
    s_oGame = this;
    this._init()
}
var s_oGame = null, s_oHandEvaluator;
function CInterface() {
    var a, c, b, d, e, f, g, h, k, q, m = null, n = null, p, t, r, A, v, z, D, E, O, y;
    this._init = function() {
        a = CANVAS_WIDTH / 2;
        c = 120;
        y = new createjs.Container;
        y.x = a;
        y.y = c;
        s_oStage.addChild(y);
        var x = createBitmap(s_oSpriteLibrary.getSprite("score_panel"));
        y.addChild(x);
        z = new CTLText(y,x.x + 100,x.y,250,110,80,"right","#fff",FONT,1,0,0,"0",!0,!0,!1,!1);
        x = createBitmap(s_oSpriteLibrary.getSprite("rank_panel"));
        x.x = 500;
        y.addChild(x);
        D = new CTLText(y,x.x + 100,x.y,250,110,80,"right","#fff",FONT,1,0,0,"" + s_iBestScore,!0,!0,!1,!1);
        y.regX = y.getBounds().width / 2;
        x = s_oSpriteLibrary.getSprite("but_exit");
        k = CANVAS_WIDTH - x.width / 2 - 10;
        q = x.height / 2 + 10;
        r = new CGfxButton(k,q,x,s_oStage);
        r.addEventListener(ON_MOUSE_UP, this._onExit, this);
        !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (g = k - x.width,
        h = q,
        x = s_oSpriteLibrary.getSprite("audio_icon"),
        p = new CToggle(g,h,x,s_bAudioActive,s_oStage),
        p.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this),
        e = g - x.width / 2,
        f = h) : (e = k - x.width,
        f = q);
        var I = window.document
          , J = I.documentElement;
        m = J.requestFullscreen || J.mozRequestFullScreen || J.webkitRequestFullScreen || J.msRequestFullscreen;
        n = I.exitFullscreen || I.mozCancelFullScreen || I.webkitExitFullscreen || I.msExitFullscreen;
        !1 === ENABLE_FULLSCREEN && (m = !1);
        m && screenfull.enabled && (x = s_oSpriteLibrary.getSprite("but_fullscreen"),
        t = new CToggle(e,f,x,s_bFullscreen,s_oStage),
        t.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this));
        b = CANVAS_WIDTH - x.width / 2 - 10;
        d = q;
        A = new CGfxButton(b,d,s_oSpriteLibrary.getSprite("but_restart"),s_oStage);
        A.addEventListener(ON_MOUSE_UP, this._onRestart, this);
        x = s_oSpriteLibrary.getSprite("but_settings");
        v = new CGUIExpandible(k,q,x,s_oStage);
        v.addButton(r);
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || v.addButton(p);
        m && screenfull.enabled && v.addButton(t);
        v.addButton(A);
        O = new CRollingScore;
        E = new CAreYouSurePanel(s_oStage)
    }
    ;
    this.unload = function() {
        v.unload();
        E.unload();
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile)
            p.unload(),
            p = null;
        m && screenfull.enabled && t.unload();
        r.unload();
        A.unload();
        s_oInterface = null
    }
    ;
    this.refreshButtonPos = function() {
        v.refreshPos();
        y.y = c + s_iOffsetY
    }
    ;
    this.refreshGridScale = function() {
        y.scaleX = y.scaleY = CUR_GRID_SCALE
    }
    ;
    this.refreshScore = function(a) {
        O.rolling(z.getText(), null, a)
    }
    ;
    this.refreshBestScore = function() {
        D.refreshText(s_iBestScore)
    }
    ;
    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    }
    ;
    this._onExit = function() {
        E.show(TEXT_ARE_YOU_SURE);
        E.addEventListener(ON_BUT_YES_DOWN, s_oGame.onExit, s_oGame)
    }
    ;
    this.resetFullscreenBut = function() {
        m && screenfull.enabled && t.setActive(s_bFullscreen)
    }
    ;
    this._onFullscreenRelease = function() {
        s_bFullscreen ? n.call(window.document) : m.call(window.document.documentElement);
        sizeHandler()
    }
    ;
    this._onRestart = function() {
        E.show(TEXT_ARE_YOU_SURE_RESTART);
        E.addEventListener(ON_BUT_YES_DOWN, s_oGame.restart, s_oGame)
    }
    ;
    this._onConfirm = function() {}
    ;
    s_oInterface = this;
    this._init();
    return this
}
var s_oInterface = null;
function CCreditsPanel() {
    var a, c, b, d, e, f, g, h;
    this._init = function() {
        h = new createjs.Container;
        s_oStage.addChild(h);
        b = new createjs.Shape;
        c = b.on("click", function() {});
        b.alpha = 0;
        b.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        h.addChild(b);
        d = new createjs.Container;
        d.visible = !1;
        h.addChild(d);
        var k = s_oSpriteLibrary.getSprite("msg_box");
        g = createBitmap(k);
        g.regX = k.width / 2;
        g.regY = k.height / 2;
        d.addChild(g);
        a = g.on("click", this._onLogoButRelease);
        d.x = CANVAS_WIDTH / 2;
        d.y = CANVAS_HEIGHT / 2;
        k = new createjs.Text(TEXT_DEVELOPED," 40px " + FONT,"#fff");
        k.y = -50;
        k.textAlign = "center";
        k.textBaseline = "alphabetic";
        d.addChild(k);
        // k = new createjs.Text("www.codethislab.com"," 36px " + FONT,"#fff");
        k.y = 80;
        k.textAlign = "center";
        k.textBaseline = "alphabetic";
        k.lineWidth = 300;
        d.addChild(k);
        // k = s_oSpriteLibrary.getSprite("ctl_logo");
        f = createBitmap(k);
        f.regX = k.width / 2;
        f.regY = k.height / 2;
        d.addChild(f);
        k = s_oSpriteLibrary.getSprite("but_exit");
        e = new CGfxButton(260,-220,k,d);
        e.addEventListener(ON_MOUSE_UP, this.unload, this);
        b.alpha = 0;
        createjs.Tween.get(b).to({
            alpha: .7
        }, 500).call(function() {
            d.alpha = 0;
            d.visible = !0;
            createjs.Tween.get(d).to({
                alpha: 1
            }, 300)
        })
    }
    ;
    this.unload = function() {
        createjs.Tween.get(h).to({
            alpha: 0
        }, 500).call(function() {
            s_oStage.removeChild(h);
            e.unload()
        });
        b.off("click", c);
        g.off("click", a)
    }
    ;
    this._onLogoButRelease = function() {
        window.open("http://www.codethislab.com/index.php?&l=en")
    }
    ;
    this._init()
}
function CAreYouSurePanel(a) {
    var c, b, d, e, f, g, h, k, q, m, n = this;
    this._init = function() {
        c = [];
        b = [];
        k = new createjs.Container;
        k.visible = !1;
        p.addChild(k);
        q = new createjs.Shape;
        q.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        q.alpha = .5;
        d = q.on("click", function() {});
        k.addChild(q);
        m = new createjs.Container;
        m.x = CANVAS_WIDTH / 2;
        m.y = CANVAS_HEIGHT / 2;
        k.addChild(m);
        var a = s_oSpriteLibrary.getSprite("msg_box");
        e = createBitmap(a);
        m.addChild(e);
        f = new CTLText(m,a.width / 2 - 260,190,520,200,80,"center","#fff",FONT,1,0,0," ",!0,!0,!0,!1);
        g = new CGfxButton(200,550,s_oSpriteLibrary.getSprite("but_yes"),m);
        g.addEventListener(ON_MOUSE_UP, this._onButYes, this);
        h = new CGfxButton(a.width - 200,550,s_oSpriteLibrary.getSprite("but_no"),m);
        h.addEventListener(ON_MOUSE_UP, this._onButNo, this);
        m.regX = a.width / 2;
        m.regY = a.height / 2
    }
    ;
    this.addEventListener = function(a, d, e) {
        c[a] = d;
        b[a] = e
    }
    ;
    this.show = function(a) {
        f.refreshText(a);
        m.scaleX = m.scaleY = .1;
        k.visible = !0;
        createjs.Tween.get(m).to({
            scaleX: 1,
            scaleY: 1
        }, 1E3, createjs.Ease.elasticOut)
    }
    ;
    this.hide = function() {
        k.visible = !1
    }
    ;
    this.unload = function() {
        h.unload();
        g.unload();
        q.off("click", d)
    }
    ;
    this._onButYes = function() {
        n.hide();
        c[ON_BUT_YES_DOWN] && c[ON_BUT_YES_DOWN].call(b[ON_BUT_YES_DOWN])
    }
    ;
    this._onButNo = function() {
        n.hide()
    }
    ;
    var p = a;
    this._init()
}
function CGUIExpandible(a, c, b, d) {
    var e, f, g, h, k, q, m, n, p;
    this._init = function(a, b, c, d) {
        h = [];
        m = new createjs.Container;
        m.x = a;
        m.y = b;
        d.addChild(m);
        n = new createjs.Container;
        m.addChild(n);
        p = new createjs.Container;
        m.addChild(p);
        g = !1;
        q = new CGfxButton(0,0,c,p);
        q.addEventListener(ON_MOUSE_UP, this._onMenu, this);
        k = new createjs.Shape;
        k.graphics.beginFill("rgba(255,0,0,0.01)").drawRoundRectComplex(-c.width / 2, -c.height / 2, c.width, 6 * c.height, 30, 30, 0, 0);
        n.addChild(k);
        f = e = 130
    }
    ;
    this.unload = function() {
        q.unload();
        d.removeChild(m)
    }
    ;
    this.refreshPos = function() {
        m.x = a - s_iOffsetX;
        m.y = c + s_iOffsetY
    }
    ;
    this.addButton = function(a) {
        var b = a.getButtonImage();
        a.setMask(k);
        b.x = 0;
        b.y = 0;
        b.visible = 0;
        n.addChildAt(b, 0);
        h.push(b)
    }
    ;
    this._onMenu = function() {
        (g = !g) ? t._expand() : t._collapse()
    }
    ;
    this._expand = function() {
        for (var a = 0; a < h.length; a++)
            h[a].visible = !0,
            createjs.Tween.get(h[a], {
                override: !0
            }).wait(300 * a / 2).to({
                y: e + a * f
            }, 300, createjs.Ease.cubicOut)
    }
    ;
    this._collapse = function() {
        for (var a = 0; a < h.length; a++) {
            var b = h[h.length - 1 - a];
            createjs.Tween.get(b, {
                override: !0
            }).wait(300 * a / 2).to({
                y: 0
            }, 300, createjs.Ease.cubicOut).call(function(a) {
                a.visible = !1
            }, [b])
        }
    }
    ;
    var t = this;
    this._init(a, c, b, d)
}
function CBoard(a, c, b) {
    var d, e, f, g, h, k, q, m, n, p, t, r, A, v, z, D = this;
    this._init = function(a, c) {
        d = 0;
        z = new createjs.Container;
        z.x = a;
        z.y = c;
        b.addChild(z);
        var f = s_oSpriteLibrary.getSprite("cloud_mask");
        t = createBitmap(s_oSpriteLibrary.getSprite("clouds_back"));
        t.x = 0;
        t.y = 450;
        z.addChild(t);
        e = f.width - 340;
        n = new createjs.Shape;
        n.graphics.beginFill("red").drawRect(170, 0, e, f.height);
        n.alpha = .01;
        z.addChild(n);
        t.mask = n;
        this._initBoard();
        f = createBitmap(f);
        z.addChild(f);
        z.regX = z.getBounds().width / 2;
        z.regY = z.getBounds().height / 2;
        v = new createjs.Container;
        z.addChild(v);
        r = new createjs.Shape;
        r.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0, 0, z.getBounds().width, z.getBounds().height);
        r.on("click", function() {});
        z.addChild(r);
        k = [z.regX - 400, z.regX, z.regX + 400];
        this.startGame(!1)
    }
    ;
    this.refreshGridScale = function() {
        z.scaleX = z.scaleY = CUR_GRID_SCALE
    }
    ;
    this.reset = function() {
        for (var a = d = 0; a < NUM_ROWS; a++)
            for (var b = 0; b < NUM_COLS; b++)
                f[a][b].setValue(LABEL_EMPTY),
                g[a][b] = LABEL_EMPTY;
        for (a = 0; a < h.length; a++)
            null !== h[a] && h[a].unload();
        this.startGame(!0)
    }
    ;
    this._initBoard = function() {
        A = new createjs.Container;
        A.x = CELL_X;
        A.y = CELL_Y;
        z.addChild(A);
        f = [];
        g = [];
        for (var a = 0, b = 0, c = 0; c < NUM_ROWS; c++) {
            f[c] = [];
            g[c] = [];
            for (var d = 0; d < NUM_COLS; d++)
                f[c][d] = new CBoardCell(a,b,c,d,A),
                g[c][d] = LABEL_EMPTY,
                a += CELL_WIDTH;
            a = 0;
            b += CELL_HEIGHT_FAKE
        }
    }
    ;
    this.restoreBoardState = function(a) {
        var b = getBoardState();
        if (null !== b)
            for (var c = 0; c < NUM_ROWS; c++)
                for (var e = 0; e < NUM_COLS; e++)
                    g[c][e] = b[c][e],
                    f[c][e].setValue(b[c][e], !1);
        else
            return !1;
        b = getSavedPieces();
        if (!a && null !== b)
            for (c = d = 0; c < b.length; c++)
                this.spawnPieces(c, Math.floor(500 * Math.random()), b[c]),
                null === b[c] && d++;
        return !0
    }
    ;
    this._prepareBoardState = function() {
        for (var a = [], b = 0; b < h.length; b++)
            a[b] = null !== h[b] ? h[b].getInfos() : null;
        s_oGame.saveGameState(g, a)
    }
    ;
    this.setBlock = function(a) {
        r.visible = a
    }
    ;
    this.startGame = function(a) {
        r.visible = !1;
        h = [null, null, null];
        if (a || !1 === this.restoreBoardState(a))
            for (a = 0; 3 > a; a++)
                this.spawnPieces(a, Math.floor(500 * Math.random()), s_oPieceSettings.getRandPieceInfos())
    }
    ;
    this.spawnPieces = function(a, b, c) {
        null !== c && (b = new CPiece(a,k[a],Y_PIECE_ATTACH,c,b,v),
        b.addEventListener(ON_SELECT_PIECE, this._onSelectPiece, this),
        h[a] = b,
        playSound("swish", 1, !1))
    }
    ;
    this._onSelectPiece = function(a) {
        p = a;
        m = s_oStage.on("pressmove", D._onMove, D);
        q = s_oStage.on("stagemouseup", D._onRelease, D)
    }
    ;
    this._onMove = function(a) {
        p.refreshGlobalPos(a.stageX, a.stageY)
    }
    ;
    this._onRelease = function(a) {
        s_oStage.off("pressmove", m);
        s_oStage.off("stagemouseup", q);
        this._checkPieceCollision(p.getIndex(), p.getInfos())
    }
    ;
    this._checkAllCurrentPiecesCanBePlaced = function() {
        for (var a = 0, b = 0; b < h.length; b++)
            null !== h[b] && !1 !== this._checkIfPieceCanBePlaced(h[b]) || a++;
        if (a === h.length) {
            for (a = 0; a < h.length; a++)
                null !== h[a] && h[a].disableListeners();
            clearBoardState();
            saveScore(0);
            s_oGame.gameOver()
        }
    }
    ;
    this._checkIfPieceCanBePlaced = function(a) {
        for (var b = 0; b < NUM_ROWS; b++)
            for (var c = 0; c < NUM_COLS; c++)
                if (this._checkIfPieceFit(b, c, a.getInfos().list_pos))
                    return !0;
        return !1
    }
    ;
    this._checkPieceCollision = function(a, b) {
        var c = h[a]
          , e = b.list_pos
          , f = c.getGlobalPos();
        f = A.globalToLocal(f.x, f.y);
        var g = Math.floor(f.y / CELL_HEIGHT_FAKE);
        f = Math.floor(f.x / CELL_WIDTH);
        if (this._checkIfPieceFit(g, f, e)) {
            playSound("position", 1, !1);
            this.setCellValues(g, f, e, b.type);
            s_oGame.refreshScore(b.num_cell);
            c.unload();
            h[a] = null;
            this._checkLines();
            d++;
            if (d === PIECE_TO_PLACE) {
                for (c = 0; c < PIECE_TO_PLACE; c++)
                    this.spawnPieces(c, Math.floor(500 * Math.random()), s_oPieceSettings.getRandPieceInfos());
                d = 0
            }
            this._prepareBoardState();
            this._checkAllCurrentPiecesCanBePlaced()
        } else
            c.resetPos(),
            this.setBlock(!1)
    }
    ;
    this._checkIfPieceFit = function(a, b, c) {
        if (0 > a || a >= NUM_ROWS && 0 > b && b >= NUM_COLS)
            return !1;
        for (var d = 0; d < c.length; d++) {
            var e = c[d];
            if (0 > a + e.row || a + e.row >= NUM_ROWS || 0 > b + e.col || b + e.col >= NUM_COLS || f[a + e.row][b + e.col].getType() !== LABEL_EMPTY)
                return !1
        }
        return !0
    }
    ;
    this.setCellValues = function(a, b, c, d) {
        for (var e = 0; e < c.length; e++) {
            var h = c[e];
            f[a + h.row][b + h.col].setValue(d, !0);
            g[a + h.row][b + h.col] = d
        }
    }
    ;
    this._checkLines = function() {
        for (var a = [], b = 0; b < NUM_ROWS; b++) {
            for (var c = 0, d = 0; d < NUM_COLS && !f[b][d].isEmpty(); d++)
                c++;
            c === NUM_COLS && a.push(b)
        }
        var e = [];
        for (b = 0; b < NUM_COLS; b++) {
            for (d = c = 0; d < NUM_ROWS && !f[d][b].isEmpty(); d++)
                c++;
            c === NUM_ROWS && e.push(b)
        }
        b = a.length + e.length;
        return 0 < b ? (this._destroyRows(a),
        this._destroyCols(e),
        this.setBlock(!1),
        1 < b ? playSound("combo_plus", 1, !1) : playSound("combo", 1, !1),
        s_oGame.refreshScore(5 * (a.length + e.length) * (a.length + e.length + 1)),
        !0) : !1
    }
    ;
    this._destroyRows = function(a) {
        for (var b = 0; b < a.length; b++)
            for (var c = 0, d = 0; d < NUM_COLS; d++)
                f[a[b]][d].clearAnim(c),
                g[a[b]][d] = LABEL_EMPTY,
                c += 50
    }
    ;
    this._destroyCols = function(a) {
        for (var b = 0; b < a.length; b++)
            for (var c = 0, d = 0; d < NUM_ROWS; d++)
                f[d][a[b]].clearAnim(c),
                g[d][a[b]] = LABEL_EMPTY,
                c += 50
    }
    ;
    this._findAllFilledCells = function() {
        for (var a = [], b = 0; b < NUM_ROWS; b++)
            for (var c = 0; c < NUM_COLS; c++)
                !1 === f[b][c].isEmpty() && a.push({
                    row: b,
                    col: c
                });
        return a
    }
    ;
    this.printBoardCell = function() {
        for (var a = 0; a < NUM_ROWS; a++) {
            for (var b = "", c = 0; c < NUM_COLS; c++)
                b += f[a][c].getType() + "#";
            trace(b)
        }
        trace("####################")
    }
    ;
    this.update = function() {
        t.x += 1;
        t.x > e && (t.x = -700)
    }
    ;
    this._init(a, c)
}
function CBoardCell(a, c, b, d, e) {
    var f, g, h, k, q = this;
    this._init = function(a, b) {
        f = !0;
        g = LABEL_EMPTY;
        k = new createjs.Container;
        k.x = a;
        k.y = b;
        e.addChild(k);
        var c = createBitmap(s_oSpriteLibrary.getSprite("cell_bg"));
        c.regX = CELL_WIDTH / 2;
        c.regY = CELL_HEIGHT / 2;
        k.addChild(c);
        c = {
            images: [s_oSpriteLibrary.getSprite("cubes_sprite")],
            frames: {
                width: CELL_WIDTH,
                height: CELL_HEIGHT,
                regX: CELL_WIDTH / 2,
                regY: CELL_HEIGHT / 2
            },
            animations: {
                idle: 0,
                type_1: 1,
                type_2: 2,
                type_3: 3,
                type_4: 4,
                type_5: 5,
                type_6: 6,
                type_7: 7,
                type_8: 8,
                type_9: 9
            }
        };
        c = new createjs.SpriteSheet(c);
        h = createSprite(c, "idle", CELL_WIDTH / 2, CELL_HEIGHT / 2, CELL_WIDTH, CELL_HEIGHT);
        h.y = -8;
        h.visible = !1;
        k.addChild(h)
    }
    ;
    this.addEventListener = function(a, b, c) {}
    ;
    this.setValue = function(a, b) {
        g = a;
        h.scaleX = h.scaleY = 1.1;
        a === LABEL_EMPTY ? (f = !0,
        h.visible = !1) : (h.visible = !0,
        h.gotoAndStop("type_" + a),
        f = !1,
        b ? createjs.Tween.get(h).to({
            scaleX: 1,
            scaleY: 1
        }, 1500, createjs.Ease.elasticOut) : h.scaleX = h.scaleY = 1)
    }
    ;
    this.clearAnim = function(a) {
        var b = this;
        createjs.Tween.get(h).wait(a).to({
            scaleX: .1,
            scaleY: .1
        }, 300, createjs.Ease.backIn).call(function() {
            b.setValue(LABEL_EMPTY)
        });
        g = LABEL_EMPTY
    }
    ;
    this._onClick = function() {
        k.off("click", void 0);
        q.clearAnim(0)
    }
    ;
    this.isEmpty = function() {
        return f
    }
    ;
    this.getX = function() {
        return k.x
    }
    ;
    this.getY = function() {
        return k.y
    }
    ;
    this.getType = function() {
        return g
    }
    ;
    this._init(a, c)
}
function CPieceSettings() {
    var a;
    this._init = function() {
        a = [{
            list_pos: [{
                row: 0,
                col: 0
            }],
            type: 5,
            num_cell: 1
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 0,
                col: 1
            }],
            type: 1,
            num_cell: 2
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 1,
                col: 0
            }],
            type: 1,
            num_cell: 2
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 0,
                col: 1
            }, {
                row: 0,
                col: 2
            }],
            type: 2,
            num_cell: 3
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 1,
                col: 0
            }, {
                row: 2,
                col: 0
            }],
            type: 2,
            num_cell: 3
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 0,
                col: 1
            }, {
                row: 1,
                col: 0
            }],
            type: 8,
            num_cell: 3
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 1,
                col: 0
            }, {
                row: 1,
                col: 1
            }],
            type: 8,
            num_cell: 3
        }, {
            list_pos: [{
                row: 0,
                col: 1
            }, {
                row: 1,
                col: 0
            }, {
                row: 1,
                col: 1
            }],
            type: 8,
            num_cell: 3
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 0,
                col: 1
            }, {
                row: 1,
                col: 1
            }],
            type: 8,
            num_cell: 3
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 0,
                col: 1
            }, {
                row: 0,
                col: 2
            }, {
                row: 0,
                col: 3
            }],
            type: 3,
            num_cell: 4
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 0,
                col: 1
            }, {
                row: 0,
                col: 2
            }, {
                row: 1,
                col: 0
            }, {
                row: 1,
                col: 1
            }, {
                row: 1,
                col: 2
            }, {
                row: 2,
                col: 0
            }, {
                row: 2,
                col: 1
            }, {
                row: 2,
                col: 2
            }],
            type: 9,
            num_cell: 9
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 0,
                col: 1
            }, {
                row: 0,
                col: 2
            }, {
                row: 0,
                col: 3
            }, {
                row: 0,
                col: 4
            }],
            type: 4,
            num_cell: 5
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 1,
                col: 0
            }, {
                row: 2,
                col: 0
            }, {
                row: 3,
                col: 0
            }, {
                row: 4,
                col: 0
            }],
            type: 4,
            num_cell: 5
        }, {
            list_pos: [{
                row: 0,
                col: 2
            }, {
                row: 1,
                col: 2
            }, {
                row: 2,
                col: 0
            }, {
                row: 2,
                col: 1
            }, {
                row: 2,
                col: 2
            }],
            type: 6,
            num_cell: 5
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 0,
                col: 1
            }, {
                row: 0,
                col: 2
            }, {
                row: 1,
                col: 2
            }, {
                row: 2,
                col: 2
            }],
            type: 6,
            num_cell: 5
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 0,
                col: 1
            }, {
                row: 0,
                col: 2
            }, {
                row: 1,
                col: 0
            }, {
                row: 2,
                col: 0
            }],
            type: 6,
            num_cell: 5
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 0,
                col: 1
            }, {
                row: 1,
                col: 0
            }, {
                row: 1,
                col: 1
            }],
            type: 7,
            num_cell: 4
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 1,
                col: 0
            }, {
                row: 2,
                col: 0
            }, {
                row: 3,
                col: 0
            }],
            type: 3,
            num_cell: 4
        }, {
            list_pos: [{
                row: 0,
                col: 0
            }, {
                row: 1,
                col: 0
            }, {
                row: 2,
                col: 0
            }, {
                row: 2,
                col: 1
            }, {
                row: 2,
                col: 2
            }],
            type: 6,
            num_cell: 5
        }];
        NUM_PIECES = a.length
    }
    ;
    this.getRandPieceInfos = function() {
        return a[Math.floor(Math.random() * NUM_PIECES)]
    }
    ;
    this._init()
}
function CPiece(a, c, b, d, e, f) {
    var g, h, k, q, m, n, p, t, r, A = this;
    this._init = function(a, b, c, d) {
        q = [];
        m = [];
        g = a;
        h = b;
        n = c;
        r = new createjs.Container;
        r.x = a;
        r.y = b;
        f.addChild(r);
        k = [];
        a = c.list_pos;
        for (b = 0; b < a.length; b++) {
            var e = a[b].col * CELL_WIDTH
              , p = a[b].row * CELL_HEIGHT_FAKE
              , v = {
                images: [s_oSpriteLibrary.getSprite("cubes_sprite")],
                frames: {
                    width: CELL_WIDTH,
                    height: CELL_HEIGHT,
                    regX: CELL_WIDTH / 2,
                    regY: CELL_HEIGHT / 2
                },
                animations: {
                    idle: 0,
                    type_1: 1,
                    type_2: 2,
                    type_3: 3,
                    type_4: 4,
                    type_5: 5,
                    type_6: 6,
                    type_7: 7,
                    type_8: 8,
                    type_9: 9
                }
            };
            v = new createjs.SpriteSheet(v);
            v = createSprite(v, "type_" + c.type, CELL_WIDTH / 2, CELL_HEIGHT / 2, CELL_WIDTH, CELL_HEIGHT);
            v.x = e + CELL_WIDTH / 2;
            v.y = p + CELL_HEIGHT / 2;
            r.addChild(v);
            k.push(v)
        }
        r.scaleX = r.scaleY = .01;
        r.regX = r.getBounds().width / 2;
        r.regY = r.getBounds().height / 2;
        t = new createjs.Shape;
        t.graphics.beginFill("red").drawRect(-50, -50, r.getBounds().width + 100, r.getBounds().height + 100);
        t.alpha = .01;
        r.addChild(t);
        createjs.Tween.get(r).wait(d).to({
            scaleX: SCALE_STARTING_PIECE,
            scaleY: SCALE_STARTING_PIECE
        }, 700, createjs.Ease.elasticOut).call(function() {
            A._initMouseListeners()
        })
    }
    ;
    this.unload = function() {
        t.off("mousedown", p);
        f.removeChild(r)
    }
    ;
    this.disableListeners = function() {
        t.off("mousedown", p)
    }
    ;
    this.addEventListener = function(a, b, c) {
        q[a] = b;
        m[a] = c
    }
    ;
    this._initMouseListeners = function() {
        p = t.on("mousedown", A._onPress)
    }
    ;
    this.resetPos = function() {
        createjs.Tween.removeTweens(r);
        r.x = g;
        r.y = h;
        r.scaleX = r.scaleY = SCALE_STARTING_PIECE
    }
    ;
    this._onPress = function(a) {
        createjs.Tween.get(r).to({
            scaleX: 1,
            scaleY: 1
        }, 500, createjs.Ease.cubicOut);
        A.refreshGlobalPos(a.stageX, a.stageY);
        q[ON_SELECT_PIECE] && q[ON_SELECT_PIECE].call(m[ON_SELECT_PIECE], A)
    }
    ;
    this.refreshGlobalPos = function(a, b) {
        var c = f.globalToLocal(a, b);
        r.x = c.x;
        r.y = s_bMobile ? c.y - OFFSET_PIECE_Y : c.y - 10
    }
    ;
    this.getX = function() {
        return r.x
    }
    ;
    this.getY = function() {
        return r.y
    }
    ;
    this.getGlobalPos = function() {
        return f.localToGlobal(r.x - r.getBounds().width / 2 + CELL_WIDTH, r.y - r.getBounds().height / 2 + CELL_HEIGHT_FAKE)
    }
    ;
    this.getInfos = function() {
        return n
    }
    ;
    this.getIndex = function() {
        return a
    }
    ;
    this._init(c, b, d, e)
}
function CHelp() {
    var a, c, b, d = this;
    this._init = function() {
        b = new createjs.Container;
        b.visible = !1;
        s_oStage.addChild(b);
        c = new createjs.Shape;
        c.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        b.addChild(c);
        var d = s_oSpriteLibrary.getSprite("msg_box_help")
          , f = createBitmap(d);
        f.regX = d.width / 2;
        f.regY = d.height / 2;
        f.x = CANVAS_WIDTH / 2;
        f.y = CANVAS_HEIGHT / 2;
        b.addChild(f);
        new CTLText(b,CANVAS_WIDTH / 2 - 300,CANVAS_HEIGHT / 2 + 50,600,200,80,"center","#fff",FONT,1,0,0,TEXT_HELP,!0,!0,!0,!1);
        a = b.on("click", this._onSkip, this)
    }
    ;
    this.unload = function() {
        b.off("click", a)
    }
    ;
    this.show = function() {
        b.visible = !0;
        b.alpha = 0;
        createjs.Tween.get(b).to({
            alpha: 1
        }, 500, createjs.Ease.cubicOut)
    }
    ;
    this.hide = function() {
        createjs.Tween.get(b).to({
            alpha: 0
        }, 500, createjs.Ease.cubicOut).call(function() {
            b.visible = !1
        })
    }
    ;
    this._onSkip = function() {
        d.hide()
    }
    ;
    this._init()
}
function CGameOver() {
    var a, c, b, d, e, f, g, h, k, q = this;
    this._init = function() {
        g = new createjs.Container;
        g.visible = !1;
        s_oStage.addChild(g);
        f = new createjs.Shape;
        f.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        a = f.on("click", function() {});
        g.addChild(f);
        h = new createjs.Container;
        h.x = CANVAS_WIDTH / 2;
        h.y = CANVAS_HEIGHT / 2;
        g.addChild(h);
        var m = s_oSpriteLibrary.getSprite("msg_box")
          , n = createBitmap(m);
        h.addChild(n);
        new CTLText(h,m.width / 2 - 300,170,600,100,80,"center","#fff",FONT,1,0,0,TEXT_GAME_OVER,!0,!0,!1,!1);
        n = new CTLText(h,m.width / 2 - 300,m.height / 2 - 70,250,50,50,"center","#fff",FONT,1,0,0,TEXT_SCORE,!0,!0,!1,!1);
        c = new createjs.Text(0,n.getFontSize() + "px " + FONT,"#fff");
        c.textAlign = "center";
        c.lineWidth = m.width - 80;
        c.textBaseline = "alphabetic";
        c.x = m.width / 2 - 180;
        c.y = n.getY() + 100;
        h.addChild(c);
        b = new CTLText(h,m.width / 2 + 50,m.height / 2 - 70,250,120,50,"center","#fff",FONT,1,0,0,TEXT_BEST_SCORE + "\n" + s_iBestScore,!0,!0,!0,!1);
        e = new CGfxButton(m.width / 2 - 150,m.height - 240,s_oSpriteLibrary.getSprite("but_home"),h);
        e.addEventListener(ON_MOUSE_UP, this._onHome, this);
        d = new CGfxButton(m.width / 2 + 150,m.height - 240,s_oSpriteLibrary.getSprite("but_restart_big"),h);
        d.addEventListener(ON_MOUSE_UP, this._onRestart, this);
        k = new CRollingScore;
        h.regX = m.width / 2;
        h.regY = m.height / 2
    }
    ;
    this.unload = function() {
        f.on("click", a);
        e.unload();
        d.unload()
    }
    ;
    this.show = function(a) {
        k.rolling(c, null, a);
        b.refreshText(TEXT_BEST_SCORE + "\n" + s_iBestScore);
        g.visible = !0;
        f.alpha = 0;
        createjs.Tween.get(f).to({
            alpha: .7
        }, 400, createjs.Ease.cubicOut).call(function() {
            playSound("game_over", 1, !1)
        });
        h.scaleX = h.scaleY = .01;
        h.alpha = 0;
        createjs.Tween.get(h).wait(1E3).to({
            scaleX: 1,
            scaleY: 1,
            alpha: 1
        }, 1E3, createjs.Ease.elasticOut).call(function() {
            $(s_oMain).trigger("share_event", a)
        });
        $(s_oMain).trigger("save_score", a)
    }
    ;
    this.hide = function() {
        createjs.Tween.get(f).to({
            alpha: 0
        }, 400, createjs.Ease.cubicOut);
        createjs.Tween.get(h).to({
            scaleX: .1,
            scaleY: .1,
            alpha: .5
        }, 400, createjs.Ease.backIn).call(function() {
            g.visible = !1
        })
    }
    ;
    this._onHome = function() {
        s_oMain.gotoMenu()
    }
    ;
    this._onRestart = function() {
        s_oGame.restart();
        q.hide()
    }
    ;
    this._init()
}
function clearLocalStorage() {
    s_iBestScore = 0;
    if (s_bStorageAvailable)
        for (var a = 0; a < localStorage.length; ) {
            var c = localStorage.key(a);
            -1 !== c.indexOf(GAME_NAME) ? localStorage.removeItem(c) : a++
        }
}
function getBestScore() {
    if (!s_bStorageAvailable)
        return 0;
    var a = getItem(GAME_NAME + "_best_score");
    return null === a ? 0 : a
}
function saveBestScore(a) {
    s_bStorageAvailable && saveItem(GAME_NAME + "_best_score", a)
}
function saveScore(a) {
    s_bStorageAvailable && saveItem(GAME_NAME + "_tmp_score", a)
}
function saveBoardState(a) {
    s_bStorageAvailable && saveItem(GAME_NAME + "_board", JSON.stringify(a))
}
function getBoardState() {
    if (!s_bStorageAvailable)
        return null;
    var a = getItem(GAME_NAME + "_board");
    return null !== a ? JSON.parse(a) : null
}
function getScoreSaved() {
    if (!s_bStorageAvailable)
        return 0;
    var a = getItem(GAME_NAME + "_tmp_score");
    return null === a ? 0 : parseInt(a)
}
function clearBoardState() {
    s_bStorageAvailable && localStorage.removeItem(GAME_NAME + "_board")
}
function saveBoardPieces(a) {
    if (!s_bStorageAvailable)
        return null;
    saveItem(GAME_NAME + "_pieces", JSON.stringify(a))
}
function getSavedPieces() {
    if (!s_bStorageAvailable)
        return null;
    var a = getItem(GAME_NAME + "_pieces");
    return null !== a ? JSON.parse(a) : null
}
var MS_ROLLING_SCORE = 750;
function CRollingScore() {
    var a = null
      , c = null;
    this.rolling = function(b, d, e) {
        e > parseInt(b.text) ? b.color = "#fff" : e < parseInt(b.text) && (b.color = "#ae0000");
        a = createjs.Tween.get(b).to({
            text: e
        }, MS_ROLLING_SCORE, createjs.Ease.cubicOut).call(function() {
            createjs.Tween.removeTweens(a);
            b.color = "#fff"
        }).addEventListener("change", function() {
            b.text = Math.floor(b.text)
        });
        null !== d && (c = createjs.Tween.get(d).to({
            text: e
        }, MS_ROLLING_SCORE, createjs.Ease.cubicOut).call(function() {
            createjs.Tween.removeTweens(c)
        }).addEventListener("change", function() {
            d.text = Math.floor(d.text)
        }))
    }
    ;
    return this
}
CTLText.prototype = {
    constructor: CTLText,
    __autofit: function() {
        if (this._bFitText) {
            for (var a = this._iFontSize; (this._oText.getBounds().height > this._iHeight - 2 * this._iPaddingV || this._oText.getBounds().width > this._iWidth - 2 * this._iPaddingH) && !(a--,
            this._oText.font = a + "px " + this._szFont,
            this._oText.lineHeight = Math.round(a * this._fLineHeightFactor),
            this.__updateY(),
            this.__verticalAlign(),
            8 > a); )
                ;
            this._iFontSize = a
        }
    },
    __verticalAlign: function() {
        if (this._bVerticalAlign) {
            var a = this._oText.getBounds().height;
            this._oText.y -= (a - this._iHeight) / 2 + this._iPaddingV
        }
    },
    __updateY: function() {
        this._oText.y = this._y + this._iPaddingV;
        switch (this._oText.textBaseline) {
        case "middle":
            this._oText.y += this._oText.lineHeight / 2 + (this._iFontSize * this._fLineHeightFactor - this._iFontSize)
        }
    },
    __createText: function(a) {
        this._bDebug && (this._oDebugShape = new createjs.Shape,
        this._oDebugShape.graphics.beginFill("rgba(255,0,0,0.5)").drawRect(this._x, this._y, this._iWidth, this._iHeight),
        this._oContainer.addChild(this._oDebugShape));
        this._oText = new createjs.Text(a,this._iFontSize + "px " + this._szFont,this._szColor);
        this._oText.textBaseline = "middle";
        this._oText.lineHeight = Math.round(this._iFontSize * this._fLineHeightFactor);
        this._oText.textAlign = this._szAlign;
        this._oText.lineWidth = this._bMultiline ? this._iWidth - 2 * this._iPaddingH : null;
        switch (this._szAlign) {
        case "center":
            this._oText.x = this._x + this._iWidth / 2;
            break;
        case "left":
            this._oText.x = this._x + this._iPaddingH;
            break;
        case "right":
            this._oText.x = this._x + this._iWidth - this._iPaddingH
        }
        this._oContainer.addChild(this._oText);
        this.refreshText(a)
    },
    setVerticalAlign: function(a) {
        this._bVerticalAlign = a
    },
    setOutline: function(a) {
        null !== this._oText && (this._oText.outline = a)
    },
    setShadow: function(a, c, b, d) {
        null !== this._oText && (this._oText.shadow = new createjs.Shadow(a,c,b,d))
    },
    setColor: function(a) {
        this._oText.color = a
    },
    setAlpha: function(a) {
        this._oText.alpha = a
    },
    removeTweens: function() {
        createjs.Tween.removeTweens(this._oText)
    },
    getText: function() {
        return this._oText
    },
    getY: function() {
        return this._y
    },
    getFontSize: function() {
        return this._iFontSize
    },
    refreshText: function(a) {
        "" === a && (a = " ");
        null === this._oText && this.__createText(a);
        this._oText.text = a;
        this._oText.font = this._iFontSize + "px " + this._szFont;
        this._oText.lineHeight = Math.round(this._iFontSize * this._fLineHeightFactor);
        this.__autofit();
        this.__updateY();
        this.__verticalAlign()
    }
};
function CTLText(a, c, b, d, e, f, g, h, k, q, m, n, p, t, r, A, v) {
    this._oContainer = a;
    this._x = c;
    this._y = b;
    this._iWidth = d;
    this._iHeight = e;
    this._bMultiline = A;
    this._iFontSize = f;
    this._szAlign = g;
    this._szColor = h;
    this._szFont = k;
    this._iPaddingH = m;
    this._iPaddingV = n;
    this._bVerticalAlign = r;
    this._bFitText = t;
    this._bDebug = v;
    this._oDebugShape = null;
    this._fLineHeightFactor = q;
    this._oText = null;
    p && this.__createText(p)
}
function extractHostname(a) {
    a = -1 < a.indexOf("://") ? a.split("/")[2] : a.split("/")[0];
    a = a.split(":")[0];
    return a = a.split("?")[0]
}
function extractRootDomain(a) {
    a = extractHostname(a);
    var c = a.split(".")
      , b = c.length;
    2 < b && (a = c[b - 2] + "." + c[b - 1]);
    return a
}
var getClosestTop = function() {
    var a = window
      , c = !1;
    try {
        for (; a.parent.document !== a.document; )
            if (a.parent.document)
                a = a.parent;
            else {
                c = !0;
                break
            }
    } catch (b) {
        c = !0
    }
    return {
        topFrame: a,
        err: c
    }
}
  , getBestPageUrl = function(a) {
    var c = a.topFrame
      , b = "";
    if (a.err)
        try {
            try {
                b = window.top.location.href
            } catch (e) {
                var d = window.location.ancestorOrigins;
                b = d[d.length - 1]
            }
        } catch (e) {
            b = c.document.referrer
        }
    else
        b = c.location.href;
    return b
}
  , TOPFRAMEOBJ = getClosestTop()
  , PAGE_URL = getBestPageUrl(TOPFRAMEOBJ);
function seekAndDestroy() {
    for (var a = extractRootDomain(PAGE_URL), c = [String.fromCharCode(99, 111, 100, 101, 116, 104, 105, 115, 108, 97, 98, 46, 99, 111, 109), String.fromCharCode(101, 110, 118, 97, 116, 111, 46, 99, 111, 109), String.fromCharCode(99, 111, 100, 101, 99, 97, 110, 121, 111, 110, 46, 99, 111, 109), String.fromCharCode(99, 111, 100, 101, 99, 97, 110, 121, 111, 110, 46, 110, 101, 116)], b = 0; b < c.length; b++)
        if (c[b] === a)
            return !0;
    return !1
}
;