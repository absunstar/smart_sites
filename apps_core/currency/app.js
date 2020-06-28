module.exports = function init(site) {
  const $currency = site.connectCollection("currency")

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/'
  })

  site.get({
    name: "currency",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.on('[company][created]', doc => {

    $currency.add({
      name: "عملة إفتراضية",
      image_url: '/images/currency.png',
      ex_rate: 1,
      company: {
        id: doc.id,
        name_ar: doc.name_ar
      },
      branch: {
        code: doc.branch_list[0].code,
        name_ar: doc.branch_list[0].name_ar
      },
      active: true
    }, (err, doc) => { })
  })


  site.post("/api/currency/add", (req, res) => {
    let response = {
      done: false
    }
    if (!req.session.user) {
      response.error = 'Please Login First'
      res.json(response)
      return
    }

    let currency_doc = req.body
    currency_doc.$req = req
    currency_doc.$res = res

    currency_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    if (typeof currency_doc.active === 'undefined') {
      currency_doc.active = true
    }

    // currency_doc.company = site.get_company(req)
    // currency_doc.branch = site.get_branch(req)

    // $currency.findMany({
    //   where: {
    //     'company.id': site.get_company(req).id,
    //   }
    // }, (err, docs, count) => {
    //   if (!err && count >= site.get_company(req).currency) {

    //     response.error = 'You have exceeded the maximum number of extensions'
    //     res.json(response)
    //   } else {
    $currency.add(currency_doc, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc = doc
      } else {
        response.error = err.message
      }
      res.json(response)
    })
    //   }
    // })
  })

  site.post("/api/currency/update", (req, res) => {
    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'Please Login First'
      res.json(response)
      return
    }

    let currency_doc = req.body

    currency_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    if (currency_doc.id) {
      $currency.edit({
        where: {
          id: currency_doc.id
        },
        set: currency_doc,
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

  site.post("/api/currency/view", (req, res) => {
    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'Please Login First'
      res.json(response)
      return
    }

    $currency.findOne({
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

  site.post("/api/currency/delete", (req, res) => {
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
      $currency.delete({
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


  site.post("/api/currency/all", (req, res) => {
    let response = {
      done: false
    }

    let where = req.body.where || {}

    if (where['name']) {
      where['name'] = new RegExp(where['name'], "i");
    }
    // where['company.id'] = site.get_company(req).id

    $currency.findMany({
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