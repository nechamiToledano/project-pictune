
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "preload": [
      "chunk-N4ERANYV.js",
      "chunk-235S34ID.js",
      "chunk-RU42S6HG.js",
      "chunk-IWGA4FRR.js",
      "chunk-JTFT4WKO.js",
      "chunk-2XJNOYJH.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-GFJVYGVX.js",
      "chunk-RU42S6HG.js",
      "chunk-CJGG3F3I.js",
      "chunk-JTFT4WKO.js",
      "chunk-SLGXTDFG.js",
      "chunk-ZX2763UK.js",
      "chunk-OUGBS6IF.js",
      "chunk-2XJNOYJH.js"
    ],
    "route": "/login"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-N4ERANYV.js",
      "chunk-235S34ID.js",
      "chunk-RU42S6HG.js",
      "chunk-IWGA4FRR.js",
      "chunk-JTFT4WKO.js",
      "chunk-2XJNOYJH.js"
    ],
    "route": "/users"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-N4ERANYV.js",
      "chunk-235S34ID.js",
      "chunk-RU42S6HG.js",
      "chunk-IWGA4FRR.js",
      "chunk-JTFT4WKO.js",
      "chunk-2XJNOYJH.js"
    ],
    "route": "/users/new"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-N4ERANYV.js",
      "chunk-235S34ID.js",
      "chunk-RU42S6HG.js",
      "chunk-IWGA4FRR.js",
      "chunk-JTFT4WKO.js",
      "chunk-2XJNOYJH.js"
    ],
    "route": "/users/edit/*"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-N4ERANYV.js",
      "chunk-235S34ID.js",
      "chunk-RU42S6HG.js",
      "chunk-IWGA4FRR.js",
      "chunk-JTFT4WKO.js",
      "chunk-2XJNOYJH.js"
    ],
    "route": "/music-files"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-N4ERANYV.js",
      "chunk-235S34ID.js",
      "chunk-RU42S6HG.js",
      "chunk-IWGA4FRR.js",
      "chunk-JTFT4WKO.js",
      "chunk-2XJNOYJH.js"
    ],
    "route": "/music-files/edit/*"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-N4ERANYV.js",
      "chunk-235S34ID.js",
      "chunk-RU42S6HG.js",
      "chunk-IWGA4FRR.js",
      "chunk-JTFT4WKO.js",
      "chunk-2XJNOYJH.js"
    ],
    "route": "/playlists"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-N4ERANYV.js",
      "chunk-235S34ID.js",
      "chunk-RU42S6HG.js",
      "chunk-IWGA4FRR.js",
      "chunk-JTFT4WKO.js",
      "chunk-2XJNOYJH.js"
    ],
    "route": "/playlists/new"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-N4ERANYV.js",
      "chunk-235S34ID.js",
      "chunk-RU42S6HG.js",
      "chunk-IWGA4FRR.js",
      "chunk-JTFT4WKO.js",
      "chunk-2XJNOYJH.js"
    ],
    "route": "/playlists/edit/*"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-N4ERANYV.js",
      "chunk-235S34ID.js",
      "chunk-RU42S6HG.js",
      "chunk-IWGA4FRR.js",
      "chunk-JTFT4WKO.js",
      "chunk-2XJNOYJH.js"
    ],
    "route": "/analytics"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-N4ERANYV.js",
      "chunk-235S34ID.js",
      "chunk-RU42S6HG.js",
      "chunk-IWGA4FRR.js",
      "chunk-JTFT4WKO.js",
      "chunk-2XJNOYJH.js"
    ],
    "route": "/report"
  },
  {
    "renderMode": 0,
    "redirectTo": "/",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 49499, hash: '26ffaf16d2520c3ae758c21925da0b3751c8a32b976adf9554ee62aafa4dd7c1', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 2086, hash: 'cd2afb1336ce114963b53c0a326b06dfa805338baa2aabd8065c639e68aba9d0', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-MEBWCGBD.css': {size: 95625, hash: 'BFTcRxhGnsQ', text: () => import('./assets-chunks/styles-MEBWCGBD_css.mjs').then(m => m.default)}
  },
};
