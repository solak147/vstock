import { get } from '../request';

export default class Stock {

  static async getStockInfo (symbol: string | number) {
    return get(`https://api.fugle.tw/marketdata/v1.0/stock/intraday/ticker/${symbol}`);
  }

  static async getRPActivityInfo () {
    return get('/public/', {
        service : 'Activity.getRPActivityInfo',
    });
  }

}
