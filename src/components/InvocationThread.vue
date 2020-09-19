<template>
  <rect
    @click="$emit('click', invocationInfo)"
    :class="color"
    :x="position.x"
    :y="position.y"
    rx="1"
    ry="1"
    :width="tileSize"
    :height="tileSize"
  />
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "InvocationThread",

  props: {
    ID: { type: Object, required: true },
  },
  computed: {
    ...mapGetters([
      "originUpperLeft",
      "tileSize",
      "workGroupSize",
      "imageSize",
      "desiredPPI",
    ]),

    position() {
      const { originUpperLeft, tileSize, workGroupSize, ID } = this;
      return {
        x: ID.x * tileSize,
        y: (originUpperLeft ? ID.y : workGroupSize.y - 1 - ID.y) * tileSize,
      };
    },
    color() {
      const { imageSize, desiredPPI, globalInvocationID } = this;
      const fits =
        globalInvocationID.x * desiredPPI < imageSize.x &&
        globalInvocationID.y * desiredPPI < imageSize.y;
      return fits ? "fits" : "out-of-range";
    },

    invocationInfo() {
      const { ID, localInvocationIndex, globalInvocationID } = this;
      return {
        localInvocationID: ID,
        localInvocationIndex,
        globalInvocationID,
      };
    },

    localInvocationIndex() {
      const { workGroupSize, ID } = this;
      return (
        ID.z * workGroupSize.x * workGroupSize.y + ID.y * workGroupSize.x + ID.x
      );
    },
    globalInvocationID() {
      const { workGroupSize, ID } = this;
      const workGroupId = this.$parent.ID;
      return {
        x: workGroupId.x * workGroupSize.x + ID.x,
        y: workGroupId.y * workGroupSize.y + ID.y,
        z: 0,
      };
    },
  },
};
</script>

<style>
rect {
  stroke: rgb(34, 34, 34);
  stroke-width: 1;
  fill-opacity: 0.6;
}
.fits {
  fill: rgb(64, 224, 64);
}
.out-of-range {
  fill: rgb(224, 64, 64);
}
</style>
