import axios from "axios";
const api = axios.create({ baseURL:"http://localhost:5000/api" });
api.interceptors.request.use(req=>{
  const t=localStorage.getItem("token");
  if(t) req.headers.Authorization=`Bearer ${t}`;
  return req;
});
export default api;