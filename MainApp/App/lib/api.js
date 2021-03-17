class Api {
  static headers() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'dataType': 'json',
    }
  }

  static get(route) {
    return this.xhr(route, null, 'GET');
  }

  static put(route, params) {
    return this.xhr(route, params, 'PUT')
  }

  static post(route, params) {
    return this.xhr(route, params, 'POST')
  }

  static delete(route, params) {
    return this.xhr(route, params, 'DELETE')
  }

  static xhr(route, params, verb) {

    const host = 'http://157.230.63.199/api'  //http://157.245.141.138/api
    const url = `${host}/${route}`
    let options = Object.assign({ method: verb }, params ? { body: JSON.stringify(params) } : null);
    options.headers = Api.headers()
    return fetch(url, options).then(resp => {
      let json = resp.json();
      if (resp.ok) {
        return json
      }
      return json.then(err => { throw err });
    }).then(json => {
      console.log('Api response is ------------->>>>>>', json);
      return json;
    }).catch((err) => {
      console.log('error', err)
      throw err
    })
  }
}
export default Api
