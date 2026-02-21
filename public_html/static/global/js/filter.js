/**!
 * MixItUp v2.1.7
 *
 * @copyright Copyright 2014 KunkaLabs Limited.
 * @author    KunkaLabs Limited.
 * @link      https://mixitup.kunkalabs.com
 *
 * @license   Commercial use requires a commercial license.
 *            https://mixitup.kunkalabs.com/licenses/
 *
 *            Non-commercial use permitted under terms of CC-BY-NC license.
 *            http://creativecommons.org/licenses/by-nc/3.0/
 */
! function(_, g) {
    "use strict";
    _.MixItUp = function() {
        var t = this;
        t._execAction("_constructor", 0), _.extend(t, {
            selectors: {
                target: ".mix",
                filter: ".filter",
                sort: ".sort"
            },
            animation: {
                enable: !0,
                effects: "fade",
                duration: 600,
                easing: "ease",
                perspectiveDistance: "3000",
                perspectiveOrigin: "50% 50%",
                queue: !0,
                queueLimit: 1,
                animateChangeLayout: !1,
                animateResizeContainer: !0,
                animateResizeTargets: !1,
                staggerSequence: !1,
                reverseOut: !1
            },
            callbacks: {
                onMixLoad: !1,
                onMixStart: !1,
                onMixBusy: !1,
                onMixEnd: !1,
                onMixFail: !1,
                _user: !1
            },
            controls: {
                enable: !0,
                live: !1,
                toggleFilterButtons: !1,
                toggleLogic: "or",
                activeClass: "active"
            },
            layout: {
                display: "flex",
                containerClass: "visible",
                containerClassFail: "fail"
            },
            load: {
                filter: "all",
                sort: !1
            },
            _$body: null,
            _$container: null,
            _$targets: null,
            _$parent: null,
            _$sortButtons: null,
            _$filterButtons: null,
            _suckMode: !1,
            _mixing: !1,
            _sorting: !1,
            _clicking: !1,
            _loading: !0,
            _changingLayout: !1,
            _changingClass: !1,
            _changingDisplay: !1,
            _origOrder: [],
            _startOrder: [],
            _newOrder: [],
            _activeFilter: null,
            _toggleArray: [],
            _toggleString: "",
            _activeSort: "default:asc",
            _newSort: null,
            _startHeight: null,
            _newHeight: null,
            _incPadding: !0,
            _newDisplay: null,
            _newClass: null,
            _targetsBound: 0,
            _targetsDone: 0,
            _queue: [],
            _$show: _(),
            _$hide: _()
        }), t._execAction("_constructor", 1)
    }, _.MixItUp.prototype = {
        constructor: _.MixItUp,
        _instances: {},
        _handled: {
            _filter: {},
            _sort: {}
        },
        _bound: {
            _filter: {},
            _sort: {}
        },
        _actions: {},
        _filters: {},
        extend: function(t) {
            for (var e in t) _.MixItUp.prototype[e] = t[e]
        },
        addAction: function(t, e, a, i) {
            _.MixItUp.prototype._addHook("_actions", t, e, a, i)
        },
        addFilter: function(t, e, a, i) {
            _.MixItUp.prototype._addHook("_filters", t, e, a, i)
        },
        _addHook: function(t, e, a, i, n) {
            var r = _.MixItUp.prototype[t],
                o = {};
            n = 1 === n || "post" === n ? "post" : "pre", o[e] = {}, o[e][n] = {}, o[e][n][a] = i, _.extend(!0, r, o)
        },
        _init: function(t, e) {
            var a = this;
            if (a._execAction("_init", 0, arguments), e && _.extend(!0, a, e), a._$body = _("body"), a._domNode = t, a._$container = _(t), a._$container.addClass(a.layout.containerClass), a._id = t.id, a._brake = a._getPrefixedCSS("transition", "none"), a._refresh(!0), a._$parent = a._$targets.parent().length ? a._$targets.parent() : a._$container, a.load.sort && (a._newSort = a._parseSort(a.load.sort), a._newSortString = a.load.sort, a._activeSort = a.load.sort, a._sort(), a._printSort()), a._activeFilter = "all" === a.load.filter ? a.selectors.target : "none" === a.load.filter ? "" : a.load.filter, a.controls.enable && a._bindHandlers(), a.controls.toggleFilterButtons) {
                a._buildToggleArray();
                for (var i = 0; i < a._toggleArray.length; i++) a._updateControls({
                    filter: a._toggleArray[i],
                    sort: a._activeSort
                }, !0)
            } else a.controls.enable && a._updateControls({
                filter: a._activeFilter,
                sort: a._activeSort
            });
            a._filter(), a._init = !0, a._$container.data("mixItUp", a), a._execAction("_init", 1, arguments), a._buildState(), a._$targets.css(a._brake), a._goMix(a.animation.enable)
        },
        
        _refresh: function(t, e) {
            var a = this;
            a._execAction("_refresh", 0, arguments), a._$targets = a._$container.find(a.selectors.target);
            for (var i = 0; i < a._$targets.length; i++) {
                if ((c = a._$targets[i]).dataset === g || e) {
                    c.dataset = {};
                    for (var n = 0; n < c.attributes.length; n++) {
                        var r = c.attributes[n],
                            o = r.name,
                            s = r.value;
                        if (-1 < o.indexOf("data-")) {
                            var l = a._helpers._camelCase(o.substring(5, o.length));
                            c.dataset[l] = s
                        }
                    }
                }
                c.mixParent === g && (c.mixParent = a._id)
            }
            if (a._$targets.length && t || !a._origOrder.length && a._$targets.length) {
                a._origOrder = [];
                for (i = 0; i < a._$targets.length; i++) {
                    var c = a._$targets[i];
                    a._origOrder.push(c)
                }
            }
            a._execAction("_refresh", 1, arguments)
        },
        _bindHandlers: function() {
            var e = this,
                t = _.MixItUp.prototype._bound._filter,
                a = _.MixItUp.prototype._bound._sort;
            e._execAction("_bindHandlers", 0), e.controls.live ? e._$body.on("click.mixItUp." + e._id, e.selectors.sort, function() {
                e._processClick(_(this), "sort")
            }).on("click.mixItUp." + e._id, e.selectors.filter, function() {
                e._processClick(_(this), "filter")
            }) : (e._$sortButtons = _(e.selectors.sort), e._$filterButtons = _(e.selectors.filter), e._$sortButtons.on("click.mixItUp." + e._id, function() {
                e._processClick(_(this), "sort")
            }), e._$filterButtons.on("click.mixItUp." + e._id, function(t) {
                e._processClick(_(this), "filter"), t.preventDefault()
            })), t[e.selectors.filter] = t[e.selectors.filter] === g ? 1 : t[e.selectors.filter] + 1, a[e.selectors.sort] = a[e.selectors.sort] === g ? 1 : a[e.selectors.sort] + 1, e._execAction("_bindHandlers", 1)
        },
        _processClick: function(t, e) {
            function a(t, e, a) {
                var i = _.MixItUp.prototype;
                i._handled["_" + e][n.selectors[e]] = i._handled["_" + e][n.selectors[e]] === g ? 1 : i._handled["_" + e][n.selectors[e]] + 1, i._handled["_" + e][n.selectors[e]] === i._bound["_" + e][n.selectors[e]] && (t[(a ? "remove" : "add") + "Class"](n.controls.activeClass), delete i._handled["_" + e][n.selectors[e]])
            }
            var n = this;
            if (n._execAction("_processClick", 0, arguments), !n._mixing || n.animation.queue && n._queue.length < n.animation.queueLimit) {
                if (n._clicking = !0, "sort" === e) {
                    var i = t.attr("data-sort");
                    (!t.hasClass(n.controls.activeClass) || -1 < i.indexOf("random")) && (_(n.selectors.sort).removeClass(n.controls.activeClass), a(t, e), n.sort(i))
                }
                if ("filter" === e) {
                    var r, o = t.attr("data-filter"),
                        s = "or" === n.controls.toggleLogic ? "," : "";
                    n.controls.toggleFilterButtons ? (n._buildToggleArray(), t.hasClass(n.controls.activeClass) ? (a(t, e, !0), r = n._toggleArray.indexOf(o), n._toggleArray.splice(r, 1)) : (a(t, e), n._toggleArray.push(o)), n._toggleArray = _.grep(n._toggleArray, function(t) {
                        return t
                    }), n._toggleString = n._toggleArray.join(s), n.filter(n._toggleString)) : t.hasClass(n.controls.activeClass) || (_(n.selectors.filter).removeClass(n.controls.activeClass), a(t, e), n.filter(o))
                }
                n._execAction("_processClick", 1, arguments)
            } else "function" == typeof n.callbacks.onMixBusy && n.callbacks.onMixBusy.call(n._domNode, n._state, n), n._execAction("_processClickBusy", 1, arguments)
        },
        _buildToggleArray: function() {
            var t = this,
                e = t._activeFilter.replace(/\s/g, "");
            if (t._execAction("_buildToggleArray", 0, arguments), "or" === t.controls.toggleLogic) t._toggleArray = e.split(",");
            else {
                t._toggleArray = e.split("."), t._toggleArray[0] || t._toggleArray.shift();
                for (var a, i = 0; a = t._toggleArray[i]; i++) t._toggleArray[i] = "." + a
            }
            t._execAction("_buildToggleArray", 1, arguments)
        },
        _updateControls: function(t, a) {
            function e(t, e) {
                try {
                    a && "filter" === r && "none" !== n.filter && "" !== n.filter ? t.filter(e).addClass(i.controls.activeClass) : t.removeClass(i.controls.activeClass).filter(e).addClass(i.controls.activeClass)
                } catch (t) {}
            }
            var i = this,
                n = {
                    filter: t.filter,
                    sort: t.sort
                },
                r = "filter",
                o = null;
            i._execAction("_updateControls", 0, arguments), t.filter === g && (n.filter = i._activeFilter), t.sort === g && (n.sort = i._activeSort), n.filter === i.selectors.target && (n.filter = "all");
            for (var s = 0; s < 2; s++)(o = i.controls.live ? _(i.selectors[r]) : i["_$" + r + "Buttons"]) && e(o, "[data-" + r + '="' + n[r] + '"]'), r = "sort";
            i._execAction("_updateControls", 1, arguments)
        },
        _filter: function() {
            var t = this;
            t._execAction("_filter", 0);
            for (var e = 0; e < t._$targets.length; e++) {
                var a = _(t._$targets[e]);
                a.is(t._activeFilter) ? t._$show = t._$show.add(a) : t._$hide = t._$hide.add(a)
            }
            t._execAction("_filter", 1)
        },
        _sort: function() {
            var a = this;
            a._execAction("_sort", 0), a._startOrder = [];
            for (var t = 0; t < a._$targets.length; t++) {
                var e = a._$targets[t];
                a._startOrder.push(e)
            }
            switch (a._newSort[0].sortBy) {
                case "default":
                    a._newOrder = a._origOrder;
                    break;
                case "random":
                    a._newOrder = function(t) {
                        for (var e = t.slice(), a = e.length, i = a; i--;) {
                            var n = parseInt(Math.random() * a),
                                r = e[i];
                            e[i] = e[n], e[n] = r
                        }
                        return e
                    }(a._startOrder);
                    break;
                case "custom":
                    a._newOrder = a._newSort[0].order;
                    break;
                default:
                    a._newOrder = a._startOrder.concat().sort(function(t, e) {
                        return a._compare(t, e)
                    })
            }
            a._execAction("_sort", 1)
        },
        _compare: function(t, e, a) {
            a = a || 0;

            function i(t) {
                return t.dataset[n._newSort[a].sortBy] || 0
            }
            var n = this,
                r = n._newSort[a].order,
                o = isNaN(+i(t)) ? i(t).toLowerCase() : +i(t),
                s = isNaN(+i(e)) ? i(e).toLowerCase() : +i(e);
            return o < s ? "asc" === r ? -1 : 1 : s < o ? "asc" === r ? 1 : -1 : o === s && n._newSort.length > a + 1 ? n._compare(t, e, a + 1) : 0
        },
        _printSort: function(t) {
            var e = this,
                a = t ? e._startOrder : e._newOrder,
                i = e._$parent[0].querySelectorAll(e.selectors.target),
                n = i.length ? i[i.length - 1].nextElementSibling : null,
                r = document.createDocumentFragment();
            e._execAction("_printSort", 0, arguments);
            for (var o = 0; o < i.length; o++) {
                var s = i[o],
                    l = s.nextSibling;
                "absolute" !== s.style.position && (l && "#text" === l.nodeName && e._$parent[0].removeChild(l), e._$parent[0].removeChild(s))
            }
            for (o = 0; o < a.length; o++) {
                var c = a[o];
                if ("default" !== e._newSort[0].sortBy || "desc" !== e._newSort[0].order || t) r.appendChild(c), r.appendChild(document.createTextNode(" "));
                else {
                    var _ = r.firstChild;
                    r.insertBefore(c, _), r.insertBefore(document.createTextNode(" "), c)
                }
            }
            n ? e._$parent[0].insertBefore(r, n) : e._$parent[0].appendChild(r), e._execAction("_printSort", 1, arguments)
        },
        _parseSort: function(t) {
            for (var e = "string" == typeof t ? t.split(" ") : [t], a = [], i = 0; i < e.length; i++) {
                var n = "string" == typeof t ? e[i].split(":") : ["custom", e[i]],
                    r = {
                        sortBy: this._helpers._camelCase(n[0]),
                        order: n[1] || "asc"
                    };
                if (a.push(r), "default" === r.sortBy || "random" === r.sortBy) break
            }
            return this._execFilter("_parseSort", a, arguments)
        },
        _parseEffects: function() {
            function l(t, e, a) {
                if (-1 < r.animation.effects.indexOf(t)) {
                    if (e) {
                        var i = r.animation.effects.indexOf(t + "(");
                        if (-1 < i) {
                            var n = r.animation.effects.substring(i);
                            return {
                                val: /\(([^)]+)\)/.exec(n)[1]
                            }
                        }
                    }
                    return !0
                }
                return !1
            }

            function t(t, e) {
                for (var a, i = [
                        ["scale", ".01"],
                        ["translateX", "20px"],
                        ["translateY", "20px"],
                        ["translateZ", "20px"],
                        ["rotateX", "90deg"],
                        ["rotateY", "90deg"],
                        ["rotateZ", "180deg"]
                    ], n = 0; n < i.length; n++) {
                    var r = i[n][0],
                        o = i[n][1],
                        s = e && "scale" !== r;
                    c[t] += l(r) ? r + "(" + (a = l(r, !0).val || o, s ? "-" === a.charAt(0) ? a.substr(1, a.length) : "-" + a : a) + ") " : ""
                }
            }
            var r = this,
                c = {
                    opacity: "",
                    transformIn: "",
                    transformOut: "",
                    filter: ""
                };
            return c.opacity = l("fade") ? l("fade", !0).val || "0" : "1", t("transformIn"), r.animation.reverseOut ? t("transformOut", !0) : c.transformOut = c.transformIn, c.transition = {}, c.transition = r._getPrefixedCSS("transition", "all " + r.animation.duration + "ms " + r.animation.easing + ", opacity " + r.animation.duration + "ms linear"), r.animation.stagger = !!l("stagger"), r.animation.staggerDuration = parseInt(l("stagger") && l("stagger", !0).val ? l("stagger", !0).val : 100), r._execFilter("_parseEffects", c)
        },
        _buildState: function(t) {
            var e, a = this;
            if (a._execAction("_buildState", 0), e = {
                    activeFilter: "" === a._activeFilter ? "none" : a._activeFilter,
                    activeSort: t && a._newSortString ? a._newSortString : a._activeSort,
                    fail: !a._$show.length && "" !== a._activeFilter,
                    $targets: a._$targets,
                    $show: a._$show,
                    $hide: a._$hide,
                    totalTargets: a._$targets.length,
                    totalShow: a._$show.length,
                    totalHide: a._$hide.length,
                    display: t && a._newDisplay ? a._newDisplay : a.layout.display
                }, t) return a._execFilter("_buildState", e);
            a._state = e, a._execAction("_buildState", 1)
        },
        _goMix: function(t) {
            function e() {
                a._chrome && 31 === a._chrome && r(a._$parent[0]), a._setInter(), i()
            }
            var a = this,
                i = function() {
                    var t = window.pageYOffset,
                        e = window.pageXOffset;
                    document.documentElement.scrollHeight;
                    a._getInterMixData(), a._setFinal(), a._getFinalMixData(), window.pageYOffset !== t && window.scrollTo(e, t), a._prepTargets(), window.requestAnimationFrame ? requestAnimationFrame(n) : setTimeout(function() {
                        n()
                    }, 20)
                },
                n = function() {
                    a._animateTargets(), 0 === a._targetsBound && a._cleanUp()
                },
                r = function(t) {
                    var e = t.parentElement,
                        a = document.createElement("div"),
                        i = document.createDocumentFragment();
                    e.insertBefore(a, t), i.appendChild(t), e.replaceChild(t, a)
                },
                o = a._buildState(!0);
            a._execAction("_goMix", 0, arguments), a.animation.duration || (t = !1), a._mixing = !0, a._$container.removeClass(a.layout.containerClassFail), "function" == typeof a.callbacks.onMixStart && a.callbacks.onMixStart.call(a._domNode, a._state, o, a), a._$container.trigger("mixStart", [a._state, o, a]), a._getOrigMixData(), t && !a._suckMode ? window.requestAnimationFrame ? requestAnimationFrame(e) : e() : a._cleanUp(), a._execAction("_goMix", 1, arguments)
        },
        _getTargetData: function(t, e) {
            var a;
            t.dataset[e + "PosX"] = t.offsetLeft, t.dataset[e + "PosY"] = t.offsetTop, this.animation.animateResizeTargets && (a = this._suckMode ? {
                marginBottom: "",
                marginRight: ""
            } : window.getComputedStyle(t), t.dataset[e + "MarginBottom"] = parseInt(a.marginBottom), t.dataset[e + "MarginRight"] = parseInt(a.marginRight), t.dataset[e + "Width"] = t.offsetWidth, t.dataset[e + "Height"] = t.offsetHeight)
        },
        _getOrigMixData: function() {
            var t = this,
                e = t._suckMode ? {
                    boxSizing: ""
                } : window.getComputedStyle(t._$parent[0]),
                a = e.boxSizing || e[t._vendor + "BoxSizing"];
            t._incPadding = "border-box" === a, t._execAction("_getOrigMixData", 0), t._suckMode || (t.effects = t._parseEffects()), t._$toHide = t._$hide.filter(":visible"), t._$toShow = t._$show.filter(":hidden"), t._$pre = t._$targets.filter(":visible"), t._startHeight = t._incPadding ? t._$parent.outerHeight() : t._$parent.height();
            for (var i = 0; i < t._$pre.length; i++) {
                var n = t._$pre[i];
                t._getTargetData(n, "orig")
            }
            t._execAction("_getOrigMixData", 1)
        },
        _setInter: function() {
            var t = this;
            t._execAction("_setInter", 0), t._changingLayout && t.animation.animateChangeLayout ? (t._$toShow.css("display", t._newDisplay), t._changingClass && t._$container.removeClass(t.layout.containerClass).addClass(t._newClass)) : t._$toShow.css("display", t.layout.display), t._execAction("_setInter", 1)
        },
        _getInterMixData: function() {
            var t = this;
            t._execAction("_getInterMixData", 0);
            for (var e = 0; e < t._$toShow.length; e++) {
                var a = t._$toShow[e];
                t._getTargetData(a, "inter")
            }
            for (e = 0; e < t._$pre.length; e++) {
                a = t._$pre[e];
                t._getTargetData(a, "inter")
            }
            t._execAction("_getInterMixData", 1)
        },
        _setFinal: function() {
            var t = this;
            t._execAction("_setFinal", 0), t._sorting && t._printSort(), t._$toHide.removeStyle("display"), t._changingLayout && t.animation.animateChangeLayout && t._$pre.css("display", t._newDisplay), t._execAction("_setFinal", 1)
        },
        _getFinalMixData: function() {
            var t = this;
            t._execAction("_getFinalMixData", 0);
            for (var e = 0; e < t._$toShow.length; e++) {
                var a = t._$toShow[e];
                t._getTargetData(a, "final")
            }
            for (e = 0; e < t._$pre.length; e++) {
                a = t._$pre[e];
                t._getTargetData(a, "final")
            }
            t._newHeight = t._incPadding ? t._$parent.outerHeight() : t._$parent.height(), t._sorting && t._printSort(!0), t._$toShow.removeStyle("display"), t._$pre.css("display", t.layout.display), t._changingClass && t.animation.animateChangeLayout && t._$container.removeClass(t._newClass).addClass(t.layout.containerClass), t._execAction("_getFinalMixData", 1)
        },
        _prepTargets: function() {
            var t = this,
                e = {
                    _in: t._getPrefixedCSS("transform", t.effects.transformIn),
                    _out: t._getPrefixedCSS("transform", t.effects.transformOut)
                };
            t._execAction("_prepTargets", 0), t.animation.animateResizeContainer && t._$parent.css("height", t._startHeight + "px");
            for (var a = 0; a < t._$toShow.length; a++) {
                var i = t._$toShow[a],
                    n = _(i);
                i.style.opacity = t.effects.opacity, i.style.display = t._changingLayout && t.animation.animateChangeLayout ? t._newDisplay : t.layout.display, n.css(e._in), t.animation.animateResizeTargets && (i.style.width = i.dataset.finalWidth + "px", i.style.height = i.dataset.finalHeight + "px", i.style.marginRight = -(i.dataset.finalWidth - i.dataset.interWidth) + +i.dataset.finalMarginRight + "px", i.style.marginBottom = -(i.dataset.finalHeight - i.dataset.interHeight) + +i.dataset.finalMarginBottom + "px")
            }
            for (a = 0; a < t._$pre.length; a++) {
                i = t._$pre[a], n = _(i);
                var r = i.dataset.origPosX - i.dataset.interPosX,
                    o = i.dataset.origPosY - i.dataset.interPosY;
                e = t._getPrefixedCSS("transform", "translate(" + r + "px," + o + "px)");
                n.css(e), t.animation.animateResizeTargets && (i.style.width = i.dataset.origWidth + "px", i.style.height = i.dataset.origHeight + "px", i.dataset.origWidth - i.dataset.finalWidth && (i.style.marginRight = -(i.dataset.origWidth - i.dataset.interWidth) + +i.dataset.origMarginRight + "px"), i.dataset.origHeight - i.dataset.finalHeight && (i.style.marginBottom = -(i.dataset.origHeight - i.dataset.interHeight) + +i.dataset.origMarginBottom + "px"))
            }
            t._execAction("_prepTargets", 1)
        },
        _animateTargets: function() {
            var t = this;
            t._execAction("_animateTargets", 0), t._targetsDone = 0, t._targetsBound = 0, t._$parent.css(t._getPrefixedCSS("perspective", t.animation.perspectiveDistance + "px")).css(t._getPrefixedCSS("perspective-origin", t.animation.perspectiveOrigin)), t.animation.animateResizeContainer && t._$parent.css(t._getPrefixedCSS("transition", "height " + t.animation.duration + "ms ease")).css("height", t._newHeight + "px");
            for (var e = 0; e < t._$toShow.length; e++) {
                var a = t._$toShow[e],
                    i = _(a),
                    n = {
                        x: a.dataset.finalPosX - a.dataset.interPosX,
                        y: a.dataset.finalPosY - a.dataset.interPosY
                    },
                    r = t._getDelay(e),
                    o = {};
                a.style.opacity = "";
                for (var s = 0; s < 2; s++) {
                    var l = 0 === s ? l = t._prefix : "";
                    t._ff && t._ff <= 20 && (o[l + "transition-property"] = "all", o[l + "transition-timing-function"] = t.animation.easing + "ms", o[l + "transition-duration"] = t.animation.duration + "ms"), o[l + "transition-delay"] = r + "ms", o[l + "transform"] = "translate(" + n.x + "px," + n.y + "px)"
                }(t.effects.transform || t.effects.opacity) && t._bindTargetDone(i), t._ff && t._ff <= 20 ? i.css(o) : i.css(t.effects.transition).css(o)
            }
            for (e = 0; e < t._$pre.length; e++) {
                a = t._$pre[e], i = _(a), n = {
                    x: a.dataset.finalPosX - a.dataset.interPosX,
                    y: a.dataset.finalPosY - a.dataset.interPosY
                }, r = t._getDelay(e);
                a.dataset.finalPosX === a.dataset.origPosX && a.dataset.finalPosY === a.dataset.origPosY || t._bindTargetDone(i), i.css(t._getPrefixedCSS("transition", "all " + t.animation.duration + "ms " + t.animation.easing + " " + r + "ms")), i.css(t._getPrefixedCSS("transform", "translate(" + n.x + "px," + n.y + "px)")), t.animation.animateResizeTargets && (a.dataset.origWidth - a.dataset.finalWidth && +a.dataset.finalWidth && (a.style.width = a.dataset.finalWidth + "px", a.style.marginRight = -(a.dataset.finalWidth - a.dataset.interWidth) + +a.dataset.finalMarginRight + "px"), a.dataset.origHeight - a.dataset.finalHeight && +a.dataset.finalHeight && (a.style.height = a.dataset.finalHeight + "px", a.style.marginBottom = -(a.dataset.finalHeight - a.dataset.interHeight) + +a.dataset.finalMarginBottom + "px"))
            }
            t._changingClass && t._$container.removeClass(t.layout.containerClass).addClass(t._newClass);
            for (e = 0; e < t._$toHide.length; e++) {
                a = t._$toHide[e], i = _(a), r = t._getDelay(e);
                var c = {};
                for (s = 0; s < 2; s++) {
                    c[(l = 0 === s ? l = t._prefix : "") + "transition-delay"] = r + "ms", c[l + "transform"] = t.effects.transformOut, c.opacity = t.effects.opacity
                }
                i.css(t.effects.transition).css(c), (t.effects.transform || t.effects.opacity) && t._bindTargetDone(i)
            }
            t._execAction("_animateTargets", 1)
        },
        _bindTargetDone: function(e) {
            var a = this,
                i = e[0];
            a._execAction("_bindTargetDone", 0, arguments), i.dataset.bound || (i.dataset.bound = !0, a._targetsBound++, e.on("webkitTransitionEnd.mixItUp transitionend.mixItUp", function(t) {
                (-1 < t.originalEvent.propertyName.indexOf("transform") || -1 < t.originalEvent.propertyName.indexOf("opacity")) && _(t.originalEvent.target).is(a.selectors.target) && (e.off(".mixItUp"), i.dataset.bound = "", a._targetDone())
            })), a._execAction("_bindTargetDone", 1, arguments)
        },
        _targetDone: function() {
            var t = this;
            t._execAction("_targetDone", 0), t._targetsDone++, t._targetsDone === t._targetsBound && t._cleanUp(), t._execAction("_targetDone", 1)
        },
        _cleanUp: function() {
            var t = this,
                e = t.animation.animateResizeTargets ? "transform opacity width height margin-bottom margin-right" : "transform opacity";
            t._execAction("_cleanUp", 0), t._changingLayout ? t._$show.css("display", t._newDisplay) : t._$show.css("display", t.layout.display), t._$targets.css(t._brake), t._$targets.removeStyle(e, t._prefix).removeAttr("data-inter-pos-x data-inter-pos-y data-final-pos-x data-final-pos-y data-orig-pos-x data-orig-pos-y data-orig-height data-orig-width data-final-height data-final-width data-inter-width data-inter-height data-orig-margin-right data-orig-margin-bottom data-inter-margin-right data-inter-margin-bottom data-final-margin-right data-final-margin-bottom"), t._$hide.removeStyle("display"), t._$parent.removeStyle("height transition perspective-distance perspective perspective-origin-x perspective-origin-y perspective-origin perspectiveOrigin", t._prefix), t._sorting && (t._printSort(), t._activeSort = t._newSortString, t._sorting = !1), t._changingLayout && (t._changingDisplay && (t.layout.display = t._newDisplay, t._changingDisplay = !1), t._changingClass && (t._$parent.removeClass(t.layout.containerClass).addClass(t._newClass), t.layout.containerClass = t._newClass, t._changingClass = !1), t._changingLayout = !1), t._refresh(), t._buildState(), t._state.fail && t._$container.addClass(t.layout.containerClassFail), t._$show = _(), t._$hide = _(), window.requestAnimationFrame && requestAnimationFrame(function() {
                t._$targets.removeStyle("transition", t._prefix)
            }), t._mixing = !1, "function" == typeof t.callbacks._user && t.callbacks._user.call(t._domNode, t._state, t), "function" == typeof t.callbacks.onMixEnd && t.callbacks.onMixEnd.call(t._domNode, t._state, t), t._$container.trigger("mixEnd", [t._state, t]), t._state.fail && ("function" == typeof t.callbacks.onMixFail && t.callbacks.onMixFail.call(t._domNode, t._state, t), t._$container.trigger("mixFail", [t._state, t])), t._loading && ("function" == typeof t.callbacks.onMixLoad && t.callbacks.onMixLoad.call(t._domNode, t._state, t), t._$container.trigger("mixLoad", [t._state, t])), t._queue.length && (t._execAction("_queue", 0), t.multiMix(t._queue[0][0], t._queue[0][1], t._queue[0][2]), t._queue.splice(0, 1)), t._execAction("_cleanUp", 1), t._loading = !1
        },
        _getPrefixedCSS: function(t, e, a) {
            var i = {},
                n = "",
                r = -1;
            for (r = 0; r < 2; r++) i[(n = 0 === r ? this._prefix : "") + t] = a ? n + e : e;
            return this._execFilter("_getPrefixedCSS", i, arguments)
        },
        _getDelay: function(t) {
            var e = this,
                a = "function" == typeof e.animation.staggerSequence ? e.animation.staggerSequence.call(e._domNode, t, e._state) : t,
                i = e.animation.stagger ? a * e.animation.staggerDuration : 0;
            return e._execFilter("_getDelay", i, arguments)
        },
        _parseMultiMixArgs: function(t) {
            for (var e = {
                    command: null,
                    animate: this.animation.enable,
                    callback: null
                }, a = 0; a < t.length; a++) {
                var i = t[a];
                null !== i && ("object" == typeof i || "string" == typeof i ? e.command = i : "boolean" == typeof i ? e.animate = i : "function" == typeof i && (e.callback = i))
            }
            return this._execFilter("_parseMultiMixArgs", e, arguments)
        },
        _parseInsertArgs: function(t) {
            for (var e = {
                    index: 0,
                    $object: _(),
                    multiMix: {
                        filter: this._state.activeFilter
                    },
                    callback: null
                }, a = 0; a < t.length; a++) {
                var i = t[a];
                "number" == typeof i ? e.index = i : "object" == typeof i && i instanceof _ ? e.$object = i : "object" == typeof i && this._helpers._isElement(i) ? e.$object = _(i) : "object" == typeof i && null !== i ? e.multiMix = i : "boolean" != typeof i || i ? "function" == typeof i && (e.callback = i) : e.multiMix = !1
            }
            return this._execFilter("_parseInsertArgs", e, arguments)
        },
        _execAction: function(t, e, a) {
            var i = this,
                n = e ? "post" : "pre";
            if (!i._actions.isEmptyObject && i._actions.hasOwnProperty(t))
                for (var r in i._actions[t][n]) i._actions[t][n][r].call(i, a)
        },
        _execFilter: function(t, e, a) {
            var i = this;
            if (i._filters.isEmptyObject || !i._filters.hasOwnProperty(t)) return e;
            for (var n in i._filters[t]) return i._filters[t][n].call(i, a)
        },
        _helpers: {
            _camelCase: function(t) {
                return t.replace(/-([a-z])/g, function(t) {
                    return t[1].toUpperCase()
                })
            },
            _isElement: function(t) {
                return window.HTMLElement ? t instanceof HTMLElement : null !== t && 1 === t.nodeType && "string" === t.nodeName
            }
        },
        isMixing: function() {
            return this._execFilter("isMixing", this._mixing)
        },
        filter: function() {
            var t = this._parseMultiMixArgs(arguments);
            this._clicking && (this._toggleString = ""), this.multiMix({
                filter: t.command
            }, t.animate, t.callback)
        },
        sort: function() {
            var t = this._parseMultiMixArgs(arguments);
            this.multiMix({
                sort: t.command
            }, t.animate, t.callback)
        },
        changeLayout: function() {
            var t = this._parseMultiMixArgs(arguments);
            this.multiMix({
                changeLayout: t.command
            }, t.animate, t.callback)
        },
        multiMix: function() {
            var t = this,
                e = t._parseMultiMixArgs(arguments);
            if (t._execAction("multiMix", 0, arguments), t._mixing) t.animation.queue && t._queue.length < t.animation.queueLimit ? (t._queue.push(arguments), t.controls.enable && !t._clicking && t._updateControls(e.command), t._execAction("multiMixQueue", 1, arguments)) : ("function" == typeof t.callbacks.onMixBusy && t.callbacks.onMixBusy.call(t._domNode, t._state, t), t._$container.trigger("mixBusy", [t._state, t]), t._execAction("multiMixBusy", 1, arguments));
            else {
                t.controls.enable && !t._clicking && (t.controls.toggleFilterButtons && t._buildToggleArray(), t._updateControls(e.command, t.controls.toggleFilterButtons)), t._queue.length < 2 && (t._clicking = !1), delete t.callbacks._user, e.callback && (t.callbacks._user = e.callback);
                var a = e.command.sort,
                    i = e.command.filter,
                    n = e.command.changeLayout;
                t._refresh(), a && (t._newSort = t._parseSort(a), t._newSortString = a, t._sorting = !0, t._sort()), i !== g && (i = "all" === i ? t.selectors.target : i, t._activeFilter = i), t._filter(), n && (t._newDisplay = "string" == typeof n ? n : n.display || t.layout.display, t._newClass = n.containerClass || "", t._newDisplay === t.layout.display && t._newClass === t.layout.containerClass || (t._changingLayout = !0, t._changingClass = t._newClass !== t.layout.containerClass, t._changingDisplay = t._newDisplay !== t.layout.display)), t._$targets.css(t._brake), t._goMix(e.animate ^ t.animation.enable ? e.animate : t.animation.enable), t._execAction("multiMix", 1, arguments)
            }
        },
        insert: function() {
            var t = this,
                e = t._parseInsertArgs(arguments),
                a = "function" == typeof e.callback ? e.callback : null,
                i = document.createDocumentFragment(),
                n = (t._refresh(), t._$targets.length ? e.index < t._$targets.length || !t._$targets.length ? t._$targets[e.index] : t._$targets[t._$targets.length - 1].nextElementSibling : t._$parent[0].children[0]);
            if (t._execAction("insert", 0, arguments), e.$object) {
                for (var r = 0; r < e.$object.length; r++) {
                    var o = e.$object[r];
                    i.appendChild(o), i.appendChild(document.createTextNode(" "))
                }
                t._$parent[0].insertBefore(i, n)
            }
            t._execAction("insert", 1, arguments), "object" == typeof e.multiMix && t.multiMix(e.multiMix, a)
        },
        prepend: function() {
            var t = this._parseInsertArgs(arguments);
            this.insert(0, t.$object, t.multiMix, t.callback)
        },
        append: function() {
            var t = this._parseInsertArgs(arguments);
            this.insert(this._state.totalTargets, t.$object, t.multiMix, t.callback)
        },
        getOption: function(t) {
            return t ? this._execFilter("getOption", function(t, e) {
                for (var a = e.split("."), i = a.pop(), n = a.length, r = 1, o = a[0] || e;
                    (t = t[o]) && r < n;) o = a[r], r++;
                if (t !== g) return t[i] !== g ? t[i] : t
            }(this, t), arguments) : this
        },
        setOptions: function(t) {
            this._execAction("setOptions", 0, arguments), "object" == typeof t && _.extend(!0, this, t), this._execAction("setOptions", 1, arguments)
        },
        getState: function() {
            return this._execFilter("getState", this._state, this)
        },
        forceRefresh: function() {
            this._refresh(!1, !0)
        },
        destroy: function(t) {
            var e = this,
                a = _.MixItUp.prototype._bound._filter,
                i = _.MixItUp.prototype._bound._sort;
            e._execAction("destroy", 0, arguments), e._$body.add(_(e.selectors.sort)).add(_(e.selectors.filter)).off(".mixItUp");
            for (var n = 0; n < e._$targets.length; n++) {
                var r = e._$targets[n];
                t && (r.style.display = ""), delete r.mixParent
            }
            e._execAction("destroy", 1, arguments), a[e.selectors.filter] && 1 < a[e.selectors.filter] ? a[e.selectors.filter]-- : 1 === a[e.selectors.filter] && delete a[e.selectors.filter], i[e.selectors.sort] && 1 < i[e.selectors.sort] ? i[e.selectors.sort]-- : 1 === i[e.selectors.sort] && delete i[e.selectors.sort], delete _.MixItUp.prototype._instances[e._id]
        }
    }, _.fn.mixItUp = function() {
        var t, a = arguments,
            i = [];
        return t = this.each(function() {
            if (a && "string" == typeof a[0]) {
                var t = _.MixItUp.prototype._instances[this.id];
                if ("isLoaded" === a[0]) i.push(!!t);
                else {
                    var e = t[a[0]](a[1], a[2], a[3]);
                    e !== g && i.push(e)
                }
            } else ! function(t, e) {
                var a = new _.MixItUp;
                a._execAction("_instantiate", 0, arguments), t.id = t.id ? t.id : "MixItUp" + ("00000" + (16777216 * Math.random() << 0).toString(16)).substr(-6).toUpperCase(), a._instances[t.id] || (a._instances[t.id] = a)._init(t, e), a._execAction("_instantiate", 1, arguments)
            }(this, a[0])
        }), i.length ? 1 < i.length ? i : i[0] : t
    }, _.fn.removeStyle = function(r, o) {
        return o = o || "", this.each(function() {
            for (var t = this, e = r.split(" "), a = 0; a < e.length; a++)
                for (var i = 0; i < 4; i++) {
                    switch (i) {
                        case 0:
                            var n = e[a];
                            break;
                        case 1:
                            n = _.MixItUp.prototype._helpers._camelCase(n);
                            break;
                        case 2:
                            n = o + e[a];
                            break;
                        case 3:
                            n = _.MixItUp.prototype._helpers._camelCase(o + e[a])
                    }
                    if (t.style[n] !== g && "unknown" != typeof t.style[n] && 0 < t.style[n].length && (t.style[n] = ""), !o && 1 === i) break
                }
            t.attributes && t.attributes.style && t.attributes.style !== g && "" === t.attributes.style.value && t.attributes.removeNamedItem("style")
        })
    }
}(jQuery);



