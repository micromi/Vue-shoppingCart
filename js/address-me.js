/**
 * Created by Sunlight833 on 17/02/09.
 */
var vm = new Vue({
	el: ".container",
	data: {
		limitNum: 3,
		addressIndex: 0,
		defaultAddressId: '',
		shoppingMethod: 1,
		showModal: false,
		delAddress: '',
    addressList: [],
	},
	mounted: function() {
    this.$nextTick(function() {
    	this.queryAddress();
    })
	},
	computed: {
    filterAddress: function() {
    	return this.addressList.slice(0, this.limitNum);
    }
	},
	methods: {
    queryAddress: function() {
    	this.$http.get("data/address.json").then(
    		response => {
	    		var res = response.body;
	    		if (res && res.status == "0") {
	          this.addressList = res.result;
	    		}
    	}, error => {
    		console.log(error);
    	});
    },
    // 设置默认地址
    setDefaultAddress: function(addrId, index) {
    	// 一: id方式
    	var _this = this;
      this.addressList.forEach(function (item) {
      	if (item.addressId == addrId) {
      		item.isDefault = true;
      		_this.defaultAddressId = addrId;
      	} else {
      		item.isDefault = false;
      	}
      });
      // 二: 索引方式
      /*for (var i = 0; i < this.addressList.length; i++) {
      	if (index != i) {
      		this.addressList[i].isDefault = false;
      	} else {
      		this.addressList[i].isDefault = true;
      		this.defaultAddressId = this.addressList[i].addressId;
      	}
      }*/
      console.log(this.defaultAddressId);
    },
    delConfirm: function(address) {
    	this.showModal = true;
    	this.delAddress = address;
    },
    delUserAddress: function() {
    	this.showModal = false;
    	var index = this.addressList.indexOf(this.delAddress);
    	// if (this.addressList[index].isDefault == true) {
    	if (this.delAddress.isDefault == true) {
    		alert('默认地址不能删除！');
    	} else {
    		this.addressList.splice(index, 1);
    	}
    },
    // 保存配送信息
    saveDistributionAddress: function() {
      this.$http.post("/distribution",{addressId: this.defaultAddressId, distributionWay: this.shoppingMethod}).then(
      	res => {
          alert("地址确认成功");
      }, err => {
          alert("保存地址失败");
      })
    }
	},
})