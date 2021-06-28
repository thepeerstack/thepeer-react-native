import axios from 'axios';

axios.defaults.baseURL = 'https://chain.api.thepeer.co/send/';
axios.defaults.headers.Accept = 'application/json';
axios.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleCatch = ({ response, resolve }) => {
  if (response) {
    const { data, status } = response;
    return resolve({ data, status });
  } else {
    return resolve({ data: {}, status: null });
  }
};

const getFunc = (path, payload) => {
  return new Promise((resolve, reject) => {
    axios
      .get(path, payload)
      .then((response) => {
        return resolve(response);
      })
      .catch(({ response }) => handleCatch({ response, resolve }));
  });
};

const postFunc = (path, payload) => {
  return new Promise((resolve, reject) => {
    axios
      .post(path, payload)
      .then((response) => {
        return resolve(response);
      })
      .catch(({ response }) => handleCatch({ response, resolve }));
  });
};

export { getFunc, postFunc, axios };
