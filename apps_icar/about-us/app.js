module.exports = function init(site){

    site.get({
        name: "about_us",
        path: __dirname + "/site_files/html/index.html",
        parser: "html",
        compress: true
      })

    site.get({name:'images' , path: __dirname + '/site_files/images/'})
}