<template>
  <g :transform="translate" class="tiles">
    <template v-for="(n, y) in workGroupSize.y">
      <template v-for="(m, x) in workGroupSize.x">
        <invocation-thread
          @click="(evt) => $emit('click', { ...workGroupInfo, ...evt })"
          :key="`invocation-${x}-${y}`"
          :i-d="{ x, y, z: 0 }"
        />
      </template>
    </template>
  </g>
</template>

<script>
import { mapGetters } from "vuex";
import InvocationThread from "./InvocationThread.vue";

export default {
  name: "WorkGroup",
  components: { InvocationThread },

  props: {
    ID: { type: Object, required: true },
  },
  computed: {
    ...mapGetters([
      "originUpperLeft",
      "numWorkGroups",
      "workGroupSize",
      "workGroupTileSize",
      "workGroupPadding",
    ]),

    translate() {
      const { position } = this;
      return `translate(${position.x}, ${position.y})`;
    },
    position() {
      const {
        originUpperLeft,
        numWorkGroups,
        workGroupTileSize,
        workGroupPadding,
        ID,
      } = this;
      let y;
      if (originUpperLeft) {
        y =
          workGroupPadding +
          ID.y * workGroupPadding +
          ID.y * workGroupTileSize.y;
      } else {
        y =
          (numWorkGroups.y - 1 - ID.y) * workGroupTileSize.y +
          (numWorkGroups.y - ID.y) * workGroupPadding;
      }
      return {
        x:
          workGroupPadding +
          ID.x * workGroupPadding +
          ID.x * workGroupTileSize.x,
        y,
      };
    },

    workGroupInfo() {
      const { ID } = this;
      return { workGroupID: ID };
    },
  },
};
</script>

<style>
g .tiles :hover {
  fill-opacity: 1;
}
</style>
