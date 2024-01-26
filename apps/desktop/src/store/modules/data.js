
const state = {
  dataType: { // 所有类型的数据
    joint: { key: 'joint', label: '关节', data: [] }
    // pose: {key: "pose", label: "位姿", data: []},
  },
  currentJoints: [0.0, 0.0, 0.0, 0.0, 0.0],
  poseVelocity: [0.0, 0.0, 0.0, 0.0, 0.0],
  currentLeftArm: [0.0, 0.0, 0.0],
  currentRightArm: [0.0, 0.0, 0.0],
  axisCoor: [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
  buildInData: [
    {
      value: 'stage',
      label: 'stage',
      children: [
        {
          value: 'stage_1',
          label: 'stage_1'
        }
      ]
    },
    {
      value: 'stage_mid_point',
      label: 'stage_mid_point',
      children: [
        {
          value: 'stage_mid_point_1',
          label: 'stage_mid_point_1'
        }
      ]
    },


  ],
  describe: {
  },
  vacuumBuildInData: [
    {
      value: '内置点位',
      label: '内置点位',
      children: [
        {
          value: 'HOME',
          label: 'HOME'
        }
      ]
    }
  ]
}

const getters = {
  // test : state => {
  //   return state.testData
  // }
}

const mutations = {
  /**
   * 设置某一类型的数据
   * @param state
   * @param dataTypeKey state.data的key，比如JOINT、SPEED
   * @param data
   * @constructor
   */
  setData (state, [dataType, data]) {
    Object.keys(state.dataType).forEach(key => {
      if (state.dataType[key].key === dataType.key) { state.dataType[key].data = data }
    })
  },

  setCurrentJoints (state, joints) {
    state.currentJoints = joints
  },

  setCurrentLeftArm (state, leftArm) {
    state.currentLeftArm = leftArm
  },

  setCurrentRightArm (state, rightArm) {
    state.currentRightArm = rightArm
  },

  setPoseVelocity (state, poseVelocity) {
    state.poseVelocity = poseVelocity
  },

  setAxisCoor (state, axisCoor) {
    state.axisCoor = axisCoor
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
