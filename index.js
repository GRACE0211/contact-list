const app = Vue.createApp({
  data(){
    return {
      loading: false,
      title: "Contact List",
      contacts:[],
      editIndex: null,
      input:{
        name: "",
        tel: "",
      },
    }
  },
  methods:{
    submitHandler() {
      let { name, tel } = this.input;
      if( !name || !tel ) {
        alert('輸入框不得為空！');
        return;
      };
      this.loading = true;
      if(this.editIndex === null){
        axios.post("http://localhost:8888/contact",this.input)
        .then((res)=>{
          this.contacts.push(res.data);
          this.cancelHandler();
          this.loading = false;
        })
        .catch((err)=>{
          console.log(err);
        })
      }
      else {
        let id = this.contacts[this.editIndex].id
        axios.put("http://localhost:8888/contact/" + id,this.input)
        .then((res)=>{
          this.contacts[this.editIndex] = res.data;
          this.cancelHandler();
          this.loading = false;
        })
        .catch((err)=>{
          console.log(err);
        })
      }
    },
    cancelHandler() {
      this.editIndex = null;
      this.input.name = "";
      this.input.tel = "";
      // this.input = {
      //   name: "",
      //   tel: ""
      // };
    },
    deleteHandler(index) {
      let target = this.contacts[index];
      if (confirm(`是否刪除 ${target.name} ?`)){
        this.loading = true;
        axios.delete("http://localhost:8888/contact/" + target.id)
        .then((res)=>{
          this.contacts.splice(index, 1);
          this.cancelHandler();
          this.loading = false;
        })
        .catch((err)=>{
        console.log(err);
      })
      } else this.loading = false;
    },
    editHandler(index) {
      let { name, tel } = this.contacts[index]
      // this.input.name = name
      // this.input.tel = tel
      this.editIndex = index;
      this.input = {
        name,
        tel
      }
    }
  },
  mounted() {
      this.loading = true
      axios.get("http://localhost:8888/contact")
      .then((res)=>{
        console.log(res.data);
        this.contacts = res.data;
        this.loading = false;  
      })
      .catch((err)=>{
        console.log(err);
      })
  }
}).mount("#app");