<<<<<<< HEAD
const site = require('isite')({
    port: [80 , 33001],
    lang: 'ar',
    version : '1.0.12',
    name: 'icar',
    theme: 'theme_paper',
    mongodb: {
        db: 'smart_code_icar',
        limit: 100000
    },
    security: {
        keys: ['e698f2679be5ba5c9c0b0031cb5b057c' , '9705a3a85c1b21118532fefcee840f99'],
      }
})

site.get({
    name: '/',
    path: site.dir + '/'
})

site.get({
    name: '/',
    path: __dirname +'/apps_icar/0/site_files/html/index.html',
    parser: 'html css js'
})

site.words.add({
    "name": "le",
    "en": "Ryal",
    "ar": "ريال"
}, {
    "name": "pound",
    "en": "Ryal",
    "ar": "ريال"
})

site.loadLocalApp('client-side')
site.importApps(__dirname + '/apps_icar')
site.importApp(__dirname + '/apps_private/security')
site.importApp(__dirname + '/apps_private/ui-print')
site.importApp(__dirname + '/apps_private/ui-help')

site.importApps(__dirname + '/apps_core')
site.addFeature('icar')



site.run()


// site.on('zk attend', attend=>{
//     console.log(attend)
// })

=======
const site = require('../isite')({
    port: [80 , 33001],
    lang: 'ar',
    version : '1.0.13',
    name: 'icar',
    theme: 'theme_paper',
    _0x14xo: !0,
    mongodb: {
        db: 'smart_code_icar',
        limit: 100000
    },
    security: {
        keys : ['f6fdffe48c908deb0f4c3bd36c032e72']
    }, require: {
        features: [],
        permissions: [],
      },
      default: {
        features: [],
        permissions: [],
      }
})

site.get({
    name: '/',
    path: site.dir + '/'
})

site.get({
    name: '/',
    path: __dirname +'/apps_icar/0/site_files/html/index.html',
    parser: 'html css js'
})

site.words.add({
    "name": "le",
    "en": "Ryal",
    "ar": "ريال"
}, {
    "name": "pound",
    "en": "Ryal",
    "ar": "ريال"
})

site.loadLocalApp('client-side')
site.importApps(__dirname + '/apps_icar')
site.importApp(__dirname + '/apps_private/security')
site.importApp(__dirname + '/apps_private/ui-print')
site.importApp(__dirname + '/apps_private/ui-help')

site.importApps(__dirname + '/apps_core')
site.addFeature('icar')



site.run()


// site.on('zk attend', attend=>{
//     console.log(attend)
// })

console.log(site.md5('adminadmin'))
>>>>>>> e13a9aaf4299b13402a885a4c047c2b80c4e6398
