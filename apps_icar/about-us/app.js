module.exports = function init(site){

    site.get({
        name: "about_us",
        path: __dirname + "/site_files/html/index.html",
        parser: "html",
        compress: true
      })

}