import { get } from '../request';

export default class RedEnvelope {

  static async getRPActivityInfo () {
    return get('/public/', {
        service : 'Activity.getRPActivityInfo',
    });
  }

}
