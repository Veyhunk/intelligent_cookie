
let myTempCookie = {};
const isFunction = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Function]'
    // return typeof obj === 'function'
}

const defaultOption = {
    // maxAge: 0 // ms
    // domain: '',
    path: "/",
    expires: "7D" // tiny cookie
}

const _originStorage = function () {
    let pluses = /\+/g

    function encode(s) {
        return cookieStorage.raw ? s : encodeURIComponent(s)
    }

    function decode(s) {
        return cookieStorage.raw ? s : decodeURIComponent(s)
    }

    function stringifyCookieValue(value) {
        return encode(cookieStorage.json ? JSON.stringify(value) : String(value))
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\')
        }
        try {
            s = decodeURIComponent(s.replace(pluses, ' '))
            return cookieStorage.json ? JSON.parse(s) : s
        } catch (error) { }
    }
    function read(s, converter) {
        let value = cookieStorage.raw ? s : parseCookieValue(s)
        return isFunction(converter) ? converter(value) : value
    }
    let cookieStorage = function (key, value, options = {}) {
        // Write
        if (arguments.length > 1 && !isFunction(value)) {
            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires && options.expires.toUTCString ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''))
        }
        let result = key ? undefined : {}
        let cookies = document.cookie ? document.cookie.split('; ') : []
        let i = 0
        let l = cookies.length
        for (; i < l; i++) {
            let parts = cookies[i].split('=')
            let name = decode(parts.shift())
            let cookie = parts.join('=')
            if (key === name) {
                result = read(cookie, value)
                break
            }
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie
            }
        }
        return result
    }

    // originStorage
    return (function () {
        let supportLocalStorage = true;
        let supportCookie = true;
        let originStorageInstent = {};
        try {
            let res1 = 1;
            window.localStorage.setItem('__veyhunk_chach_test__', res1)
            let res = window.localStorage.getItem('__veyhunk_chach_test__')
            if (res1 != res) {
                supportLocalStorage = false
            }
            window.localStorage.removeItem('__veyhunk_chach_test__')
        } catch (error) {
            supportLocalStorage = false
        }
        if (supportLocalStorage) {
            originStorageInstent = {
                get: function (key) {
                    let res = window.localStorage.getItem(key);
                    let resReturn
                    try {
                        let jsonRes = JSON.parse(res)
                        if (jsonRes && jsonRes.option) {
                            let expires = jsonRes.option.expires
                            if (expires) {
                                if (Date.now() > expires) {
                                    resReturn = undefined
                                    self.remove(k)
                                } else {
                                    resReturn = jsonRes.value
                                }
                            } else {
                                resReturn = jsonRes.value
                            }
                        } else {
                            if (jsonRes) {
                                resReturn = jsonRes.value
                            }
                            else {
                                resReturn = undefined
                            }
                        }
                    } catch (error) {
                        console.error(error);
                        resReturn = undefined
                    }
                    return resReturn
                },
                set: function (key, value, option) {
                    if (option && option.expires) {
                        option.expires = option.expires.valueOf();
                    }
                    return window.localStorage.setItem(key, JSON.stringify({ value, option }))
                },
                clear: function () {
                    return window.localStorage.clear()
                },
                remove: function (key) {
                    return window.localStorage.removeItem(key)
                }
            }
        } else {
            try {
                let res1 = 1;
                cookieStorage('__veyhunk_chach_test__', res1)
                let res = cookieStorage('__veyhunk_chach_test__')
                if (res1 != res) {
                    supportCookie = false
                }
                cookieStorage('__veyhunk_chach_test__', '', {
                    expires: -1
                })
            } catch (error) {
                supportCookie = false
            }
            if (supportCookie) {

                originStorageInstent = {
                    get: function (key) {
                        return cookieStorage(key)
                    },
                    set: function (key, value, option) {
                        return cookieStorage(key, value, option)
                    },
                    clear: function () {
                        let cookies = document.cookie.split(';')
                        for (let i = 0; i < cookies.length; i++) {
                            let key = cookies[i].split('=')[0]
                            cookieStorage(key, '', {
                                expires: -1
                            })
                        }
                    },
                    remove: function (key, option) {
                        return cookieStorage(key, '', {
                            expires: -1,
                            ...option
                        })
                    }
                }
            } else {
                originStorageInstent = {

                    get: function (key) {
                        if (!myTempCookie) {
                            myTempCookie = {}
                        }
                        return myTempCookie[key]
                    },
                    set: function (key, value) {
                        if (!myTempCookie) {
                            myTempCookie = {}
                        }
                        myTempCookie[key] = value;
                    },
                    clear: function () {
                        myTempCookie = {};
                    },
                    remove: function (key) {
                        delete myTempCookie[key]
                    }
                }
            }
        }
        let storageMode = supportLocalStorage ? 'LocalStorage' : supportCookie ? "cookie" : 'myTempCookie';
        return { ...originStorageInstent, storageMode }
    })()
}

const _localStorage = function () {

    this.install = function (Vue) {
        Vue.prototype.$cookie = this;
        Vue.cookie = this;
        if (window) {
            window.IntelligentCookie = this;
        }
    }

    const originStorage = _originStorage()

    this.get = function (k) {
        let res = originStorage.get(k)
        let resr = res && JSON.parse(res) || undefined;
        // console.log("IntelligentCookie.js get", { k, res, resr });
        return resr
    }

    this.set = function (k, v, option) {
        // console.log("IntelligentCookie.js set", { k, v, option });
        option = { ...defaultOption, ...option }
        if (option && option.expires) {
            let expiresItem = option.expires;

            if (typeof expiresItem !== 'object') {
                expiresItem += typeof expiresItem === 'number' ? 'D' : '';
                expiresItem = computeExpires(expiresItem);
            }
            option.expires = expiresItem;
        }
        originStorage.set(k, JSON.stringify(v), option)
    }

    this.clear = function () {
        // console.log("IntelligentCookie.js clear");
        return originStorage.clear()
    }

    this.remove = function (k) {
        // console.log("IntelligentCookie.js remove", { k });
        return originStorage.remove(k)
    }
    this.storageMode = originStorage.storageMode;
}

let IntelligentCookie = new _localStorage();
if (window && window.Vue) {
    window.IntelligentCookie = IntelligentCookie;
    Vue.use(IntelligentCookie);
}
// if (typeof exports == "object") {
//     module.exports = IntelligentCookie;
// } else if (typeof define == "function" && define.amd) {
//     define([], function () { return IntelligentCookie; })
// } else if (window && window.Vue) {
//     window.IntelligentCookie = IntelligentCookie;
//     Vue.use(IntelligentCookie);
// }

// Return a future date by the given string.
function computeExpires(str) {
    const lastCh = str.charAt(str.length - 1);
    const value = parseInt(str, 10);
    let expires = new Date();

    switch (lastCh) {
        case 'Y': expires.setFullYear(expires.getFullYear() + value); break;
        case 'M': expires.setMonth(expires.getMonth() + value); break;
        case 'D': expires.setDate(expires.getDate() + value); break;
        case 'h': expires.setHours(expires.getHours() + value); break;
        case 'm': expires.setMinutes(expires.getMinutes() + value); break;
        case 's': expires.setSeconds(expires.getSeconds() + value); break;
        default: expires = new Date(str);
    }

    return expires;
}

export default IntelligentCookie