<template>
  <v-app>
    <v-navigation-drawer
      v-model="settingsDrawer"
      color="grey lighten-5"
      app
      left
    >
      <v-list>
        <v-card flat color="transparent">
          <v-card-title>Dispatch</v-card-title>
          <v-card-text>
            <v-row>
              <v-col class="pr-1 mr-0 pb-0 mb-0">
                <v-text-field
                  v-model.number="localNumWorkGroups.x"
                  label="num_groups_x"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col class="pl-1 ml-0 pb-0 mb-0">
                <v-text-field
                  v-model.number="localNumWorkGroups.y"
                  label="num_groups_y"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pr-1 mr-0 pt-0 mt-0">
                <v-text-field
                  v-model.number="localWorkGroupSize.x"
                  label="local_size_x"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col class="pl-1 ml-0 pt-0 mt-0">
                <v-text-field
                  v-model.number="localWorkGroupSize.y"
                  label="local_size_y"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-0 mt-0 pb-0 mb-0 text-right">
                <v-btn
                  @click="
                    $store.dispatch('dispatchCompute', {
                      localNumWorkGroups,
                      localWorkGroupSize,
                    })
                  "
                  color="primary"
                  small
                  depressed
                >
                  dispatch
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-divider />
        <v-card flat color="transparent">
          <v-card-title>Image</v-card-title>
          <v-card-text>
            <v-row>
              <v-col class="pr-1 mr-0 pb-0 mb-0">
                <v-text-field
                  v-model.number="localImageSize.x"
                  label="width"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col class="pl-1 ml-0 pb-0 mb-0">
                <v-text-field
                  v-model.number="localImageSize.y"
                  label="height"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8" class="pt-0 mt-0 pb-0 mb-0">
                <v-text-field
                  v-model.number="localDesiredPPI"
                  label="pixels per invocation"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-0 mt-0 pb-0 mb-0 text-right">
                <v-btn
                  @click="
                    $store.dispatch('adjustImage', {
                      imageSize: localImageSize,
                      desiredPPI: localDesiredPPI,
                    })
                  "
                  color="primary"
                  small
                  depressed
                >
                  adjust
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-divider />
        <v-card flat color="transparent">
          <v-card-text>
            <v-row>
              <v-col class="pt-0 mt-0 pb-0 mb-0">
                <v-radio-group v-model="originUpperLeft" label="Origin" dense>
                  <v-radio label="Upper-left" :value="true"></v-radio>
                  <v-radio label="Lower-left" :value="false"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-0 mt-0 pb-0 mb-0">
                <v-radio-group
                  v-model="selectedShadingLang"
                  label="Shading language"
                  dense
                >
                  <v-radio label="GLSL" value="glsl"></v-radio>
                  <v-radio label="HLSL" value="hlsl"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-1 mt-1">
                <v-slider
                  v-model.number="tileSize"
                  label="Tile size"
                  thumb-label="always"
                  thumb-size="26"
                  min="2"
                  max="64"
                  step="2"
                  dense
                ></v-slider>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark color="primary" dense>
      <v-app-bar-nav-icon
        @click.stop="settingsDrawer = !settingsDrawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>ComputeShaderVis</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-card class="scroll">
          <v-card-text>
            <v-menu absolute open-on-click :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <compute-shader-vis
                  @select="(itemInfo) => (selectedItem = itemInfo)"
                  :listener="on"
                  :attrs="attrs"
                ></compute-shader-vis
              ></template>
              <v-card tile>
                <v-card-text>
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th>{{ selectedShadingLang }}</th>
                          <th>value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(infoValue, infoKey) in selectedItem"
                          :key="`prop-${infoKey}`"
                        >
                          <td>{{ semantics[infoKey][selectedShadingLang] }}</td>
                          <td>
                            <template v-if="typeof infoValue == 'object'">
                              <v-chip
                                v-for="(propValue, propKey) in infoValue"
                                :key="propKey"
                                :color="`${axesColors[propKey]} lighten-1`"
                                text-color="white"
                                small
                                label
                              >
                                <span class="font-weight-bold"
                                  >{{ propKey }}={{ propValue }}</span
                                >
                              </v-chip>
                            </template>
                            <template v-else>
                              <v-chip small label>
                                <span class="font-weight-bold">
                                  {{ infoValue }}
                                </span>
                              </v-chip>
                            </template>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ComputeShaderVis from "./components/ComputeShaderVis";

export default {
  name: "App",
  components: { ComputeShaderVis },

  beforeMount() {
    const {
      numWorkGroups,
      workGroupSize,
      imageSize,
      desiredPPI,
    } = this.$store.getters;

    this.localNumWorkGroups = { ...numWorkGroups };
    this.localWorkGroupSize = { ...workGroupSize };
    this.localImageSize = { ...imageSize };
    this.localDesiredPPI = desiredPPI;
  },

  data() {
    return {
      settingsDrawer: true,

      selectedItem: null, // workgroup & invocation info

      localNumWorkGroups: null,
      localWorkGroupSize: null,
      localImageSize: null,
      localDesiredPPI: 1,

      selectedShadingLang: "glsl",
      semantics: {
        numWorkGroups: {
          glsl: "gl_NumWorkGroups",
          hlsl: "(non-existent)",
          description: "",
        },
        workGroupSize: {
          glsl: "gl_WorkGroupSize",
          hlsl: "(non-existent)",
          description: "",
        },
        workGroupID: {
          glsl: "gl_WorkGroupID",
          hlsl: "SV_GroupID",
          description: "",
        },
        localInvocationID: {
          glsl: "gl_LocalInvocationID",
          hlsl: "SV_GroupThreadID",
          description: "",
        },
        localInvocationIndex: {
          glsl: "gl_LocalInvocationIndex",
          hlsl: "SV_GroupIndex",
          description: "",
        },
        globalInvocationID: {
          glsl: "gl_GlobalInvocationID",
          hlsl: "SV_DispatchThreadID",
          description: "",
        },
      },
      axesColors: { x: "red", y: "green", z: "blue" },
    };
  },
  computed: {
    originUpperLeft: {
      get() {
        return this.$store.state.originUpperLeft;
      },
      set(value) {
        value
          ? this.$store.commit("setOriginUpperLeft")
          : this.$store.commit("setOriginLowerLeft");
      },
    },
    tileSize: {
      get() {
        return this.$store.state.tileSize;
      },
      set(value) {
        this.$store.commit("setTileSize", value);
      },
    },
  },
};
</script>

<style>
html {
  overflow-y: auto !important;
}
.scroll {
  overflow: auto;
}
</style>
