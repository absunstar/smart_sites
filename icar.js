const site = require('isite')({
    port: [80 , 40006],
    lang: 'ar',
    version : '1.0.0',
    name: 'icar',
    theme: 'theme_paper',
    https: {
        enabled: true,
        port: 5050
    },
    mongodb: {
        db: 'smart_code_icar',
        limit: 100000
    },
    security: {
        admin: {
            email: 'icar',
            password: 'P@$$w0rd'
        }
    }
})

site.get({
    name: '/',
    path: site.dir + '/'
})

site.get({
    name: '/',
    path: site.dir + '/app_cars/0/site_files/html/index.html',
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

site.ready = false
site.loadLocalApp('client-side')
site.loadLocalApp('security')
// site.importApp(__dirname + '/apps_private/cloud_security', 'security')
site.importApp(__dirname + '/apps_private/ui-print')
site.importApp(__dirname + '/apps_private/ui-help')

site.importApps(__dirname + '/apps_icar')
site.addFeature('icar')
setTimeout(() => {
    site.importApps(__dirname + '/apps_core')

    site.importApp(__dirname + '/apps_private/companies')
    site.importApp(__dirname + '/apps_private/zk-reader')

}, 1000)
setTimeout(() => {
    site.ready = true
}, 1000 * 2);


if(process.platform == "win32"){
    site.exe(process.cwd() + '/applications/PrinterManager.exe')
}

site.run()


// site.on('zk attend', attend=>{
//     console.log(attend)
// })

