const defaultList = [
  {
    id: 1,
    name: '鍟嗗搧1',
    price: 100,
    categoryId: '1',
    img: 'http://www.baidu.com/1.jpg',
  },
  {
    id: 2,
    name: '鍟嗗搧2',
    price: 200,
    categoryId: '2',
    img: 'http://www.baidu.com/2.jpg',
  },
  {
    id: 3,
    name: '鍟嗗搧3',
    price: 300,
    categoryId: '3',
    img: 'http://www.baidu.com/3.jpg',
  }
]

class GoodService {
  list = [];

  constructor (){
    this._loadData();
  }

  // 鏍规嵁id鑾峰彇鍗曚釜鍟嗗搧
  getGoodById(id) {
    return this.list.find(item => item.id === id);
  }
  
  // 鑾峰彇鍟嗗搧鍒楄〃
  getGoodList() {
    return this.list;
  }

  // 娣诲姞鍟嗗搧
  addGood(good) {
    this.list.push(good);
    this._saveData();
  }

  // 鍒犻櫎鍟嗗搧
  deleteGood(id) {
    this.list = this.list.filter(item => item.id !== id);
    this._saveData();
  }

  // 鏇存柊鍟嗗搧
  updateGood(good) {
    this.list = this.list.map(item => {
      if (item.id === good.id) {
        return good;
      }
      return item;
    });
    this._saveData();
  }


  // 灏嗘暟鎹瓨鍏ュ埌localstorage涓?
  _saveData() {
    localStorage.setItem('goodList', JSON.stringify(this.list));
  }

  _loadData() {
    const list = localStorage.getItem('goodList');
    if (list) {
      this.list = JSON.parse(list);
    } else {
      this.list = defaultList;
      this._saveData();
    }
  }
}

const goodService = new GoodService()
export default goodService;