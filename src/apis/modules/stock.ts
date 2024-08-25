import { get } from '../request';

export default class Stock {

  
  //取得股票或指數列表
  static async getStockList (type: string, market: string, industry: string ) {
    return get(`https://api.fugle.tw/marketdata/v1.0/stock/intraday/tickers`,{
      type,
      market,
      industry,
    });
  }

  //取得股票基本資料（依代碼查詢）
  static async getStockInfo (symbol: string | number) {
    return get(`https://api.fugle.tw/marketdata/v1.0/stock/intraday/ticker/${symbol}`);
  }

  static async getStockHeatMap (symbol: string | number) {
    return get(`https://script.google.com/macros/s/AKfycbx3YfCrwKV4W6omR2W7_amxfazGQjndEMOxNUS8omsIn7jTfrruyDrAq3JZxpMp5YCEfA/exec`,{
      symbol: symbol
    });
  }
  
  // static async getRPActivityInfo () {
  //   return get('/public/', {
  //       service : 'Activity.getRPActivityInfo',
  //   });
  // }

}

//https://www.wantgoo.com/blog/daily-featured-section-data?page=1
//https://www.wantgoo.com/stock/2454/enterprise-value/all
