import api from "./api";

export const pollService = {
  async createPoll(question, options) {
    const { data } = await api.post("/polls", { question, options });
    return data;
  },

  async getPolls() {
    const { data } = await api.get("/polls");
    return data;
  },

  async vote(pollId, optionIndex) {
    const { data } = await api.post("/polls/vote", { pollId, optionIndex });
    return data;
  },
};
