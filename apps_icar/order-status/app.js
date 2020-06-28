module.exports = function init(site) {

  const $order_status = site.connectCollection("order_status")


  site.get({
    name: "order_status",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/'
  })


  function addZero(code, number) {
    let c = number - code.toString().length
    for (let i = 0; i < c; i++) {
      code = '0' + code.toString()
    }
    return code
  };

  $order_status.newCode = function () {

    let y = new Date().getFullYear().toString().substr(2, 2)
    let m = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'][new Date().getMonth()].toString()
    let d = new Date().getDate()
    let lastCode = site.storage('order_last_code') || 0
    let lastMonth = site.storage('order_last_month') || m
    if (lastMonth != m) {
      lastMonth = m
      lastCode = 0
    }
    lastCode++
    site.storage('order_last_code', lastCode)
    site.storage('order_last_month', lastMonth)
    return y + lastMonth + addZero(d, 2) + addZero(lastCode, 4)
  };


  site.post("/api/order_status/add", (req, res) => {
    let response = {
      done: false
    }
    // if (!req.session.user) {
    //   response.error = 'Please Login First'
    //   res.json(response)
    //   return
    // }

    let order_status_doc = req.body
    order_status_doc.$req = req
    order_status_doc.$res = res

    // order_status_doc.add_user_info = site.security.getUserFinger({
    //   $req: req,
    //   $res: res
    // })

    if (typeof order_status_doc.active === 'undefined') {
      order_status_doc.active = true
    }

    order_status_doc.code = $order_status.newCode()
    // order_status_doc.company = site.get_company(req)
    // order_status_doc.branch = site.get_branch(req)

    $order_status.add(order_status_doc, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc = doc
      } else {
        response.error = err.message
      }
      res.json(response)
    })

  })



  site.post("/api/order_status/all", (req, res) => {
    let response = {
      done: false
    }

    let where = req.body.where || {}

    if (where['code']) {
      where['code'] = where['code'];
    }
 
    // if (site.get_company(req) && site.get_company(req).id)
    //   where['company.id'] = site.get_company(req).id

    $order_status.findMany({
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