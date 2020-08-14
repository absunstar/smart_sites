const site = require('isite')({
    port: [80 , 33001],
    lang: 'ar',
    version : '1.0.10',
    name: 'icar',
    theme: 'theme_paper',
    mongodb: {
        db: 'smart_code_icar',
        limit: 100000
    },
    security: {
        admin: {
            email: 'icar',
            password: 'icar'
        }
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

