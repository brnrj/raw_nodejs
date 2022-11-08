const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
  };
  
exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  }).then(() => {
    console.log('Created Product');
  }).catch((err) => {
    console.log(err)
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if(!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      if (!product) {
        return res.render('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!')
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  })
  .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  Product.findByPk(req.body.productId)
  .then((product) => {
    product.destroy();
    console.log('DESTROYED PRODUCT')
    return res.redirect('/admin/products')
  })
  .catch(err => console.log(err));
}