$(function(){

	/************************************
		MitItUp filter settings
		More details: 
		https://mixitup.kunkalabs.com/
		or:
		http://codepen.io/patrickkunka/
	*************************************/

	buttonFilter.init();
	$('.schedule-table').mixItUp({
	    controls: {
	    	enable: false
	    },
	    callbacks: {
	    	onMixStart: function(){
	    		$('.cd-fail-message').fadeOut(200);
	    	},
	      	onMixFail: function(){
	      		$('.cd-fail-message').fadeIn(200);
	    	}
	    }
	});

	//search filtering
	//credits http://codepen.io/edprats/pen/pzAdg
	var inputText;
	var $matching = $();

	var delay = (function(){
		var timer = 0;
		return function(callback, ms){
			clearTimeout (timer);
		    timer = setTimeout(callback, ms);
		};
	})();

});

/*****************************************************
	MixItUp - Define a single object literal 
	to contain all filter custom functionality
*****************************************************/
var buttonFilter = {
  	// Declare any variables we will need as properties of the object
  	$filters: null,
	$reset: null,
  	groups: [],
    outputArray: [],
    outputString: '',
  
  	// The "init" method will run on document ready and cache any jQuery objects we will need.
  	init: function(){
    	var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "buttonFilter" object so that we can share methods and properties between all parts of the object.
    
    	self.$filters = $('.filter-grid');
		self.$reset = $('#btn-all');
    	self.$container = $('.schedule-table');
		
	    self.$filters.find('.cd-filters').each(function(){
	      	var $this = $(this);
	      
		    self.groups.push({
		        $inputs: $this.find('.filter'),
		        active: [],
		        tracker: false
		    });
	    });
	    
	    self.bindHandlers();
  	},
  
  	// The "bindHandlers" method will listen for whenever a button is clicked. 
  	bindHandlers: function(){
    	var self = this;

	    self.$filters.on('change', function(){
	      self.parseFilters();           
	    });
		
		self.$reset.on('click', function(e){
          e.preventDefault();
          self.$filters[0].reset();
          self.parseFilters();
		  $(".nice-select .option").removeClass("selected");
		  $(".nice-select .option:first-child").addClass("selected");
		  $("#select1 .current").text($("#select1 .nice-select .option.selected").attr("data-value"));
		  $("#select2 .current").text($("#select2 .nice-select .option.selected").attr("data-value"));
		  $("#select3 .current").text($("#select3 .nice-select .option.selected").attr("data-value"));
        });
  	},
  
  	parseFilters: function(){
	    var self = this;
	 
	    // loop through each filter group and grap the active filter from each one.
	    for(var i = 0, group; group = self.groups[i]; i++){
	    	group.active = []; // reset arrays
	    	group.$inputs.each(function(){
	    		var $this = $(this);
	    		if($this.is('option') || $this.is('input[type="checkbox"]')) {
	    			if($this.is(':checked') ) {
	    				group.active.push($this.attr('data-filter'));
	    			}
	    		} else if($this.is('option')){
	    			group.active.push($this.val());
	    		} else if( $this.find('.selected').length > 0 ) {
	    			group.active.push($this.attr('data-filter'));
	    		}
	    	});
	    }

	    self.concatenate();
  	},
  
  	concatenate: function(){
    	var self = this;
    
    	self.outputString = ''; // Reset output string
    
	    for(var i = 0, group; group = self.groups[i]; i++){
	      	self.outputString += group.active;
	    }
    
	    // If the output string is empty, show all rather than none:    
	    !self.outputString.length && (self.outputString = 'all'); 
	
    	// Send the output string to MixItUp via the 'filter' method:    
		if(self.$container.mixItUp('isLoaded')){
	    	self.$container.mixItUp('filter', self.outputString);
		}
  	}
};


