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

    order_status_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

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


  site.post("/api/order_status/update", (req, res) => {
    let response = {
      done: false
    }

    // if (!req.session.user) {
    //   response.error = 'Please Login First'
    //   res.json(response)
    //   return
    // }

    let order_status_doc = req.body

    order_status_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    if (order_status_doc.id) {
      $order_status.edit({
        where: {
          id: order_status_doc.id
        },
        set: order_status_doc,
        $req: req,
        $res: res
      }, err => {
        if (!err) {
          response.done = true
        } else {
          response.error = 'Code Already Exist'
        }
        res.json(response)
      })
    } else {
      response.error = 'no id'
      res.json(response)
    }
  })

  site.post("/api/order_status/view", (req, res) => {
    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'Please Login First'
      res.json(response)
      return
    }

    $order_status.findOne({
      where: {
        id: req.body.id
      }
    }, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc = doc
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/order_status/delete", (req, res) => {
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
      $order_status.delete({
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



  site.post("/api/order_status/all", (req, res) => {
    let response = {
      done: false
    }

    let where = req.body.where || {}


    if (where.under_delivery || where.under_pricing || where.delivered || where.cancelled_order || where.accepted) {

      where['$or'] = [{ 'status.id': where.under_delivery }, { 'status.id': where.under_pricing }, { 'status.id': where.delivered }, { 'status.id': where.cancelled_order }, { 'status.id': where.accepted }]
      delete where.under_delivery
      delete where.under_pricing
      delete where.delivered
      delete where.accepted
      delete where.cancelled_order
    }



    if (where['code']) {
      where['code'] = where['code'];
    }

    if (where.date) {
      let d1 = site.toDate(where.date)
      let d2 = site.toDate(where.date)
      d2.setDate(d2.getDate() + 1)
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
    } else if (where && where.date_from) {
      let d1 = site.toDate(where.date_from)
      let d2 = site.toDate(where.date_to)
      d2.setDate(d2.getDate() + 1);
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
      delete where.date_from
      delete where.date_to
    }

    if (where.place == 'work') {

      where['place'] = 'work'
    } else if (where.place == 'personal') {

      where['place'] = 'personal'
    }

    if (where.phone) {

      where['phone'] = where.phone;
    }
    if (where.mobile) {

      where['mobile'] = where.mobile;
    }

    if (where.customer_name) {

      where['customer_name'] = where.customer_name;
    }

    if (where['code']) {
      where['code'] = where['code'];
    }

    if (where['customerId']) {
      where['add_user_info.id'] = where['customerId'];
      delete where['customerId']
    }


    if (where['car_type']) {
      where['car_type.id'] = where['car_type'].id;
      delete where['car_type']
    }

    if (where['car_name']) {
      where['car_name.id'] = where['car_name'].id;
      delete where['car_name']
    }



    if (where['gov']) {
      where['gov.id'] = where['gov'].id;
      delete where['gov']
    }

    if (where['city']) {
      where['city.id'] = where['city'].id;
      delete where['city']
    }

    if (where['area']) {
      where['area.id'] = where['area'].id;
      delete where['area']
    }


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