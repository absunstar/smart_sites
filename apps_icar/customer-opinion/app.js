module.exports = function init(site) {

  const $customer_openion = site.connectCollection("customer_openion")


  site.get({
    name: "customer_opinion",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/'
  })


  site.post("/api/customer_openion/add", (req, res) => {
    let response = {
      done: false
    }
    if (!req.session.user) {
      response.error = 'Please Login First'
      res.json(response)
      return
    }

    let goves_doc = req.body
    goves_doc.$req = req
    goves_doc.$res = res

    // goves_doc.add_user_info = site.security.getUserFinger({
    //   $req: req,
    //   $res: res
    // })

    if (typeof goves_doc.active === 'undefined') {
      goves_doc.active = true
    }

    // goves_doc.company = site.get_company(req)
    // goves_doc.branch = site.get_branch(req)


    $customer_openion.add(goves_doc, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc = doc
      } else {
        response.error = err.message
      }
      res.json(response)
    })

  })


  site.post("/api/customer_openion/all", (req, res) => {
    let response = {
      done: false
    }

    let where = req.body.where || {}

    if (where['name']) {
      where['name'] = new RegExp(where['name'], "i");
    }

    // if (site.get_company(req) && site.get_company(req).id)
    //   where['company.id'] = site.get_company(req).id

    $customer_openion.findMany({
      select: req.body.select || {},
      where: where,
      sort: req.body.sort || {
        id: -1
      },
      limit: req.body.limit
    }, (err, docs, count) => {
      if (!err) {
        response.done = true
        response.list = docs
        response.count = count
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

}