import axios from "axios";

const fetcher = <T>(url: string, headers = {}): Promise<T> =>
  axios.get<T>(url, { headers, withCredentials: true }).then((res) => {
    return res.data;
  });


export default fetcher;