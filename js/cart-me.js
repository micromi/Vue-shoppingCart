/**
 * Created by Sunlight833 on 17/02/09.
 */
var vm = new Vue({
  el: "#app",
  data: {
    productList: [],
    checkAll: false,
    totalMoney: 0,
    showModal: false,
    currentProduct: "",
    clearingProductList: [],
  },
  mounted: function() {
    this.$nextTick(function() {
      this.cartView();
    })
  },
  filters: {
    formatMoney: function(value, quentity) {
      if (!quentity) {quentity = 1;};
      return "￥ " + (value*quentity).toFixed(2) + "元";
    }
  },
  methods: {
    cartView: function() {
      this.$http.get("data/cartData.json").then(
        response => {
          var res = response.body;
          if (res && res.status == "1") {
            this.productList = res.result.list;
            // this.calcTotalMoney();
          }
      },error => {
        console.log(error);
      });
    },
    // 全选
    selectAll: function(isCheck) {
      this.checkAll = isCheck;
      if (this.productList.length == 0) { 
        this.checkAll = false;
        return false;
      } else {
        var _this  = this;
        this.productList.forEach(function(item) {
          if (typeof item.checked == "undefined") {
            _this.$set(item, "checked", isCheck);
          } else {
            item.checked = isCheck;
          }
        });
        this.calcTotalMoney();
        this.clearingAllProduct(isCheck);
      } 
    },
    // 全选记录保存需要结算的商品信息
    clearingAllProduct: function(checkFlag) {
      this.clearingProductList = [];
      if (checkFlag) {
        var _this = this;
        this.productList.forEach(function(ix,idx,arr) {
          var clearingItem = {};
          clearingItem.id = ix.productId;
          clearingItem.quentity = ix.productQuentity;
          clearingItem.name = ix.productName;
          _this.clearingProductList.push(clearingItem);
        });
      }
      /*else {
        this.clearingProductList = [];
      }*/
      console.log(this.clearingProductList);
    },
    // 单选 (选择产品)
    selectProduct: function(product) {
      if (typeof product.checked == "undefined") {
        // Vue.set(product, "checked", true);
        this.$set(product, "checked", true);
      } else {
        product.checked = !product.checked;
      }

      this.clearingSingleProduct(product);
      this.calcTotalMoney();
      this.isCheckAll();
    },
    // 单选记录保存需要结算的商品信息
    clearingSingleProduct: function(product) {
      if (product.checked) {
        var clearingItem = {};
        clearingItem.id = product.productId;
        clearingItem.quentity = product.productQuentity;
        clearingItem.name = product.productName;
        this.clearingProductList.push(clearingItem);
      } else {
        /*this.clearingProductList.forEach(function(ix,idx,arr) {
          if (product.productId == ix.id) {
            arr.splice(idx,1);
          }
        });*/
        this.delClearingProduct(product);
      }
      console.log(this.clearingProductList);
    },
    // 单选判断是否全选
    isCheckAll: function() {
      var flag = true;
      this.productList.forEach(function(item) {
        if (!item.checked) {
          flag = false;
        }
      });
      if (flag) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    // 数量加减
    changeMoney: function(product, way) {
      if (way > 0) {
        product.productQuentity++;
      } else {
        product.productQuentity--;
        if (product.productQuentity < 1) {
          product.productQuentity = 1;
        }
      }
      this.calcTotalMoney();
      this.modifyClearingProduct(product);
    },
    // 修改记录保存需要结算的商品数量信息
    modifyClearingProduct: function(product) {
      this.clearingProductList.forEach(function(ix,idx,arr) {
        if (product.productId == ix.id) {
          arr[idx].quentity = product.productQuentity;
        }
      });
      console.log(this.clearingProductList);
    },
    // 计算总价格
    calcTotalMoney: function() {
      var totalMoney = 0;
      this.productList.forEach(function(item) {
        if (item.checked) {
          totalMoney += item.productPrice * item.productQuentity;
        }
      });
      this.totalMoney = totalMoney;
    },
    delConfim: function(product) {
      this.showModal = true;
      this.currentProduct = product;
    },
    // 删除商品
    delCurrentProduct: function() {
      this.showModal = false;
      var index = this.productList.indexOf(this.currentProduct);
      this.productList.splice(index, 1);
      this.calcTotalMoney();

      if (this.currentProduct.checked) {
        this.delClearingProduct(this.currentProduct);
      }
    },
    // 删除修改记录保存需要结算的商品信息
    delClearingProduct: function(product) {
      this.clearingProductList.forEach(function(ix,idx,arr) {
        if (product.productId == ix.id) {
          arr.splice(idx,1);
        }
      });
      console.log(this.clearingProductList);
    },
    // 结账
    saveClearingProduct: function() {
      console.log('保存结算商品');
      console.log(this.clearingProductList);
      if (this.clearingProductList.length == 0) {
        alert("请勾选商品后结算!");
        return false;
      } else {
        alert("可以区结算商品了");
        this.$http.post("/clearing",{productList: this.clearingProductList}).then(
           res => {
          console.log(res);
          window.location.href = "address.html";
        }, err => {
          console.log(err);
          window.location.href = "address.html";
        })
      }
    }
  }
});

// 全局过滤器
Vue.filter('money',function(value, unit) {
  return value.toFixed(2) + unit;
})