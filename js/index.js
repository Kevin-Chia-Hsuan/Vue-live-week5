// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';

// 區域註冊: 載入分頁頁碼元件
import userProductModal from './userProductModal.js';
// 區域註冊: 載入 分頁頁碼 元件
import pagination from './pagination.js';

// 加入站點
const apiUrl = 'https:///vue3-course-api.hexschool.io';
// 加入個人 API Path
const apiPath = 'kevinapog47138';
// scrollTop 需要的 DOM
const tBody = document.querySelector('html,body');

// 全部加入(CDN 版本)
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 載入多國語系
VeeValidateI18n.loadLocaleFromURL('./js/zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

const app = Vue.createApp({
  data() {
    return {
      // 一律使用 function return

      // 讀取效果
      loadingStatus: {
        loadingItem: '',
      },
      // 產品列表
      products: [],
      // props 傳遞到內層的暫存資料
      product: {},
      // 表單結構
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      // 購物車列表
      cart: {},
      // 分頁頁碼元件
      pagination: {},
    };
  },
  // 區域註冊
  // 註冊分頁頁碼元件
  components: {
    userProductModal,
    pagination,
  },
  mounted() {
    // 取得資料、DOM元素
    this.getProducts();
  },
  methods: {
    // 取得產品列表方法
    getProducts(page = 1) {
      const url = `${apiUrl}/api/${apiPath}/products?page=${page}`;
      axios
        .get(url)
        .then((response) => {
          if (response.data.success) {
            // console.log(response.data.products);
            this.products = response.data.products;
            this.pagination = response.data.pagination;
            // console.log(response.data);
            // console.log(tBody);
            tBody.scrollTop = 0;
          } else {
            alert(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 取得單一產品方法
    getProduct(id) {
      const url = `${apiUrl}/api/${apiPath}/product/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.get(url).then((response) => {
        if (response.data.success) {
          this.loadingStatus.loadingItem = '';
          this.product = response.data.product;
          this.$refs.userProductModal.openModal();
        } else {
          alert(response.data.message);
        }
      });
    },
    // 加入購物車方法
    addToCart(id, qty = 1) {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      this.loadingStatus.loadingItem = id;
      const cart = {
        product_id: id,
        qty,
      };
      if (cart.qty < 1) {
        swal('出錯了!', '數量必須大於0', 'error');
        this.loadingStatus.loadingItem = '';
      } else {
        axios
          .post(url, { data: cart })
          .then((response) => {
            if (response.data.success) {
              // alert(response.data.message);
              swal('成功!', '加入購物車成功', 'success');
              // 成功加入購物車後，清空id，否則按鈕還會是disabled狀態
              this.loadingStatus.loadingItem = '';
              this.getCart();
            } else {
              alert(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      this.$refs.userProductModal.hideModal();
    },
    // 取得購物車列表方法
    getCart() {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios
        .get(url)
        .then((response) => {
          if (response.data.success) {
            this.cart = response.data.data;
          } else {
            alert(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 更新購物方法
    updateCart(data) {
      this.loadingStatus.loadingItem = data.id;
      const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`;
      const cart = {
        product_id: data.product_id,
        qty: data.qty,
      };
      if (cart.qty < 1) {
        swal('出錯了!', '數量必須大於0', 'error');
        this.loadingStatus.loadingItem = '';
        this.getCart();
      } else {
        axios
          .put(url, { data: cart })
          .then((response) => {
            if (response.data.success) {
              // alert(response.data.message);
              swal('成功!', '更新購物車成功', 'success');
              // 成功加入購物車後，清空id，否則按鈕還會是disabled狀態
              this.loadingStatus.loadingItem = '';
              this.getCart();
            } else {
              alert(response.data.message);
              this.loadingStatus.loadingItem = '';
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    // 清空購物車方法
    deleteAllCarts() {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios
        .delete(url)
        .then((response) => {
          if (response.data.success) {
            // alert(response.data.message);
            swal('成功!', '刪除全部購物車成功', 'success');
            this.getCart();
          } else {
            alert(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 刪除單一購物車產品方法
    removeCartItem(id) {
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      axios
        .delete(url)
        .then((response) => {
          if (response.data.success) {
            // alert(response.data.message);
            swal('成功!', '刪除單筆購物車成功', 'success');
            // 成功刪除後，清空id，否則按鈕還會是disabled狀態
            this.loadingStatus.loadingItem = '';
            this.getCart();
          } else {
            alert(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 建立訂單方法
    createOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios
        .post(url, { data: order })
        .then((response) => {
          if (response.data.success) {
            // alert(response.data.message);
            swal('成功!', '訂單送出成功', 'success');
            this.$refs.form.resetForm();
            this.getCart();
          } else {
            alert(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    // 元件生成，必定會執行的項目
    this.getProducts();
    this.getCart();
  },
});

// 全域註冊;
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');
