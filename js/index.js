new Vue({
    el: "#app",
    data: {
        list: null, //總資料
        listType: null, //類型分類
        pages: 0, //頁碼
        currentPage: 1, //分頁
        isShow: false, //下拉選單是否出現
        changeAngle: { //綁定下拉選單的 icon
            'up': false
        },
        dropDownMenu:{ //綁定漢堡選單
            ulShow: false
        },
        itemTitle: "全部列表", //下拉選單的分類
        infoDataTotal: [], // 存到 client 的資料
        infoDataLength: null, //我的最愛個數
    },
    methods:{
        findAll(all){ //出現全部資料
            this.pages = Math.ceil(this.list.data.length / 6);
            this.itemTitle = all;
        },
        add(id, pic, name, address, tel, intro){ //加到我的最愛
            // console.log(pic, name, address, tel, intro);
            let infoData = {
                "id": id,
                "pic": pic,
                "name": name,
                "address": address,
                "tel": tel,
                "intro": intro,
            };

            let itemInArr = this.infoDataTotal.find(item => {
                return item.id === infoData.id;
            });

            if(itemInArr){
                return false;
            }else{
                this.infoDataTotal.push(infoData)
            }

            localStorage.setItem('data', JSON.stringify(this.infoDataTotal))
            this.infoDataLength = this.infoDataTotal.length
        },
        filterItem(item){ //篩選特定分類
            // console.log(item);
            this.listType = item;
            let newList = this.list.data.filter((list) => {
                return list.category[0].name === this.listType;
            })
            this.pages = Math.ceil(newList.length / 6);
            this.currentPage = 1;
            this.itemTitle = item;
        },
        show(){ //判斷下拉式選單出現與 icon 的 rotate
            if(this.isShow == false && this.changeAngle.up == false){
                this.isShow = true
                this.changeAngle.up = true
            }else if(this.isShow == true && this.changeAngle.up == true){
                this.isShow = false
                this.changeAngle.up = false
            }
        },
        toPage(i){ //判斷目前點選的頁面
            // console.log(i);
            this.currentPage = i;
        },
        left(){ //點擊頁碼上一頁
            this.currentPage--;
            if(this.currentPage <= 0){
                this.currentPage=1
            };
        },
        right(){ //點擊頁碼下一頁
            this.currentPage++;
            if(this.currentPage >= this.pages){
                this.currentPage = this.pages
            };
        },
        showUl(){ //判斷漢堡選單出現
            if(this.dropDownMenu.ulShow == false){
                this.dropDownMenu.ulShow = true
            }else{
                this.dropDownMenu.ulShow = false
            }
        }
    },
    computed:{
        filterList(){ //篩選資料並做 v-for 使用
            if(!this.listType){
                return this.list.data.slice((this.currentPage - 1)*6, this.currentPage * 6)
            }else if(this.itemTitle == "全部列表"){
                return this.list.data.slice((this.currentPage - 1)*6, this.currentPage * 6)
            }else{
                let newList = this.list.data.filter((list) => {
                    return list.category[0].name === this.listType;
                })
                newList = newList.slice((this.currentPage - 1)*6, this.currentPage * 6)
                return newList;
            }
        },
        filterCategory(){ //篩選出分類類表做 v-for 使用
            let updateCategory = [];
            for(let i = 0; i < this.list.data.length; i++){
                let name = this.list.data[i].category[0].name
                updateCategory.push(name)
            }
            let result = updateCategory.filter(function(element, index, arr){
                return arr.indexOf(element) === index;
            });
            return result;
        }
    },
    mounted() {
        let data = localStorage.getItem('data')
        if(data != null){ //網頁重新整理後資料仍存在
            this.infoDataTotal = JSON.parse(data)
            this.infoDataLength = this.infoDataTotal.length
        }else{
            this.infoDataLength = null
        }

        fetch('./travel_taipei.json') //抓取資料
        .then(resp => resp.json())
        .then(resp => {
            this.list = resp
            this.pages = Math.ceil(this.list.data.length / 6); //給頁碼
        });

    }
})