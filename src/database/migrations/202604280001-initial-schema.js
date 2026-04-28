'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const T = Sequelize;
    await queryInterface.createTable('users',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},name:T.STRING,email:{type:T.STRING,unique:true},password_hash:T.STRING,role:T.STRING,is_active:{type:T.BOOLEAN,defaultValue:true},created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('customers',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},full_name:T.STRING,email:{type:T.STRING,unique:true},cpf_cnpj:T.STRING,phone:T.STRING,password_hash:T.STRING,is_blocked:{type:T.BOOLEAN,defaultValue:false},created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('addresses',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},customer_id:T.INTEGER,zipcode:T.STRING,street:T.STRING,number:T.STRING,complement:T.STRING,neighborhood:T.STRING,city:T.STRING,state:T.STRING,created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('categories',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},name:T.STRING,slug:{type:T.STRING,unique:true},seo_text:T.TEXT,meta_title:T.STRING,meta_description:T.STRING,is_active:{type:T.BOOLEAN,defaultValue:true},created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('products',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},category_id:T.INTEGER,name:T.STRING,slug:{type:T.STRING,unique:true},description_short:T.TEXT,description_long:T.TEXT,price:T.DECIMAL(10,2),promo_price:T.DECIMAL(10,2),cost:T.DECIMAL(10,2),is_featured:{type:T.BOOLEAN,defaultValue:false},is_new:{type:T.BOOLEAN,defaultValue:true},is_best_seller:{type:T.BOOLEAN,defaultValue:false},is_active:{type:T.BOOLEAN,defaultValue:true},meta_title:T.STRING,meta_description:T.STRING,keywords:T.STRING,weight:T.FLOAT,height:T.FLOAT,width:T.FLOAT,length:T.FLOAT,created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('product_images',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},product_id:T.INTEGER,image_url:T.STRING,alt_text:T.STRING,is_main:{type:T.BOOLEAN,defaultValue:false},created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('sizes',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},name:T.STRING,is_active:{type:T.BOOLEAN,defaultValue:true},created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('colors',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},name:T.STRING,hex_code:T.STRING,is_active:{type:T.BOOLEAN,defaultValue:true},created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('product_variations',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},product_id:T.INTEGER,size_id:T.INTEGER,color_id:T.INTEGER,sku:{type:T.STRING,unique:true},price:T.DECIMAL(10,2),stock:{type:T.INTEGER,defaultValue:0},created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('carts',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},customer_id:T.INTEGER,session_id:T.STRING,created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('cart_items',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},cart_id:T.INTEGER,variation_id:T.INTEGER,quantity:{type:T.INTEGER,defaultValue:1},unit_price:T.DECIMAL(10,2),created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('coupons',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},code:{type:T.STRING,unique:true},type:T.STRING,value:T.DECIMAL(10,2),starts_at:T.DATE,expires_at:T.DATE,max_uses:T.INTEGER,uses:{type:T.INTEGER,defaultValue:0},min_order_value:T.DECIMAL(10,2),is_active:{type:T.BOOLEAN,defaultValue:true},created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('orders',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},customer_id:T.INTEGER,coupon_id:T.INTEGER,number:{type:T.STRING,unique:true},status:T.STRING,subtotal:T.DECIMAL(10,2),discount:T.DECIMAL(10,2),shipping_cost:T.DECIMAL(10,2),total:T.DECIMAL(10,2),created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('order_items',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},order_id:T.INTEGER,variation_id:T.INTEGER,product_name:T.STRING,quantity:T.INTEGER,unit_price:T.DECIMAL(10,2),total_price:T.DECIMAL(10,2),created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('payments',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},order_id:T.INTEGER,provider:T.STRING,method:T.STRING,provider_payment_id:T.STRING,status:T.STRING,amount:T.DECIMAL(10,2),created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('shipments',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},order_id:T.INTEGER,provider:T.STRING,service_name:T.STRING,tracking_code:T.STRING,status:T.STRING,cost:T.DECIMAL(10,2),estimated_days:T.INTEGER,provider_shipment_id:T.STRING,created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('banners',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},title:T.STRING,subtitle:T.STRING,image_url:T.STRING,link:T.STRING,position:T.STRING,sort_order:T.INTEGER,is_active:{type:T.BOOLEAN,defaultValue:true},created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('settings',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},key:{type:T.STRING,unique:true},value:T.TEXT,created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('reviews',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},customer_id:T.INTEGER,product_id:T.INTEGER,rating:T.INTEGER,comment:T.TEXT,is_approved:{type:T.BOOLEAN,defaultValue:false},created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('wishlists',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},customer_id:T.INTEGER,product_id:T.INTEGER,created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('newsletters',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},email:{type:T.STRING,unique:true},is_active:{type:T.BOOLEAN,defaultValue:true},created_at:T.DATE,updated_at:T.DATE});
    await queryInterface.createTable('admin_logs',{id:{type:T.INTEGER,autoIncrement:true,primaryKey:true},user_id:T.INTEGER,action:T.STRING,payload:T.JSON,created_at:T.DATE,updated_at:T.DATE});
  },

  async down(queryInterface) {
    for (const table of ['admin_logs','newsletters','wishlists','reviews','settings','banners','shipments','payments','order_items','orders','coupons','cart_items','carts','product_variations','colors','sizes','product_images','products','categories','addresses','customers','users']) {
      await queryInterface.dropTable(table);
    }
  }
};