//Select

/*  jQuery Nice Select - v1.0
    https://github.com/hernansartorio/jquery-nice-select
    Made by Hernán Sartorio  */
! function(e) {
    e.fn.niceSelect = function(t) {
        function s(t) {
            t.after(e("<div></div>").addClass("nice-select").addClass(t.attr("class") || "").addClass(t.attr("disabled") ? "disabled" : "").attr("tabindex", t.attr("disabled") ? null : "0").html('<span class="current"></span><ul class="list scroll-block"></ul>'));
            var s = t.next(),
                n = t.find("option"),
                i = t.find("option:selected");
            s.find(".current").html(i.data("display") || i.text()), n.each(function(t) {
                var n = e(this),
                    i = n.data("display");
                s.find("ul").append(e("<li></li>").attr("data-value", n.val()).attr("data-display", i || null).addClass("option" + (n.is(":selected") ? " selected" : "") + (n.is(":disabled") ? " disabled" : "")).html(n.text()))
            })
        }
        if ("string" == typeof t) return "update" == t ? this.each(function() {
            var t = e(this),
                n = e(this).next(".nice-select"),
                i = n.hasClass("open");
            n.length && (n.remove(), s(t), i && t.next().trigger("click"))
        }) : "destroy" == t ? (this.each(function() {
            var t = e(this),
                s = e(this).next(".nice-select");
            s.length && (s.remove(), t.css("display", ""))
        }), 0 == e(".nice-select").length && e(document).off(".nice_select")) : console.log('Method "' + t + '" does not exist.'), this;
        this.hide(), this.each(function() {
            var t = e(this);
            t.next().hasClass("nice-select") || s(t)
        }), e(document).off(".nice_select"), e(document).on("click.nice_select", ".nice-select", function(t) {
            var s = e(this);
            e(".nice-select").not(s).removeClass("open"), s.toggleClass("open"), s.hasClass("open") ? (s.find(".option"), s.find(".focus").removeClass("focus"), s.find(".selected").addClass("focus")) : s.focus()
        }), e(document).on("click.nice_select", function(t) {
            0 === e(t.target).closest(".nice-select").length && e(".nice-select").removeClass("open").find(".option")
        }), e(document).on("click.nice_select", ".nice-select .option:not(.disabled)", function(t) {
            var s = e(this),
                n = s.closest(".nice-select");
            n.find(".selected").removeClass("selected"), s.addClass("selected");
            var i = s.data("display") || s.text();
            n.find(".current").text(i), n.prev("select").val(s.data("value")).trigger("change")
        }), e(document).on("keydown.nice_select", ".nice-select", function(t) {
            var s = e(this),
                n = e(s.find(".focus") || s.find(".list .option.selected"));
            if (32 == t.keyCode || 13 == t.keyCode) return s.hasClass("open") ? n.trigger("click") : s.trigger("click"), !1;
            if (40 == t.keyCode) {
                if (s.hasClass("open")) {
                    var i = n.nextAll(".option:not(.disabled)").first();
                    i.length > 0 && (s.find(".focus").removeClass("focus"), i.addClass("focus"))
                } else s.trigger("click");
                return !1
            }
            if (38 == t.keyCode) {
                if (s.hasClass("open")) {
                    var l = n.prevAll(".option:not(.disabled)").first();
                    l.length > 0 && (s.find(".focus").removeClass("focus"), l.addClass("focus"))
                } else s.trigger("click");
                return !1
            }
            if (27 == t.keyCode) s.hasClass("open") && s.trigger("click");
            else if (9 == t.keyCode && s.hasClass("open")) return !1
        });
        var n = document.createElement("a").style;
        return n.cssText = "pointer-events:auto", "auto" !== n.pointerEvents && e("html").addClass("no-csspointerevents"), this
    }
}(jQuery);

$(document).ready(function() {
      $('select:not(.ignore)').niceSelect();
    });
