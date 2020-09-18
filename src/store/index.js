import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",

  state: {
    originUpperLeft: true, // false = lower-left
    tileSize: 16, // size of single invocation/thread, in pixels,

    numWorkGroups: { x: 3, y: 3, z: 1 },
    workGroupSize: { x: 16, y: 16, z: 1 },

    imageSize: { x: 512, y: 512 },
  },
  mutations: {
    setOriginUpperLeft: (state) => (state.originUpperLeft = true),
    setOriginLowerLeft: (state) => (state.originUpperLeft = false),
    setTileSize: (state, value) => (state.tileSize = value),

    setNumWorkGroups(state, numWorkGroups) {
      state.numWorkGroups = { ...numWorkGroups };
    },
    setWorkGroupSize(state, workGroupSize) {
      state.workGroupSize = { ...workGroupSize };
    },

    setImageSize(state, imageSize) {
      state.imageSize = { ...imageSize };
    },
  },
  getters: {
    originUpperLeft: (state) => state.originUpperLeft,
    originLowerLeft: (state) => !state.originUpperLeft,
    tileSize: (state) => state.tileSize,

    numWorkGroups: (state) => state.numWorkGroups,
    workGroupSize: (state) => state.workGroupSize,

    workGroupPadding: (state) => state.tileSize / 2,
    workGroupTileSize: (state) => {
      const { workGroupSize, tileSize } = state;
      return {
        x: workGroupSize.x * tileSize,
        y: workGroupSize.y * tileSize,
      };
    },

    imageSize: (state) => state.imageSize,
  },
  actions: {
    dispatchCompute({ commit }, params) {
      commit("setNumWorkGroups", params.localNumWorkGroups);
      commit("setWorkGroupSize", params.localWorkGroupSize);
    },
    adjustImage({ commit }, imageSize) {
      commit("setImageSize", imageSize);
    },
  },
});
