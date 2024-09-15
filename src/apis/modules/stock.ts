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

  //取得 1 年內的上市櫃歷史股價（依代碼查詢），個股資料區間最遠可回溯至 2010 年，指數部分最遠可回溯至 2015 年！
  static async getStockHistory (symbol: string | number, timeframe: string, from: string, to: string) {
    return get(`https://api.fugle.tw/marketdata/v1.0/stock/historical/candles/${symbol}`,{
      timeframe,
      from,
      to
    });
  }

  //取得 Ptt文章
  static async getPttArticle (symbol: string | number) {
    return get(`https://script.google.com/macros/s/AKfycbx3YfCrwKV4W6omR2W7_amxfazGQjndEMOxNUS8omsIn7jTfrruyDrAq3JZxpMp5YCEfA/exec`,{
      symbol: symbol,
      action: 'getPttArticle'
    });
  }
  
  //取得 熱力圖
  static async getStockHeatMap (symbol: string | number) {
    return get(`https://script.google.com/macros/s/AKfycbx3YfCrwKV4W6omR2W7_amxfazGQjndEMOxNUS8omsIn7jTfrruyDrAq3JZxpMp5YCEfA/exec`,{
      symbol: symbol,
      action: 'getHeatMap'
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


//https://www.fugle.tw/api/v2/data/contents/FCNT000099?symbol_id=IX0001
//https://www.fugle.tw/api/v2/data/contents/FCNT000039?symbol_id=IX0001