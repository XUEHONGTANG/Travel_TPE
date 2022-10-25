new Vue({
    el: "#app",
    data: {
        infoData:[],
        infoDataLength: null,
        pages: 0,
        currentPage: 1,
        id: null,
        name: null,
        address: null,
        tel: "",
        intro: "",
        isShow: false,
        hasData: false,
        dropDownMenu:{
            ulShow: false
        },
    },
    methods: {
        edit(id, name, address, tel, intro){ //編輯資料
            this.id = id;
            this.name = name;
            this.address = address;
            this.tel = tel;
            this.intro = intro;
            this.isShow = true;
        },
        save(){ //儲存資料
            let telReg = /^(09)[0-9]{8}$/; //手機格式
            if(this.name == "" || this.address == "" || this.tel == "" || this.intro == ""){ //驗證資料都需要有值
                alert("請輸入完整資訊!")
            }else if(this.intro.length < 50){
                alert("基本介紹不能小於50字")
            }else if(!telReg.test(this.tel)){ //驗證手機格式
                alert('請輸入正確的手機格式!')
            }else{
                this.infoData.filter((item) => { //確認 id 是否一致
                    if(this.id == item.id){
                        item.name = this.name
                        item.intro = this.intro
                        item.address = this.address
                        item.tel = this.tel
                        return this.infoData
                    }
                });
                localStorage.setItem('data',JSON.stringify(this.infoData))
                this.isShow = false;
            }
        },
        remove(id){ //移除我的最愛
            this.infoData = this.infoData.filter((item)=>{
                return item.id != id
            });
            localStorage.setItem('data',JSON.stringify(this.infoData))
            alert("已從最愛列表移除!")
            
            let data = localStorage.getItem('data') //判斷 localStorage是否為空值，如果是就清空
            if(typeof(data) == 'string'){
                localStorage.removeItem('data')
            }
            this.infoDataLength = this.infoData.length //更新我的最愛個數

            if(this.infoDataLength == 0 || this.infoDataLength == null){
                this.hasData = true
            }else{
                this.hasData = false
            }   
        },
        toPage(i){
            // console.log(i);
            this.currentPage = i;
        },
        left(){
            this.currentPage--;
            if(this.currentPage <= 0){
                this.currentPage=1
            };
        },
        right(){
            this.currentPage++;
            if(this.currentPage >= this.pages){
                this.currentPage = this.pages
            };
        },
        showUl(){
            if(this.dropDownMenu.ulShow == false){
                this.dropDownMenu.ulShow = true
            }else{
                this.dropDownMenu.ulShow = false
            }
        }
    },
    computed: {
        favoriteList(){
            if(this.infoData != null){ //確認是否有資料
                return this.infoData.slice((this.currentPage - 1)*6, this.currentPage * 6)
            }
        }
    },
    mounted(){
        let infoDataTotal = localStorage.getItem('data') //抓取資料
        this.infoData = JSON.parse(infoDataTotal)
        this.pages = Math.ceil(this.infoData.length / 6);
        this.infoDataLength = this.infoData.length //確保我的最愛個數資料
    }

});
