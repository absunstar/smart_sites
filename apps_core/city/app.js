module.exports = function init(site) {
  const $city = site.connectCollection("city")

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/'
  })

  site.get({
    name: "city",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })


  site.on('[register][city][add]', doc => {

    $city.add({
      gov: {
        id: doc.id,
        name: doc.name
      },
      name: "مدينة إفتراضي",
      image_url: '/images/city.png',
      company: {
        id: doc.company.id,
        name_ar: doc.company.name_ar
      },
      branch: {
        code: doc.branch.code,
        name_ar: doc.branch.name_ar
      },
      active: true
    }, (err, doc) => {
      site.call('[register][area][add]', doc)

    })
  })



  site.post("/api/city/add", (req, res) => {
    let response = {
      done: false
    }
    if (!req.session.user) {
      response.error = 'Please Login First'
      res.json(response)
      return
    }

    let city_doc = req.body
    city_doc.$req = req
    city_doc.$res = res

    city_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    if (typeof city_doc.active === 'undefined') {
      city_doc.active = true
    }

    // city_doc.company = site.get_company(req)
    // city_doc.branch = site.get_branch(req)

    $city.add(city_doc, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc = doc
      } else {
        response.error = err.message
      }
      res.json(response)
    })

  })

  site.post("/api/city/update", (req, res) => {
    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'Please Login First'
      res.json(response)
      return
    }

    let city_doc = req.body

    city_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })
    if (city_doc.id) {

      $city.edit({
        where: {
          id: city_doc.id
        },
        set: city_doc,
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

  site.post("/api/city/view", (req, res) => {
    let response = {
      done: false
    }
   
    if (!req.session.user) {
      response.error = 'Please Login First'
      res.json(response)
      return
    }

    $city.findOne({
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

  site.post("/api/city/delete", (req, res) => {
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
      $city.delete({
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

  site.post("/api/city/all", (req, res) => {

    let response = {
      done: false
    }

    let where = req.body.where || {}

    if (where['gov']) {
      where['gov.id'] = where['gov'].id;
      delete where['gov']
      delete where.active
    }

    if (where['name']) {
      where['name'] = new RegExp(where['name'], "i");
    }
    
    // if (site.get_company(req) && site.get_company(req).id)
    // where['company.id'] = site.get_company(req).id
    //  where['branch.code'] = site.get_branch(req).code
 

    $city.findMany({
      select: req.body.select || {},
      where: where,
      sort: req.body.sort || { id: -1 },
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