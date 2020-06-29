module.exports = function init(site) {

  const $customer_opinion = site.connectCollection("customer_opinion")


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


  site.post("/api/customer_opinion/add", (req, res) => {
    let response = {
      done: false
    }

    let customer_opinion_doc = req.body
    customer_opinion_doc.$req = req
    customer_opinion_doc.$res = res

    // customer_opinion_doc.add_user_info = site.security.getUserFinger({
    //   $req: req,
    //   $res: res
    // })

    if (typeof customer_opinion_doc.active === 'undefined') {
      customer_opinion_doc.active = true
    }

    // customer_opinion_doc.company = site.get_company(req)
    // customer_opinion_doc.branch = site.get_branch(req)

    
    $customer_opinion.add(customer_opinion_doc, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc = doc

      } else {
        response.error = err.message
      }
      res.json(response)
    })

  })


  site.post("/api/customer_opinion/delete", (req, res) => {
    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'Please Login First'
      res.json(response)
      return
    }

    let id = req.body.id

    if (id) {
      $customer_opinion.delete({
        id: id,
        $req: req,
        $res: res
      }, (err, result) => {
        if (!err) {
          response.done = true
        } else {
          response.error = err.message
        }
        res.json(response)
      })
    } else {
      response.error = 'no id'
      res.json(response)
    }
  })


  site.post("/api/customer_opinion/all", (req, res) => {
    let response = {
      done: false
    }

    let where = req.body.where || {}

    if (where['name']) {
      where['name'] = new RegExp(where['name'], "i");
    }

    // if (site.get_company(req) && site.get_company(req).id)
    //   where['company.id'] = site.get_company(req).id

    $customer_opinion.findMany({
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