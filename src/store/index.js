import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",

  state: {
    originUpperLeft: true, // false = lower-left
    tileSize: 12, // size of single invocation/thread, in pixels,

    numWorkGroups: { x: 5, y: 3, z: 1 },
    workGroupSize: { x: 16, y: 16, z: 1 },

    imageSize: { x: 1280, y: 720 },
    desiredPPI: 1,
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
    setDesiredPPI(state, value) {
      state.desiredPPI = value;
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
    desiredPPI: (state) => state.desiredPPI,
    /*
    pixelsPerInvocation: (state) => {
      const { numWorkGroups, workGroupSize, imageSize } = state;
      return {
        x: imageSize.x / (numWorkGroups.x * workGroupSize.x),
        y: imageSize.y / (numWorkGroups.y * workGroupSize.y),
      };
    },
    */
  },
  actions: {
    dispatchCompute({ commit }, payload) {
      commit("setNumWorkGroups", payload.localNumWorkGroups);
      commit("setWorkGroupSize", payload.localWorkGroupSize);
    },
    adjustImage({ commit }, payload) {
      commit("setImageSize", payload.imageSize);
      commit("setDesiredPPI", payload.desiredPPI);
    },
  },
});
