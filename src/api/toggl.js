import axios from "axios";

export default axios.create({
    baseURL: "https://api.track.toggl.com/api/v9",
    headers: {
      Authorization:
        "Basic <<ACCESS_TOKEN>>",
    },
  });