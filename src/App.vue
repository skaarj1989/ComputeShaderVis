<template>
  <v-app>
    <v-app-bar app color="primary" dark dense>
      <v-menu bottom left offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <!-- Dispatch compute: -->

          <v-menu :close-on-content-click="false" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon class="mr-3">
                  <v-icon>calculate</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Dispatch</v-list-item-title>
              </v-list-item>
            </template>
            <v-card max-width="300">
              <v-card-title>DispatchCompute</v-card-title>
              <v-divider />
              <v-card-text>
                <v-row>
                  <v-col cols="12">
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
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pt-0 mt-0">
                    <v-btn
                      @click="
                        $store.dispatch('dispatchCompute', {
                          localNumWorkGroups,
                          localWorkGroupSize,
                        })
                      "
                      >dispatch</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-menu>

          <!-- Image settings: -->

          <v-menu :close-on-content-click="false" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon class="mr-3">
                  <v-icon>aspect_ratio</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Image</v-list-item-title>
              </v-list-item>
            </template>
            <v-card max-width="300">
              <v-card-title>Image</v-card-title>
              <v-divider />
              <v-card-text>
                <v-row>
                  <v-col class="pr-1 mr-0 pb-0 mb-0">
                    <v-text-field
                      v-model.number="localImageSize.x"
                      label="image_width"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col class="pl-1 ml-0 pb-0 mb-0">
                    <v-text-field
                      v-model.number="localImageSize.y"
                      label="image_height"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pt-0 mt-0">
                    <v-btn
                      @click="$store.dispatch('adjustImage', localImageSize)"
                    >
                      adjust
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-menu>

          <!-- Other settings: -->

          <v-menu :close-on-content-click="false" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon class="mr-3">
                  <v-icon>settings</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item>
            </template>
            <v-card min-width="300">
              <v-card-title>Settings</v-card-title>
              <v-divider />
              <v-card-text>
                <v-row>
                  <v-col class="pt-0 mt-0 pb-0 mb-0">
                    <v-radio-group v-model="originUpperLeft" label="origin">
                      <v-radio label="upperLeft" :value="true"></v-radio>
                      <v-radio label="lowerLeft" :value="false"></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-slider
                      v-model="tileSize"
                      label="tileSize"
                      thumb-label="always"
                      min="2"
                      max="64"
                      step="2"
                    ></v-slider>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-list>
      </v-menu>
      <v-toolbar-title>ComputeShaderVis</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-card>
          <v-card-text class="justify-center">
            <v-menu absolute open-on-click>
              <template v-slot:activator="{ on, attrs }">
                <compute-shader-vis
                  @select="(evt) => (selectedItem = evt)"
                  :listener="on"
                  :attrs="attrs"
                ></compute-shader-vis
              ></template>
              <v-card>
                <v-card-text>
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th>GLSL</th>
                          <th>HLSL</th>
                          <th>value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{{ semantics.numWorkGroups.glsl }}</td>
                          <td>{{ semantics.numWorkGroups.hlsl }}</td>
                          <td>{{ $store.getters.numWorkGroups }}</td>
                        </tr>
                        <tr>
                          <td>{{ semantics.workGroupSize.glsl }}</td>
                          <td>{{ semantics.workGroupSize.hlsl }}</td>
                          <td>{{ $store.getters.workGroupSize }}</td>
                        </tr>
                        <tr
                          v-for="(value, key) in selectedItem"
                          :key="`prop-${key}`"
                        >
                          <td>{{ semantics[key].glsl }}</td>
                          <td>{{ semantics[key].hlsl }}</td>
                          <td>{{ value }}</td>
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
    this.localNumWorkGroups = { ...this.$store.getters.numWorkGroups };
    this.localWorkGroupSize = { ...this.$store.getters.workGroupSize };
    this.localImageSize = { ...this.$store.getters.imageSize };
  },

  data() {
    return {
      selectedItem: null,

      localNumWorkGroups: null,
      localWorkGroupSize: null,

      localImageSize: null,

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
