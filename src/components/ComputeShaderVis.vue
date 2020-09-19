<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="graphSize.x"
    :height="graphSize.y"
  >
    <defs>
      <marker
        id="endarrow"
        markerWidth="8"
        markerHeight="7"
        refX="5"
        refY="2.5"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <polygon points="0 0, 8 2.5, 0 5" fill="rgb(0, 0, 0)" />
      </marker>
    </defs>
    <g transform="translate(10, 10)">
      <!-- upper arrow (width) -->
      <text x="17" y="0">image width: {{ imageSize.x }}</text>
      <line x1="17" y1="8" :x2="graphWidth" y2="8" />

      <!-- left arrow (height) -->
      <text
        x="0"
        y="0"
        :transform="
          `translate(${originUpperLeft ? -10 : 0}, ${
            originUpperLeft ? 20 : graphHeight
          }) rotate(${originUpperLeft ? 90 : -90}, 0, 0)`
        "
      >
        image height: {{ imageSize.y }}
      </text>
      <line
        x1="8"
        :y1="originUpperLeft ? 17 : graphHeight"
        x2="8"
        :y2="originUpperLeft ? graphHeight : 27"
      />
    </g>

    <!-- workgroups: -->
    <g v-on="listener" v-bind="attrs" transform="translate(20, 20)">
      <template v-for="(n, y) in numWorkGroups.y">
        <template v-for="(m, x) in numWorkGroups.x">
          <work-group
            @click="(itemInfo) => $emit('select', itemInfo)"
            :key="`work-group-${x}-${y}`"
            :i-d="{ x, y, z: 0 }"
          />
        </template>
      </template>
    </g>
  </svg>
</template>

<script>
import { mapGetters } from "vuex";
import WorkGroup from "./WorkGroup.vue";

export default {
  name: "ComputeShaderVis",
  components: { WorkGroup },

  props: ["listener", "attrs"],
  computed: {
    ...mapGetters([
      "originUpperLeft",
      "tileSize",
      "numWorkGroups",
      "workGroupSize",
      "workGroupPadding",
      "imageSize",
    ]),

    graphWidth() {
      const { numWorkGroups, workGroupSize, workGroupPadding, tileSize } = this;
      return (
        numWorkGroups.x * workGroupSize.x * tileSize +
        (numWorkGroups.x + 1) * workGroupPadding
      );
    },
    graphHeight() {
      const { numWorkGroups, workGroupSize, tileSize, workGroupPadding } = this;
      return (
        numWorkGroups.y * workGroupSize.y * tileSize +
        (numWorkGroups.y + 1) * workGroupPadding
      );
    },

    graphSize() {
      const { workGroupPadding, graphWidth, graphHeight } = this;
      return {
        x: graphWidth + 3 * workGroupPadding,
        y: graphHeight + 3 * workGroupPadding,
      };
    },
  },
};
</script>

<style>
svg {
  border-style: solid;
  border-width: 0px;
}
line {
  stroke: rgb(0, 0, 0);
  stroke-width: 2;
  marker-end: url(#endarrow);
}
</style>
