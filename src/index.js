let chromeInstance = null;

let mockBrowserData = {
  cookies: [],
  storage: {},
};
let runtimeSendMessageFunc = ()=>{

}
chromeInstance = {
  cookies: {
    get: (cookie, retunFunc) => {
      try {
        mockBrowserData.cookies.forEach((cookieItem) => {
          if (cookie.url === cookieItem.url && cookie.name === cookieItem.name) {
            retunFunc(cookieItem);
          }
        });
        retunFunc(null);
      } catch (error) {
        console.error(error);
      }
    },
    set: (cookie, returnFunc) => {
      mockBrowserData.cookies.push(cookie);
      if (mockBrowserData.cookies.length) {
        returnFunc(mockBrowserData.cookies[mockBrowserData.cookies.length - 1]);
      }
    },
  },
  storage: {
    sync: {
      get: (keys, returnFunc) => {
        const returnValue = {};
        keys.forEach((key) => {
          if (mockBrowserData.storage[key]) {
            returnValue[key] = mockBrowserData.storage[key];
          }
        });
        returnFunc(returnValue);
      },
      set: (obj, retunFunc) => {
        Object.assign(mockBrowserData.storage, obj);
        retunFunc(obj);
      },
    },
  },
  runtime: {
    sendMessage: runtimeSendMessageFunc,
  },
  tabs: {
    onUpdated: {
      addListener: () => {},
    },
  },
  extension: {
    getURL: (relativeUrl) => relativeUrl,
  },
};

/**
 * @param {Object} [initialMockData]
 */
exports.getChromeInstance = (initialMockData) => {
  if (initialMockData) {
    mockBrowserData = JSON.parse(JSON.stringify(initialMockData));
  }
  return chromeInstance;
};

/**
 * @param {Object} incomingMock
 */
exports.setMockBrowserData = (incomingMock) => {
  mockBrowserData = JSON.parse(JSON.stringify(incomingMock));
};

exports.setCookies = (aCookies) =>{
  if(!Array.isArray(aCookies)){
    console.error('setCookies expects an array')
    return;
  }
  mockBrowserData.cookies = JSON.parse(JSON.stringify(aCookies))
  return aCookies;
}

exports.setStorage = (aStorage) =>{
  mockBrowserData.storage = JSON.parse(JSON.stringify(aStorage))
}

exports.setRuntimeSendMessage = (fRuntimeSendMsg)=>{
  if( typeof fRuntimeSendMsg !== 'function' ){
    console.error('setRuntimeSendMessage expects a function')
    return;
  }
  chromeInstance.runtime.sendMessage = fRuntimeSendMsg;
  return fRuntimeSendMsg;
}